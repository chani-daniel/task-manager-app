import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../../core/models/task.model';
import { TaskCommentsComponent } from '../task-comments/task-comments.component';

@Component({
  selector: 'app-task-comments-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TaskCommentsComponent,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>comment</mat-icon>
      תגובות - {{ task.title }}
    </h2>
    
    <mat-dialog-content>
      <app-task-comments [taskId]="task.id" [taskTitle]="task.title"></app-task-comments>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>סגור</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    mat-dialog-content {
      min-width: 500px;
      max-width: 700px;
      min-height: 400px;
    }
  `]
})
export class TaskCommentsDialogComponent {
  task: Task;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { task: Task }) {
    this.task = data.task;
  }
}
