import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CreateTaskRequest, TaskStatus, TaskPriority } from '../../../core/models/task.model';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.css'],
})
export class CreateTaskDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateTaskDialogComponent>);
  private fb = inject(FormBuilder);

  projectId: string;

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['Backlog' as TaskStatus],
    priority: ['Medium' as TaskPriority, Validators.required],
    assignedTo: [''],
    dueDate: [''],
  });

  statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'Backlog', label: 'ממתין' },
    { value: 'In Progress', label: 'בעבודה' },
    { value: 'Done', label: 'הושלם' },
  ];

  priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'High', label: 'גבוהה' },
    { value: 'Medium', label: 'בינונית' },
    { value: 'Low', label: 'נמוכה' },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { projectId: string }) {
    this.projectId = data.projectId;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.getRawValue();
      const request: CreateTaskRequest = {
        projectId: this.projectId,
        title: formValue.title!,
        description: formValue.description || undefined,
        status: formValue.status!,
        priority: formValue.priority!,
        assignedTo: formValue.assignedTo || undefined,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString() : undefined,
      };
      this.dialogRef.close(request);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.taskForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'שדה חובה';
    }
    if (control?.hasError('minlength')) {
      return 'לפחות 3 תווים';
    }
    return '';
  }
}
