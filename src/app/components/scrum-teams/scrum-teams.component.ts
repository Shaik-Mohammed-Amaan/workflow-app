import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface ProjectMember {
  email: string;
  role: string;
  status: string;
}

interface ScrumTeamAssignment {
    projectName: string;
    scrumTeamName: string;
    emailAndRole: { [key: string]: string };
  }
  

interface ScrumTeamDetails {
  projectName: string;
  scrumTeamName: string;
  projectMembers: ProjectMember[];
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
  selector: 'app-scrum-teams',
  templateUrl: './scrum-teams.component.html',
  standalone: false,
  })
export class ScrumTeamsComponent implements OnInit {
  projects: any[] = [];
  scrumTeams: string[] = [];
  selectedProject: string = '';
  selectedScrumTeam: string = '';
  scrumTeamDetails: ScrumTeamDetails | null = null;
  
  
  showAssignTeamModal: boolean = false;
    assignTeamForm!: FormGroup;
    teamMembers: ScrumTeamMember[] = [{ email: '', role: 'sdetEngineer' }];
    maxTeamSize: number = 8;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  onProjectSelect(projectName: string): void {
    this.selectedProject = projectName;
    this.selectedScrumTeam = '';
    this.scrumTeamDetails = null;
    
    if (projectName) {
      this.projectService.getScrumTeams(projectName).subscribe({
        next: (teams) => {
          this.scrumTeams = teams;
        },
        error: (error) => console.error('Error loading scrum teams:', error)
      });
    } else {
      this.scrumTeams = [];
    }
  }

  onScrumTeamSelect(teamName: string): void {
    this.selectedScrumTeam = teamName;
    if (teamName) {
      this.projectService.getScrumTeamDetails(teamName).subscribe({
        next: (details) => {
          this.scrumTeamDetails = details;
        },
        error: (error) => console.error('Error loading scrum team details:', error)
      });
    } else {
      this.scrumTeamDetails = null;
    }
  }

  

  private initializeForms(): void {
    this.assignTeamForm = this.fb.group({
      projectName: ['', Validators.required],
      scrumTeamName: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_]+$')]],
      scrumMasterEmail: ['', [Validators.required, Validators.email]],
      sdetEngineerEmail: ['', [Validators.required, Validators.email]]
    });
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
  
}