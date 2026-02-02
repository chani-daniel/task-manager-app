import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { Project, CreateProjectRequest } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly apiUrl = 'http://localhost:3000/api/projects';

  private projectsSignal = signal<Project[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  // Per-team cache to prevent project leakage between teams
  private projectsByTeam: Map<string, Project[]> = new Map();
  private currentTeamId = signal<string>('');

  // Computed signals
  projects = computed(() => this.projectsSignal());
  isLoading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  constructor(private http: HttpClient) {}

  /**
   * Fetch all projects for a specific team
   */
  getProjectsByTeam(teamId: number | string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const tid = String(teamId);
    this.currentTeamId.set(tid);

    // Check if we have cached projects for this team
    const cachedProjects = this.projectsByTeam.get(tid);
    if (cachedProjects) {
      this.projectsSignal.set(cachedProjects);
      this.loadingSignal.set(false);
    }

    // Always fetch fresh data from server
    this.http.get<Project[]>(`${this.apiUrl}?teamId=${tid}`).subscribe({
      next: (projects) => {
        // Update cache for this team
        this.projectsByTeam.set(tid, projects);
        // Only update visible projects if this team is still active
        if (this.currentTeamId() === tid) {
          this.projectsSignal.set(projects);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set('Failed to load projects. Please try again.');
        this.loadingSignal.set(false);
      },
    });
  }

  /**
   * Create a new project
   */
  createProject(request: CreateProjectRequest): Promise<Project> {
    return new Promise((resolve, reject) => {
      this.http.post<Project>(this.apiUrl, request).subscribe({
        next: (newProject) => {
          const projectTeamId = String(newProject.teamId || request.teamId);
          
          // Add to the cache for this specific team
          const teamProjects = this.projectsByTeam.get(projectTeamId) || [];
          this.projectsByTeam.set(projectTeamId, [...teamProjects, newProject]);
          
          // Only update visible projects if the new project belongs to the currently active team
          if (this.currentTeamId() === projectTeamId) {
            this.projectsSignal.set([...this.projectsSignal(), newProject]);
          }
          
          resolve(newProject);
        },
        error: (error) => {
          reject(error?.error?.message || 'Failed to create project');
        },
      });
    });
  }

  /**
   * Clear projects and reset state
   */
  clearProjects(): void {
    this.projectsSignal.set([]);
    this.projectsByTeam.clear();
    this.currentTeamId.set('');
    this.errorSignal.set(null);
  }
}
