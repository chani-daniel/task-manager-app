export interface Team {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  memberCount: number;
  members_count?: number;
  createdAt: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface AddMemberRequest {
  email: string;
}
