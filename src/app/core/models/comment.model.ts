export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  body: string;
  created_at: string;
  author_name?: string;
}

export interface CreateCommentRequest {
  taskId: number | string;
  body: string;
}
