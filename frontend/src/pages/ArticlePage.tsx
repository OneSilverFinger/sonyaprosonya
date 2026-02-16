import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { addComment, fetchArticle } from '../api';
import type { Article, Comment } from '../api';
import { useToast } from '../toast';

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ author_name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const loadArticle = () => {
    if (!id) return;
    setLoading(true);
    fetchArticle(id)
      .then(setArticle)
      .catch((err) => {
        setError(err.message);
        toast.push(err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !form.author_name.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const comment: Comment = await addComment(id, {
        author_name: form.author_name.trim(),
        content: form.content.trim(),
      });
      setArticle((prev) =>
        prev
          ? {
              ...prev,
              comments: [comment, ...(prev.comments ?? [])],
              comments_count: (prev.comments_count ?? 0) + 1,
            }
          : prev,
      );
      setForm({ author_name: '', content: '' });
      toast.push('Комментарий добавлен', 'success');
    } catch (err: any) {
      setError(err.message);
      toast.push(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Загружаем статью…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!article) return <p>Статья не найдена.</p>;

  return (
    <article className="article-page">
      <div className="card">
        <div className="card-meta">
          <span>{new Date(article.created_at).toLocaleString()}</span>
          {article.comments_count !== undefined && (
            <span>{article.comments_count} комментариев</span>
          )}
        </div>
        <h1>{article.title}</h1>
        <p className="article-body">{article.content}</p>
      </div>

      <section className="comments">
        <h3>Комментарии</h3>
        <div className="comment-list">
          {(article.comments ?? []).map((comment) => (
            <div className="comment" key={comment.id}>
              <div className="comment-meta">
                <strong>{comment.author_name}</strong>
                <span>{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
          {(article.comments ?? []).length === 0 && <p>Пока нет комментариев.</p>}
        </div>

        <form className="card form" onSubmit={handleSubmit}>
          <h4>Добавить комментарий</h4>
          <label>
            Имя
            <input
              type="text"
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              required
              placeholder="Ваше имя"
            />
          </label>
          <label>
            Комментарий
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              placeholder="Поделитесь мнением"
              rows={4}
            />
          </label>
          <button type="submit" disabled={submitting} className="comment-submit">
            {submitting ? 'Отправляем…' : 'Отправить комментарий'}
          </button>
        </form>
      </section>
    </article>
  );
}

export default ArticlePage;
