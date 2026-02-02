import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { signal, computed } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TeamsService } from '../../../core/services/teams.service';
import { ProjectsService } from '../../../core/services/projects.service';
import { Team } from '../../../core/models/team.model';
import { Project } from '../../../core/models/project.model';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { MembersListComponent } from './members-list/members-list.component';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    ProjectsListComponent,
    MembersListComponent,
  ],
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css'],
})
export class TeamDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teamsService = inject(TeamsService);
  private projectsService = inject(ProjectsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private teamIdSignal = signal<string>('');
  
  // Computed team that updates when teams or teamId changes
  team = computed(() => {
    const teamId = this.teamIdSignal();
    if (!teamId) return null;
    const teams = this.teamsService.teams();
    return teams.find((t) => String((t as any).id) === String(teamId)) || null;
  });
  
  projects = this.projectsService.projects;
  isLoading = this.projectsService.isLoading;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const teamId = params['teamId'];
      if (teamId) {
        this.loadTeamData(teamId);
      }
    });
  }

  /**
   * Load team and projects data
   */
  private loadTeamData(teamId: string): void {
    this.teamIdSignal.set(teamId);
    
    // Check if team exists
    const currentTeam = this.team();
    if (!currentTeam) {
      this.snackBar.open('צוות לא נמצא', 'סגור', { duration: 3000 });
      this.router.navigate(['/teams']);
      return;
    }

    // Load projects for this team
    this.projectsService.getProjectsByTeam(teamId);
  }

  /**
   * Open dialog to add a member to the team
   */
  openAddMemberDialog(): void {
    const currentTeam = this.team();
    if (!currentTeam) return;

    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '400px',
      disableClose: false,
      data: { teamId: currentTeam.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamsService
          .addMember(currentTeam.id, result.userId)
          .then(() => {
            this.snackBar.open('✅ חבר הוסף בהצלחה!', 'סגור', {
              duration: 3000,
            });
          })
          .catch((error) => {
            this.snackBar.open(`❌ ${error}`, 'סגור', { duration: 3000 });
          });
      }
    });
  }

  /**
   * Navigate back to teams
   */
  goBack(): void {
    this.router.navigate(['/teams']);
  }
}
