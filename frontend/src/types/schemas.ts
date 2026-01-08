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
  user_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}
export interface User {
  id?: number | null;
  email: string;
  hashed_password: string;
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