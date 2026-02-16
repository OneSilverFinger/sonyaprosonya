import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../api';

function NewArticlePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const article = await createArticle({
        title: form.title.trim(),
        content: form.content.trim(),
      });
      navigate(`/articles/${article.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card form">
      <h2>Новая статья</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Заголовок
          <input
            type="text"
            value={form.title}
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Название статьи"
          />
        </label>
        <label>
          Содержание
          <textarea
            value={form.content}
            required
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Напишите текст статьи..."
            rows={6}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Сохраняем…' : 'Опубликовать'}
        </button>
      </form>
    </section>
  );
}

export default NewArticlePage;
