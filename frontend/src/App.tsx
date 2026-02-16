import { Link, Route, Routes } from 'react-router-dom';
import ArticleList from './pages/ArticleList';
import ArticlePage from './pages/ArticlePage';
import NewArticlePage from './pages/NewArticlePage';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Простой блог
        </Link>
        <nav className="nav-links">
          <Link to="/">Статьи</Link>
          <Link to="/new">Новая статья</Link>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticlePage />} />
          <Route path="/new" element={<NewArticlePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
