import { Component, OnInit } from '@angular/core';
import { ScrumMasterService } from '../../../services/scrum-master.service';

interface ProjectDetails {
  projectName: string;
  projectDescription: string;
  status: string;
  createdDate: string;
  productOwnerName: string;
  productOwneremail: string;
}

interface ScrumTeamDetails {
  projectName: string | null;
  scrumTeamName: string;
  projectMembers: {
    email: string;
    role: string;
    status: string;
  }[];
}

interface CurrentUser {
  username: string;
  roles: string[];
}

@Component({
  selector: 'app-scrum-master-dashboard',
  templateUrl: './scrum-master-dashboard.component.html',
  styleUrls: ['./scrum-master-dashboard.component.css'],
  standalone: false
})
export class ScrumMasterDashboardComponent implements OnInit {
  username: string = '';
  projectDetails: ProjectDetails | null = null;
  scrumTeamDetails: ScrumTeamDetails | null = null;

  constructor(private scrumMasterService: ScrumMasterService) {}

  ngOnInit(): void {
    // Get the stored user data
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user: CurrentUser = JSON.parse(storedUser);
      this.username = user.username;
    }
    
    this.loadProjectDetails();
    this.loadScrumTeamDetails();
  }

  private loadProjectDetails(): void {
    this.scrumMasterService.getProjectDetails().subscribe({
      next: (details) => {
        this.projectDetails = details;
      },
      error: (error) => console.error('Error loading project details:', error)
    });
  }

  private loadScrumTeamDetails(): void {
    this.scrumMasterService.getScrumTeamDetails().subscribe({
      next: (details) => {
        this.scrumTeamDetails = details;
      },
      error: (error) => console.error('Error loading scrum team details:', error)
    });
  }
}
