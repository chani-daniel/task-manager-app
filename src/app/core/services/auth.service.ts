import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/auth.model';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);

  private authSignal = signal<{ user: User | null; token: string | null }>({
    user: null,
    token: null
  });

  isAuthenticated = computed(() => !!this.authSignal().token);
  currentUser = computed(() => this.authSignal().user);
  token = computed(() => this.authSignal().token);

  constructor() {
    this.loadFromStorage();
  }

  login(credentials: LoginRequest) {
    return this.httpClient.post<AuthResponse>(`${API_URL}/login`, credentials);
  }

  register(data: RegisterRequest) {
    return this.httpClient.post<AuthResponse>(`${API_URL}/register`, data);
  }

  setAuth(response: AuthResponse) {
    this.authSignal.set({
      user: response.user,
      token: response.token
    });
    this.saveToStorage(response);
  }

  logout() {
    this.authSignal.set({ user: null, token: null });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  private saveToStorage(response: AuthResponse) {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
  }

  private loadFromStorage() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');

    if (token && user) {
      try {
        this.authSignal.set({
          user: JSON.parse(user),
          token: token
        });
      } catch (e) {
        this.logout();
      }
    }
  }
}
