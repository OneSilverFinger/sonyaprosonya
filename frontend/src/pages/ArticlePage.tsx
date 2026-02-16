import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { addComment, fetchArticle } from '../api';
import type { Article, Comment } from '../api';

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ author_name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadArticle = () => {
    if (!id) return;
    setLoading(true);
    fetchArticle(id)
      .then(setArticle)
      .catch((err) => setError(err.message))
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
              comments: [...(prev.comments ?? []), comment],
              comments_count: (prev.comments_count ?? 0) + 1,
            }
          : prev,
      );
      setForm({ author_name: '', content: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading article...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <article className="article-page">
      <div className="card">
        <div className="card-meta">
          <span>{new Date(article.created_at).toLocaleString()}</span>
          {article.comments_count !== undefined && (
            <span>{article.comments_count} comments</span>
          )}
        </div>
        <h1>{article.title}</h1>
        <p className="article-body">{article.content}</p>
      </div>

      <section className="comments">
        <h3>Comments</h3>
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
          {(article.comments ?? []).length === 0 && <p>No comments yet.</p>}
        </div>

        <form className="card form" onSubmit={handleSubmit}>
          <h4>Add a comment</h4>
          <label>
            Name
            <input
              type="text"
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              required
              placeholder="Your name"
            />
          </label>
          <label>
            Comment
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              placeholder="Share your thoughts"
              rows={4}
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      </section>
    </article>
  );
}

export default ArticlePage;
