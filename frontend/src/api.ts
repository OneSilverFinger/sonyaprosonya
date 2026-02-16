export type Comment = {
  id: number;
  article_id?: number;
  author_name: string;
  content: string;
  created_at: string;
};

export type Article = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  comments?: Comment[];
  comments_count?: number;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchArticles() {
  return request<Article[]>('/articles');
}

export function fetchArticle(id: string | number) {
  return request<Article>(`/articles/${id}`);
}

export function createArticle(payload: { title: string; content: string }) {
  return request<Article>('/articles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function addComment(
  articleId: string | number,
  payload: { author_name: string; content: string },
) {
  return request<Comment>(`/articles/${articleId}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
