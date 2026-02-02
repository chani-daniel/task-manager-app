import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { Comment, CreateCommentRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly apiUrl = 'http://localhost:3000/api/comments';

  private commentsSignal = signal<Comment[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  comments = computed(() => this.commentsSignal());
  isLoading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  constructor(private http: HttpClient) {}

  /**
   * Fetch all comments for a specific task
   */
  getComments(taskId: number | string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);

      this.http.get<Comment[]>(`${this.apiUrl}?taskId=${taskId}`).subscribe({
        next: (comments) => {
          this.commentsSignal.set(comments);
          this.loadingSignal.set(false);
          resolve();
        },
        error: (error) => {
          console.error('Error fetching comments:', error);
          this.errorSignal.set('Failed to load comments. Please try again.');
          this.loadingSignal.set(false);
          reject(error);
        },
      });
    });
  }

  /**
   * Create a new comment
   */
  createComment(request: CreateCommentRequest): Promise<Comment> {
    return new Promise((resolve, reject) => {
      this.http.post<Comment>(this.apiUrl, request).subscribe({
        next: (newComment) => {
          this.commentsSignal.set([...this.commentsSignal(), newComment]);
          resolve(newComment);
        },
        error: (error) => {
          reject(error?.error?.message || 'Failed to create comment');
        },
      });
    });
  }

  /**
   * Clear comments and reset state
   */
  clearComments(): void {
    this.commentsSignal.set([]);
    this.errorSignal.set(null);
  }
}
