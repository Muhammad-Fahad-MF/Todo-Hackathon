// @/lib/api.ts
import { authClient } from "@/lib/auth";
import { Task, TaskCreate, TaskUpdate } from "@/types/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function fetchApi(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { data } = await authClient.getSession();
  const token = data?.session?.token;

  const headers = new Headers(options.headers);
  
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
       // Optional: Redirect to login or handle session expiration
       if (typeof window !== "undefined") {
         // window.location.href = "/login"; // Only redirect if strictly necessary
       }
    }
    const errorBody = await response.json().catch(() => ({}));
    console.error("API Error:", response.status, errorBody);
    throw new Error(
      `API request failed with status ${response.status}: ${
        errorBody.detail || response.statusText
      }`
    );
  }

  return response;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetchApi(`${API_URL}/api/v1/tasks`, {
    method: "GET",
    cache: "no-store", // Ensure fresh data
  });
  return response.json();
};

export const createTask = async (taskData: TaskCreate): Promise<Task> => {
  const response = await fetchApi(`${API_URL}/api/v1/tasks`, {
    method: "POST",
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const updateTask = async (
  id: number,
  taskData: TaskUpdate
): Promise<Task> => {
  const response = await fetchApi(`${API_URL}/api/v1/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  await fetchApi(`${API_URL}/api/v1/tasks/${id}`, {
    method: "DELETE",
  });
};