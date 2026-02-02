import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Project } from '../../../../core/models/project.model';
import { ProjectsService } from '../../../../core/services/projects.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css'],
})
export class ProjectsListComponent {
  @Input() teamId: number | string = '';
  @Input() projects: Project[] = [];
  @Input() isLoading: boolean = false;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  /**
   * Navigate to tasks page for a project
   */
  viewTasks(project: Project): void {
    this.router.navigate(['/projects', project.id, 'tasks']);
  }

  /**
   * Open dialog to create a new project
   */
  openCreateProjectDialog(): void {
    import('./create-project-dialog/create-project-dialog.component').then(
      (m) => {
        const dialogRef = this.dialog.open(m.CreateProjectDialogComponent, {
          width: '450px',
          disableClose: false,
          data: { teamId: this.teamId },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.projectsService
              .createProject({
                teamId: String(this.teamId),
                name: result.name,
                description: result.description,
              })
              .then(() => {
                this.snackBar.open('✅ פרויקט נוצר בהצלחה!', 'סגור', {
                  duration: 3000,
                });
                // Reload projects to ensure consistency
                this.projectsService.getProjectsByTeam(this.teamId);
              })
              .catch((error) => {
                this.snackBar.open(`❌ ${error}`, 'סגור', { duration: 3000 });
              });
          }
        });
      }
    );
  }

  /**
   * Get status display text
   */
  getStatusText(status?: string): string {
    switch (status) {
      case 'active':
        return 'פעיל';
      case 'archived':
        return 'ארכיון';
      default:
        return 'פעיל';
    }
  }
}
