const API_BASE_URL = "http://localhost:3000";

async function request<TResult>(
  path: string,
  init?: RequestInit
): Promise<TResult> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Request failed: ${res.status} ${res.statusText}`
    );
  }

  if (res.status === 204) {
    return undefined as TResult;
  }

  return res.json() as Promise<TResult>;
}

export default request;