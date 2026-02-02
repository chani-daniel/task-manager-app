import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { Team, CreateTeamRequest } from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly apiUrl = 'http://localhost:3000/api/teams';

  private teamsSignal = signal<Team[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  teams = computed(() => this.teamsSignal());
  isLoading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  constructor(private http: HttpClient) {}

  /**
   * Fetch all teams for the current user
   */
  getTeams(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);

      this.http.get<Team[]>(this.apiUrl).subscribe({
        next: (teams) => {
          // Map members_count from server to memberCount
          const mappedTeams = teams.map(t => ({
            ...t,
            memberCount: t.members_count || t.memberCount || 0
          }));
          this.teamsSignal.set(mappedTeams);
          this.loadingSignal.set(false);
          resolve();
        },
        error: (error) => {
          this.errorSignal.set('Failed to load teams. Please try again.');
          this.loadingSignal.set(false);
          reject(error);
        },
      });
    });
  }

  /**
   * Create a new team
   */
  createTeam(request: CreateTeamRequest): Promise<Team> {
    return new Promise((resolve, reject) => {
      this.http.post<Team>(this.apiUrl, request).subscribe({
        next: (newTeam) => {
          // Add the new team to the signal
          this.teamsSignal.set([...this.teamsSignal(), newTeam]);
          resolve(newTeam);
        },
        error: (error) => {
          reject(error?.error?.message || 'Failed to create team');
        },
      });
    });
  }

  /**
   * Add a member to a team by user ID
   */
  addMember(teamId: number | string, userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const tid = String(teamId);
      this.http
        .post<void>(`${this.apiUrl}/${tid}/members`, { userId, role: 'member' })
        .subscribe({
          next: async () => {
            // Wait for teams to refresh before resolving
            try {
              await this.getTeams();
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          error: (error) => {
            reject(error?.error?.message || 'Failed to add member to team');
          },
        });
    });
  }

  /**
   * Clear teams and reset state
   */
  clearTeams(): void {
    this.teamsSignal.set([]);
    this.errorSignal.set(null);
  }
}
