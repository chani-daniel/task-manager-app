import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  private tasksSignal = signal<Task[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  tasks = computed(() => this.tasksSignal());
  isLoading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  constructor(private http: HttpClient) {}

  /**
   * Fetch all tasks, optionally filtered by projectId
   */
  getTasks(projectId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);

      const url = projectId ? `${this.apiUrl}?projectId=${projectId}` : this.apiUrl;

      this.http.get<Task[]>(url).subscribe({
        next: (tasks) => {
          this.tasksSignal.set(tasks);
          this.loadingSignal.set(false);
          resolve();
        },
        error: (error) => {
          this.errorSignal.set('Failed to load tasks. Please try again.');
          this.loadingSignal.set(false);
          reject(error);
        },
      });
    });
  }

  /**
   * Create a new task
   */
  createTask(request: CreateTaskRequest): Promise<Task> {
    return new Promise((resolve, reject) => {
      this.http.post<Task>(this.apiUrl, request).subscribe({
        next: (newTask) => {
          this.tasksSignal.set([...this.tasksSignal(), newTask]);
          resolve(newTask);
        },
        error: (error) => {
          reject(error?.error?.message || 'Failed to create task');
        },
      });
    });
  }

  /**
   * Update an existing task
   */
  updateTask(taskId: string, updates: UpdateTaskRequest): Promise<Task> {
    return new Promise((resolve, reject) => {
      this.http.patch<Task>(`${this.apiUrl}/${taskId}`, updates).subscribe({
        next: (updatedTask) => {
          // Update the task in the signal
          const tasks = this.tasksSignal();
          const index = tasks.findIndex((t) => t.id === taskId);
          if (index !== -1) {
            const newTasks = [...tasks];
            newTasks[index] = updatedTask;
            this.tasksSignal.set(newTasks);
          }
          resolve(updatedTask);
        },
        error: (error) => {
          reject(error?.error?.message || 'Failed to update task');
        },
      });
    });
  }

  /**
   * Delete a task
   */
  deleteTask(taskId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiUrl}/${taskId}`).subscribe({
        next: () => {
          // Remove the task from the signal
          const tasks = this.tasksSignal().filter((t) => t.id !== taskId);
          this.tasksSignal.set(tasks);
          resolve();
        },
        error: (error) => {
          reject(error?.error?.message || 'Failed to delete task');
        },
      });
    });
  }

  /**
   * Update task status (for drag & drop)
   */
  updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(taskId, { status });
  }

  /**
   * Clear tasks and reset state
   */
  clearTasks(): void {
    this.tasksSignal.set([]);
    this.errorSignal.set(null);
  }

  /**
   * Get tasks grouped by status for Kanban board
   */
  getTasksByStatus(tasks: Task[]) {
    return {
      backlog: tasks.filter((t) => t.status === 'Backlog'),
      inProgress: tasks.filter((t) => t.status === 'In Progress'),
      done: tasks.filter((t) => t.status === 'Done'),
    };
  }
}
