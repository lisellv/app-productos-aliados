const API_BASE_URL = (window.__ENV__?.API_BASE_URL || "").replace(/\/$/, "");

const AUTH_TOKEN_KEY = "tech-store-auth-token";

async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `API request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  const body = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }

  return body;
}

async function login(username, password) {
  const result = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ userName: username, password }),
  });

  const token =
    typeof result === "string"
      ? result
      : result.token || result.accessToken || result.jwt;
  if (!token) {
    throw new Error("La respuesta de autenticación no contiene un JWT.");
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  return result;
}

function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function getProducts() {
  const result = await apiRequest("/api/productos");
  return result.content || result.data || result.items || result;
}
