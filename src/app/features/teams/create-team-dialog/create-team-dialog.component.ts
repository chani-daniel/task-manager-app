import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
  selector: 'app-create-team-dialog',
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
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.css'],
})
export class CreateTeamDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateTeamDialogComponent>);
  private fb = inject(FormBuilder);

  isSubmitting = false;

  teamForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  /**
   * Submit form and close dialog
   */
  onSubmit(): void {
    if (this.teamForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.dialogRef.close(this.teamForm.getRawValue());
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
    const control = this.teamForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'שם הצוות הוא שדה חובה';
    }
    if (control?.hasError('minlength')) {
      return 'שם הצוות חייב להיות בעל לפחות 2 תווים';
    }
    return '';
  }
}
