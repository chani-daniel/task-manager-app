import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(group: any) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.authService.login(this.loginForm.getRawValue() as any).subscribe({
      next: (response) => {
        this.authService.setAuth(response);
        this.snackBar.open('התחברת בהצלחה!', 'סגור', { duration: 3000 });
        this.router.navigate(['/teams']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('שגיאה בהתחברות: ' + (error.error?.message || 'נסה שוב'), 'סגור', {
          duration: 5000
        });
      },
      complete: () => this.isLoading.set(false)
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    const { confirmPassword, ...data } = this.registerForm.getRawValue();
    this.authService.register(data as any).subscribe({
      next: (response) => {
        this.authService.setAuth(response);
        this.snackBar.open('נרשמת בהצלחה!', 'סגור', { duration: 3000 });
        this.router.navigate(['/teams']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('שגיאה בהרשמה: ' + (error.error?.message || 'נסה שוב'), 'סגור', {
          duration: 5000
        });
      },
      complete: () => this.isLoading.set(false)
    });
  }

  getErrorMessage(fieldName: string, formType: 'login' | 'register'): string {
    const form = (formType === 'login' ? this.loginForm : this.registerForm) as any;
    const field = form?.get?.(fieldName);

    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} הוא חובה`;
    if (field.errors['email']) return 'כתובת אימייל לא חוקית';
    if (field.errors['minlength']) return `${fieldName} קצר מדי`;
    if (field.errors['passwordMismatch']) return 'הסיסמאות לא תואמות';

    return '';
  }
}
