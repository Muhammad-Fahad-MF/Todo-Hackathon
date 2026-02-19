/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface SQLModel {}
export interface Task {
  id?: number | null;
  title: string;
  description?: string | null;
  is_completed?: boolean;
  user_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
}

export interface TaskRead {
  id: number;
  title: string;
  description?: string | null;
  is_completed: boolean;
}

export interface TaskUpdate {
  title?: string | null;
  description?: string | null;
  is_completed?: boolean | null;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string | null;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  tool_calls?: any[];
}

export interface MessageSchema {
  role: string;
  content: string;
}

export interface ChatHistoryResponse {
  conversation_id: string | null;
  messages: MessageSchema[];
}