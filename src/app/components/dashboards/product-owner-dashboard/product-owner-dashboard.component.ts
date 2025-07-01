import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../../../auth/services/auth.service';
import { ProjectService } from '../../../services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Update the interface to reflect exact status values
interface Project {
  projectName: string;
  projectDescription: string;
  projectStatus: 'Initiated' | 'In Progress' | 'Completed';
  createdDate: string;
  assignedScrumTeams: number;
}

// Add to existing interface
interface ProjectCreate {
  projectName: string;
  projectDescription: string;
}

interface ScrumTeamMember {
  email: string;
  role: 'scrumMaster' | 'sdetEngineer';
}

interface ScrumTeamAssignment {
  projectName: string;
  scrumTeamName: string;
  emailAndRole: { [key: string]: string };
}

@Component({
  selector: 'app-product-owner-dashboard',
  templateUrl: './product-owner-dashboard.component.html',
  styleUrls: ['./product-owner-dashboard.component.css'],
  standalone: false
})
export class ProductOwnerDashboardComponent implements OnInit {
  username: string = '';
  roles: string[] = [];
  totalProjects: number = 0;
  projectChart: any;
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  projectStats = {
    initiated: 0,
    inProgress: 0,
    completed: 0
  };

  // Simplified filters
  filters = {
    projectStatus: '',
    createdDate: ''
  };

  // Add these properties
  showCreateModal: boolean = false;
  createProjectForm: FormGroup;

  // Add these properties
  showAssignTeamModal: boolean = false;
  assignTeamForm!: FormGroup;
  teamMembers: ScrumTeamMember[] = [{ email: '', role: 'sdetEngineer' }];
  maxTeamSize: number = 8;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private fb: FormBuilder
  ) {
    this.createProjectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectDescription: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.initializeAssignTeamForm();
  }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.username = user.username;
      this.roles = user.roles;
    }
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        console.log('Received projects:', projects);
        this.projects = projects;
        this.filteredProjects = [...projects];
        this.calculateProjectStats();
        this.initializeChart();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  private calculateProjectStats(): void {
    console.log('Calculating stats for projects:', this.filteredProjects);
    this.projectStats = {
      initiated: this.filteredProjects.filter(p => p.projectStatus === 'Initiated').length,
      inProgress: this.filteredProjects.filter(p => p.projectStatus === 'In Progress').length,
      completed: this.filteredProjects.filter(p => p.projectStatus === 'Completed').length
    };
    this.totalProjects = this.filteredProjects.length;
    console.log('Project stats:', this.projectStats);
  }

  applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      return (
        project.projectStatus.toLowerCase().includes(this.filters.projectStatus.toLowerCase()) &&
        project.createdDate.includes(this.filters.createdDate)
      );
    });
    this.calculateProjectStats();
    this.updateChart();
  }

  private updateChart(): void {
    if (this.projectChart) {
      const data = [
        this.projectStats.initiated,
        this.projectStats.inProgress,
        this.projectStats.completed
      ];
      console.log('Updating chart with data:', data);
      this.projectChart.data.datasets[0].data = data;
      this.projectChart.update();
    }
  }

  private initializeChart(): void {
    const ctx = document.getElementById('projectChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Could not find canvas element');
      return;
    }

    if (this.projectChart) {
      this.projectChart.destroy();
    }

    console.log('Initializing chart with data:', [
      this.projectStats.initiated,
      this.projectStats.inProgress,
      this.projectStats.completed
    ]);

    this.projectChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Initiated', 'In Progress', 'Completed'],
        datasets: [{
          data: [
            this.projectStats.initiated,
            this.projectStats.inProgress,
            this.projectStats.completed
          ],
          backgroundColor: [
            '#4F46E5', // blue for Initiated
            '#F59E0B', // yellow for In Progress
            '#10B981'  // green for Completed
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 10,
              boxWidth: 10,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value} project(s)`;
              }
            }
          }
        }
      }
    });
  }

  // Add these methods
  openCreateProjectModal(): void {
    this.showCreateModal = true;
    this.createProjectForm.reset();
  }

  closeCreateProjectModal(): void {
    this.showCreateModal = false;
  }

  createProject(): void {
    if (this.createProjectForm.valid) {
      const projectData: ProjectCreate = this.createProjectForm.value;
      
      this.projectService.createProject(projectData).subscribe({
        next: (response) => {
          console.log('Project created successfully:', response);
          this.closeCreateProjectModal();
          this.loadProjects(); // Refresh the project list
        },
        error: (error) => {
          console.error('Error creating project:', error);
        }
      });
    }
  }

  private initializeAssignTeamForm(): void {
    this.assignTeamForm = this.fb.group({
      projectName: ['', Validators.required],
      scrumTeamName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  openAssignTeamModal(): void {
    this.showAssignTeamModal = true;
    this.teamMembers = [{ email: '', role: 'sdetEngineer' }];
    if (this.assignTeamForm) {
      this.assignTeamForm.reset();
    }
  }

  closeAssignTeamModal(): void {
    this.showAssignTeamModal = false;
  }

  addTeamMember(): void {
    if (this.teamMembers.length < this.maxTeamSize) {
      this.teamMembers.push({ email: '', role: 'sdetEngineer' });
    }
  }

  removeTeamMember(index: number): void {
    this.teamMembers.splice(index, 1);
  }

  onRoleChange(index: number, role: 'scrumMaster' | 'sdetEngineer'): void {
    if (role === 'scrumMaster') {
      // Reset other scrum master selections
      this.teamMembers.forEach((member, i) => {
        if (i !== index && member.role === 'scrumMaster') {
          member.role = 'sdetEngineer';
        }
      });
    }
  }

  assignTeam(): void {
    if (this.assignTeamForm && this.assignTeamForm.valid && this.validateTeamComposition()) {
      const formValue = this.assignTeamForm.value;
      const emailAndRole: { [key: string]: string } = {};
      
      this.teamMembers.forEach(member => {
        if (member.email && member.role) {
          emailAndRole[member.email] = member.role;
        }
      });

      const payload: ScrumTeamAssignment = {
        projectName: formValue.projectName,
        scrumTeamName: formValue.scrumTeamName,
        emailAndRole: emailAndRole
      };

      this.projectService.assignScrumTeam(payload).subscribe({
        next: (response) => {
          console.log('Scrum team assigned successfully:', response);
          this.closeAssignTeamModal();
          this.loadProjects(); // Refresh the project list
        },
        error: (error) => {
          console.error('Error assigning scrum team:', error);
        }
      });
    }
  }

  public validateTeamComposition(): boolean {
    const hasScrumMaster = this.teamMembers.some(member => member.role === 'scrumMaster');
    const validEmails = this.teamMembers.every(member => member.email && member.email.includes('@'));
    return hasScrumMaster && validEmails;
  }

  logout(): void {
    this.authService.logout();
  }
}