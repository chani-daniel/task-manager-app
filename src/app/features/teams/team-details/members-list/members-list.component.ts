import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Team } from '../../../../core/models/team.model';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
})
export class MembersListComponent {
  @Input() teamId: number | string = '';
  @Input() team: Team | null = null;

  /**
   * Get role display text
   */
  getRoleText(role?: string): string {
    switch (role) {
      case 'owner':
        return 'בעלים';
      case 'member':
        return 'חבר';
      case 'admin':
        return 'מנהל';
      default:
        return 'חבר';
    }
  }

  /**
   * Get role color
   */
  getRoleColor(role?: string): string {
    switch (role) {
      case 'owner':
        return 'accent';
      case 'admin':
        return 'primary';
      default:
        return '';
    }
  }
}
