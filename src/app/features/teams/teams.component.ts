import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardActions,
  MatCardModule,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatFormField,
  MatLabel,
  MatError,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TeamsService } from '../../core/services/teams.service';
import { CreateTeamDialogComponent } from './create-team-dialog/create-team-dialog.component';
import { AddMemberDialogComponent } from './add-member-dialog/add-member-dialog.component';
import { Team } from '../../core/models/team.model';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButton,
    MatIcon,
    MatProgressBar,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  teams = this.teamsService.teams;
  isLoading = this.teamsService.isLoading;
  error = this.teamsService.error;

  ngOnInit(): void {
    this.teamsService.getTeams();
  }

  /**
   * Open dialog to create a new team
   */
  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '400px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamsService
          .createTeam(result)
          .then(() => {
            this.snackBar.open('✅ Team created successfully!', 'Close', {
              duration: 3000,
            });
          })
          .catch((error) => {
            this.snackBar.open(`❌ ${error}`, 'Close', { duration: 3000 });
          });
      }
    });
  }

  /**
   * Open dialog to add a member to a team
   */
  openAddMemberDialog(team: Team): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '400px',
      disableClose: false,
      data: { teamId: team.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamsService
          .addMember(team.id, result.userId)
          .then(() => {
            this.snackBar.open('✅ Member added successfully!', 'Close', {
              duration: 3000,
            });
          })
          .catch((error) => {
            this.snackBar.open(`❌ ${error}`, 'Close', { duration: 3000 });
          });
      }
    });
  }

  /**
   * Navigate to team details page
   */
  viewTeamProjects(team: Team): void {
    this.router.navigate(['/teams', team.id]);
  }
}
