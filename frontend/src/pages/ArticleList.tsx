import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../api';
import { fetchArticles } from '../api';

function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading articles...</p>;
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
              <span>{article.comments_count} comments</span>
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
    </div>
  );
}

export default ArticleList;
