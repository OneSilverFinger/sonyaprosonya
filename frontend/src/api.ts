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

export type Paginated<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
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

  const contentType = response.headers.get('content-type') ?? '';

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      if (contentType.includes('application/json')) {
        const body = await response.json();
        message =
          body.message ??
          (body.errors ? Object.values<string[]>(body.errors).flat()[0] : undefined) ??
          message;
      } else {
        const text = await response.text();
        if (text) {
          message = text;
        }
      }
    } catch (_) {
      // ignore parse errors and fall back to default message
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return (await response.text()) as unknown as T;
}

export function fetchArticles(page = 1, perPage = 6) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  return request<Paginated<Article>>(`/articles?${params.toString()}`);
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
