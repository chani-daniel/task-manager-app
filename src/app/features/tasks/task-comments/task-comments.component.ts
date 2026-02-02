import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommentsService } from '../../../core/services/comments.service';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-task-comments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.css'],
})
export class TaskCommentsComponent implements OnInit {
  @Input() taskId: number | string = '';
  @Input() taskTitle: string = '';

  private commentsService = inject(CommentsService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  comments = this.commentsService.comments;
  isLoading = this.commentsService.isLoading;
  isSubmitting = signal(false);

  commentForm = this.fb.group({
    body: ['', [Validators.required, Validators.minLength(1)]],
  });

  ngOnInit(): void {
    if (this.taskId) {
      this.loadComments();
    }
  }

  async loadComments(): Promise<void> {
    try {
      await this.commentsService.getComments(this.taskId);
    } catch (error) {
      this.snackBar.open('❌ שגיאה בטעינת תגובות', 'סגור', { duration: 3000 });
    }
  }

  async submitComment(): Promise<void> {
    if (this.commentForm.valid) {
      this.isSubmitting.set(true);
      this.commentForm.disable();
      const body = this.commentForm.get('body')?.value || '';

      try {
        await this.commentsService.createComment({
          taskId: this.taskId,
          body: body.trim(),
        });
        this.commentForm.reset();
        this.snackBar.open('✅ תגובה נוספה בהצלחה!', '', { duration: 2000 });
      } catch (error) {
        this.snackBar.open('❌ שגיאה בהוספת תגובה', 'סגור', { duration: 3000 });
      } finally {
        this.isSubmitting.set(false);
        this.commentForm.enable();
      }
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'כרגע';
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    
    return date.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
