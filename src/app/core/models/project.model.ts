export interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  createdBy: string;
  status?: 'active' | 'archived';
  createdAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  teamId: string;
}
