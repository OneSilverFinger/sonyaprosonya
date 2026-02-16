import { Link, Route, Routes } from 'react-router-dom';
import ArticleList from './pages/ArticleList';
import ArticlePage from './pages/ArticlePage';
import NewArticlePage from './pages/NewArticlePage';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Simple Blog
        </Link>
        <nav className="nav-links">
          <Link to="/">Articles</Link>
          <Link to="/new">Add Article</Link>
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
