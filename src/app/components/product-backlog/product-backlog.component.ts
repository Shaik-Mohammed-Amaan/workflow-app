import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';


interface Project {
  projectName: string;
  // ... other project properties
}

interface Epic {
  epicTitle: string;
  // ... other epic properties
}

interface UserStory {
  userStoryId: number;
  userStoryTitle: string;
  userStoryDescription: string;
  userStoryAcceptanceCriteria: string;
  userStoryPriority: string;
  userStoryStatus: string;
  createdDate: string;
  updatedDate: string;
}

interface EpicDetails {
  projectName: string;
  epicTitle: string;
  epicDescription: string;
  epicStatus: string;
  userStories: UserStory[];
}

@Component({
  selector: 'app-product-backlog',
  templateUrl: './product-backlog.component.html',
  styleUrls: [],
  standalone: false
})
export class ProductBacklogComponent implements OnInit {
  showEpicModal: boolean = false;
  showUserStoryModal: boolean = false;
  epicForm!: FormGroup;
  userStoryForm!: FormGroup;
  projects: Project[] = [];
  acceptanceCriteria: string[] = [];
  selectedProject: string = '';
  selectedEpic: string = '';
  epicTitles: string[] = [];
  epicDetails: EpicDetails | null = null;
  showSuccessMessage = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  private initializeForms(): void {
    this.epicForm = this.fb.group({
      projectName: ['', [Validators.required]],
      epicTitle: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_]+$')]],
      epicDescription: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.userStoryForm = this.fb.group({
      epicTitle: ['', [Validators.required]],
      userStoryTitle: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_]+$')]],
      userStoryDescription: ['', [Validators.required, Validators.minLength(10)]],
      userStoryPriority: ['', [Validators.required]]
    });
  }

  openEpicModal(): void {
    this.showEpicModal = true;
    this.epicForm.reset();
  }

  openUserStoryModal(): void {
    this.showUserStoryModal = true;
    this.userStoryForm.patchValue({
      epicTitle: this.selectedEpic || ''
    });
    this.acceptanceCriteria = [''];
  }

  closeEpicModal(): void {
    this.showEpicModal = false;
  }

  closeUserStoryModal(): void {
    this.showUserStoryModal = false;
    this.userStoryForm.reset();
    this.acceptanceCriteria = [''];
  }

  addAcceptanceCriteria(): void {
    this.acceptanceCriteria.push('');
  }

  removeAcceptanceCriteria(index: number): void {
    if (this.acceptanceCriteria.length > 1) {
      this.acceptanceCriteria.splice(index, 1);
    }
  }

  onAcceptanceCriteriaChange(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.acceptanceCriteria[index] = target.value;
  }

  createEpic(): void {
    if (this.epicForm.valid) {
      this.projectService.createEpic(this.epicForm.value).subscribe({
        next: (response) => {
          console.log('Epic created successfully');
          this.epicForm.reset();
          this.loadProjects();
          this.closeEpicModal();
        },
        error: (error) => {
          console.error('Error creating epic:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.epicForm);
    }
  }

  createUserStory(): void {
    if (this.userStoryForm.valid && this.acceptanceCriteria.some(criteria => criteria.trim())) {
      const formData = {
        ...this.userStoryForm.value,
        userStoryAcceptanceCriteria: this.acceptanceCriteria
          .filter(criteria => criteria.trim())
          .map((criteria, index) => `${index + 1}. ${criteria}`)
          .join(',')
      };

      console.log('Creating user story with data:', formData);

      this.projectService.createUserStory(formData).subscribe({
        next: (response) => {
          console.log('User story created successfully:', response);
          this.userStoryForm.reset();
          this.acceptanceCriteria = [''];
          this.closeUserStoryModal();
          if (this.selectedEpic) {
            this.onEpicSelect(this.selectedEpic);
          }
        },
        error: (error) => {
          console.error('Error creating user story:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.userStoryForm);
      if (!this.acceptanceCriteria.some(criteria => criteria.trim())) {
        console.error('At least one acceptance criteria is required');
      }
    }
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  onProjectSelect(projectName: string): void {
    console.log('Selected project:', projectName);
    this.selectedProject = projectName;
    this.selectedEpic = '';
    this.epicDetails = null;
    
    if (projectName) {
      this.projectService.getEpicsByProject(projectName).subscribe({
        next: (titles) => {
          console.log('Received epic titles:', titles);
          this.epicTitles = titles;
        },
        error: (error) => {
          console.error('Error loading epics:', error);
          this.epicTitles = [];
        }
      });
    } else {
      this.epicTitles = [];
    }
  }

  onEpicSelect(epicTitle: string): void {
    console.log('Selected epic:', epicTitle);
    if (epicTitle) {
      this.projectService.getEpicDetails(epicTitle).subscribe({
        next: (details) => {
          console.log('Received epic details:', details);
          this.epicDetails = details;
        },
        error: (error) => console.error('Error loading epic details:', error)
      });
    } else {
      this.epicDetails = null;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFormControlError(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['pattern']) return 'Invalid format';
      if (control.errors['minlength']) return 'Too short';
    }
    return '';
  }

  isUserStoryValid(): boolean {
    return this.userStoryForm.valid && 
           this.acceptanceCriteria && 
           this.acceptanceCriteria.length > 0 && 
           this.acceptanceCriteria.every(criteria => criteria && criteria.trim().length > 0);
  }
}