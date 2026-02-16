import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Article, Paginated } from '../api';
import { fetchArticles } from '../api';
import { useToast } from '../toast';

function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Paginated<Article>['meta'] | null>(null);
  const toast = useToast();

  const loadPage = (pageToLoad: number) => {
    setLoading(true);
    fetchArticles(pageToLoad)
      .then((res) => {
        setArticles(res.data);
        setMeta(res.meta);
        setPage(res.meta.current_page);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        toast.push(err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) {
    return <p>Загружаем статьи…</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="card-grid">
      {articles.map((article) => (
        <Link to={`/articles/${article.id}`} key={article.id} className="card">
          <div className="card-meta">
            <span>{new Date(article.created_at).toLocaleDateString()}</span>
            {article.comments_count !== undefined && (
              <span>{article.comments_count} комментариев</span>
            )}
          </div>
          <h2>{article.title}</h2>
          <p>
            {article.content.length > 180
              ? `${article.content.slice(0, 180)}…`
              : article.content}
          </p>
        </Link>
      ))}

      <div className="pagination">
        <button
          type="button"
          disabled={loading || (meta?.current_page ?? 1) <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Назад
        </button>
        <span>
          Страница {meta?.current_page ?? page} из {meta?.last_page ?? 1}
          {meta?.total !== undefined && meta?.total > 0 ? ` • ${meta.total} статей` : ''}
        </span>
        <button
          type="button"
          disabled={loading || (meta ? meta.current_page >= meta.last_page : true)}
          onClick={() => setPage((current) => (meta ? Math.min(meta.last_page, current + 1) : current + 1))}
        >
          Вперёд
        </button>
      </div>
    </div>
  );
}

export default ArticleList;
