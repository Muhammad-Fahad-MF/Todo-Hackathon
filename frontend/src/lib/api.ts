// @/lib/api.ts
import { authClient } from "@/lib/auth";
import { Task, TaskCreate, TaskUpdate } from "@/types/schemas";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
if (!APP_URL) {
  throw new Error("NEXT_PUBLIC_APP_URL is not defined");
}

async function fetchApi(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token: string | undefined;

  if (typeof window === "undefined") {
    // Server-side: Get token from headers/cookies
    const { headers } = await import("next/headers");
    const headerList = await headers();
    const cookie = headerList.get("cookie");
    
    // We can fetch the session from the internal auth API
    const authUrl = `${APP_URL}/api/auth/get-session`;
    try {
      const sessionRes = await fetch(authUrl, {
        headers: { cookie: cookie || "" },
      });
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        token = sessionData?.session?.token;
      }
    } catch (e) {
      console.error("Error fetching session on server:", e);
    }
  } else {
    // Client-side: use authClient
    const { data } = await authClient.getSession();
    token = data?.session?.token;
  }
  
  // DEBUG: Log the token details
  if (token) {
    const isJwt = token.split(".").length === 3;
    console.log(`DEBUG: Sending Token (${isJwt ? "JWT" : "Opaque"}):`, token.substring(0, 20) + "...");
  } else {
    console.log("DEBUG: No token found to send");
  }
  
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
       // Server-side redirect to login on 401
       if (typeof window === "undefined") {
         redirect("/login");
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