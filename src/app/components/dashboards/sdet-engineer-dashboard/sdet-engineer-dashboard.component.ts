import { Component, OnInit } from '@angular/core';
import { SdetEngineerService } from '../../../services/sdet-engineer.service';

interface ProjectDetails {
  projectName: string;
  projectDescription: string;
  status: string;
  createdDate: string;
  productOwnerName: string;
  productOwneremail: string;
}

interface ProjectMember {
  email: string;
  role: string;
  status: string;
}

interface ScrumTeam {
  projectName: string | null;
  scrumTeamName: string;
  projectMembers: ProjectMember[];
}

@Component({
  selector: 'app-sdet-engineer-dashboard',
  templateUrl: './sdet-engineer-dashboard.component.html',
  styleUrls: ['./sdet-engineer-dashboard.component.css'],
  standalone: false,
})
export class SdetEngineerDashboardComponent implements OnInit {
  username: string = '';
  projectDetails: ProjectDetails | null = null;
  scrumTeamDetails: ScrumTeam | null = null;

  constructor(private sdetEngineerService: SdetEngineerService) {
    // Get username from localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.username = userData.username;
    }
  }

  ngOnInit(): void {
    this.loadProjectDetails();
    this.loadScrumTeamDetails();
  }

  private loadProjectDetails(): void {
    this.sdetEngineerService.getProjectDetails().subscribe({
      next: (details) => {
        this.projectDetails = details;
      },
      error: (error) => console.error('Error loading project details:', error)
    });
  }

  private loadScrumTeamDetails(): void {
    this.sdetEngineerService.getScrumTeamDetails().subscribe({
      next: (details) => {
        this.scrumTeamDetails = details;
      },
      error: (error) => console.error('Error loading scrum team details:', error)
    });
  }
}