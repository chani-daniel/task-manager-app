import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  MatFormField,
  MatLabel,
  MatError,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatError,
    MatProgressBar,
    MatIcon,
    MatDialogModule,
  ],
  templateUrl: './add-member-dialog.component.html',
  styleUrls: ['./add-member-dialog.component.css'],
})
export class AddMemberDialogComponent {
  private dialogRef = inject(MatDialogRef<AddMemberDialogComponent>);
  private fb = inject(FormBuilder);

  @Inject(MAT_DIALOG_DATA) data: { teamId: string } | null = null;

  isSubmitting = false;

  memberForm = this.fb.group({
    userId: ['', [Validators.required]],
  });

  /**
   * Submit form and close dialog
   */
  onSubmit(): void {
    if (this.memberForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.dialogRef.close(this.memberForm.getRawValue());
    }
  }

  /**
   * Close dialog without submitting
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Get error message for form field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.memberForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'ID המשתמש הוא שדה חובה';
    }
    return '';
  }
}
