export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers||{}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
    const config: RequestInit = {
    ...options,
    headers,
  };
    return fetch(url, config);
}