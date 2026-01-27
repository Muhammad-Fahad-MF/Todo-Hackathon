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

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return API_URL;
  }
  return "/api/external";
};

async function fetchApi(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const allHeaders = new Headers(options.headers);
  const isServer = typeof window === "undefined";
  const method = options.method || "GET";

  if (isServer) {
    // This is a server-side component.
    // We can access request headers and forward the session cookie.
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;
      const secureSessionToken = cookieStore.get("__Secure-better-auth.session_token")?.value;

      if (sessionToken) {
        allHeaders.set("Cookie", `better-auth.session_token=${sessionToken}`);
      }
      
      if (secureSessionToken) {
        const existingCookie = allHeaders.get("Cookie") || "";
        const secureCookie = `__Secure-better-auth.session_token=${secureSessionToken}`;
        allHeaders.set("Cookie", existingCookie ? `${existingCookie}; ${secureCookie}` : secureCookie);
      }

      if (!sessionToken && !secureSessionToken) {
        // Redirect to login if no session token is found on the server
        redirect("/login");
      }
    } catch (error: any) {
      if (error?.digest?.startsWith?.("NEXT_REDIRECT")) {
        throw error;
      }
      console.error("[API] Error getting session token:", error);
    }
  }
  // On the client, cookies are automatically sent thanks to credentials: 'include'
  
  if (!allHeaders.has("Content-Type")) {
    allHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { 
    ...options, 
    headers: allHeaders,
    credentials: 'include' // Allow sending cookies in cross-origin requests
  });

  if (!response.ok) {
    if (response.status === 401) {
       console.error(`[API] 401 Unauthorized from: ${url}`);
       if (typeof window !== "undefined") {
         // Don't call signOut() automatically as it might be a transient or configuration error
         window.location.href = "/login";
       } else {
         // Server-side: Redirect to reset-auth to clear cookies, then to login/signup
         redirect("/api/reset-auth");
       }
    }
    const errorBody = await response.json().catch(() => ({}));
    console.error("API Error:", response.status, errorBody);
    
    // Improved error message extraction
    let errorMessage = response.statusText;
    if (errorBody.detail) {
      errorMessage = typeof errorBody.detail === 'string' 
        ? errorBody.detail 
        : JSON.stringify(errorBody.detail);
    }

    throw new Error(`API request failed: ${errorMessage}`);
  }

  return response;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetchApi(`${getBaseUrl()}/api/v1/tasks/`, {
    method: "GET",
    cache: "no-store", // Ensure fresh data
  });
  return response.json();
};

export const createTask = async (taskData: TaskCreate): Promise<Task> => {
  const response = await fetchApi(`${getBaseUrl()}/api/v1/tasks/`, {
    method: "POST",
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const updateTask = async (
  id: number,
  taskData: TaskUpdate
): Promise<Task> => {
  const response = await fetchApi(`${getBaseUrl()}/api/v1/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  await fetchApi(`${getBaseUrl()}/api/v1/tasks/${id}`, {
    method: "DELETE",
  });
};