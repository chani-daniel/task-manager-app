import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { TasksService } from '../../core/services/tasks.service';
import { ProjectsService } from '../../core/services/projects.service';
import { Task, TaskStatus } from '../../core/models/task.model';
import { CreateTaskDialogComponent } from './create-task-dialog/create-task-dialog.component';
import { EditTaskDialogComponent } from './edit-task-dialog/edit-task-dialog.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatMenuModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tasksService = inject(TasksService);
  private projectsService = inject(ProjectsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  projectId = signal<string>('');
  tasks = this.tasksService.tasks;
  isLoading = this.tasksService.isLoading;

  // Computed: current project
  project = computed(() => {
    const pid = this.projectId();
    const projects = this.projectsService.projects();
    return projects.find((p) => String(p.id) === String(pid)) || null;
  });

  // Computed: tasks grouped by status
  tasksByStatus = computed(() => {
    const allTasks = this.tasks();
    return this.tasksService.getTasksByStatus(allTasks);
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const projectId = params['projectId'];
      if (projectId) {
        this.projectId.set(projectId);
        this.loadTasks(projectId);
      }
    });
  }

  /**
   * Load tasks for the project
   */
  async loadTasks(projectId: string): Promise<void> {
    try {
      await this.tasksService.getTasks(projectId);
    } catch (error) {
      this.snackBar.open('❌ שגיאה בטעינת משימות', 'סגור', { duration: 3000 });
    }
  }

  /**
   * Open dialog to create a new task
   */
  openCreateTaskDialog(): void {
    const pid = this.projectId();
    if (!pid) return;

    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '600px',
      disableClose: false,
      data: { projectId: pid },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tasksService
          .createTask(result)
          .then(() => {
            this.snackBar.open('✅ משימה נוצרה בהצלחה!', 'סגור', { duration: 3000 });
          })
          .catch((error) => {
            this.snackBar.open(`❌ ${error}`, 'סגור', { duration: 3000 });
          });
      }
    });
  }

  /**
   * Open dialog to edit a task
   */
  openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '600px',
      disableClose: false,
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tasksService
          .updateTask(task.id, result)
          .then(() => {
            this.snackBar.open('✅ משימה עודכנה בהצלחה!', 'סגור', { duration: 3000 });
          })
          .catch((error) => {
            this.snackBar.open(`❌ ${error}`, 'סגור', { duration: 3000 });
          });
      }
    });
  }

  /**
   * Open dialog to view and add comments to a task
   */
  openCommentsDialog(task: Task): void {
    import('./task-comments-dialog/task-comments-dialog.component').then((m) => {
      this.dialog.open(m.TaskCommentsDialogComponent, {
        width: '700px',
        maxHeight: '80vh',
        data: { task },
      });
    });
  }

  /**
   * Delete a task with confirmation
   */
  deleteTask(task: Task): void {
    if (confirm(`האם אתה בטוח שברצונך למחוק את המשימה "${task.title}"?`)) {
      this.tasksService
        .deleteTask(task.id)
        .then(() => {
          this.snackBar.open('✅ משימה נמחקה בהצלחה!', 'סגור', { duration: 3000 });
        })
        .catch((error) => {
          this.snackBar.open(`❌ ${error}`, 'סגור', { duration: 3000 });
        });
    }
  }

  /**
   * Update task status (for status change buttons)
   */
  updateTaskStatus(task: Task, newStatus: TaskStatus): void {
    if (task.status === newStatus) return;

    this.tasksService
      .updateTaskStatus(task.id, newStatus)
      .then(() => {
        this.snackBar.open('✅ סטטוס עודכן!', '', { duration: 2000 });
      })
      .catch((error) => {
        this.snackBar.open(`❌ ${error}`, 'סגור', { duration: 3000 });
      });
  }

  /**
   * Get priority color
   */
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High':
        return 'warn';
      case 'Medium':
        return 'accent';
      case 'Low':
        return 'primary';
      default:
        return '';
    }
  }

  /**
   * Get priority text in Hebrew
   */
  getPriorityText(priority: string): string {
    switch (priority) {
      case 'High':
        return 'גבוהה';
      case 'Medium':
        return 'בינונית';
      case 'Low':
        return 'נמוכה';
      default:
        return priority;
    }
  }

  /**
   * Get status text in Hebrew
   */
  getStatusText(status: TaskStatus): string {
    switch (status) {
      case 'Backlog':
        return 'ממתין';
      case 'In Progress':
        return 'בעבודה';
      case 'Done':
        return 'הושלם';
      default:
        return status;
    }
  }

  /**
   * Navigate back
   */
  goBack(): void {
    this.router.navigate(['/teams']);
  }
}
