import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrumMasterService } from '../../services/scrum-master.service';

interface SprintDetails {
  sprintTitle: string;
  sprintGoal: string;
  startDate: string;
  endDate: string;
  sprintStatus: string;
  epicResponse: {
    projectName: string;
    epicTitle: string;
    epicDescription: string;
    epicStatus: string;
    userStories: {
      userStoryId: number;
      userStoryTitle: string;
      userStoryDescription: string;
      userStoryAcceptanceCriteria: string;
      userStoryPriority: string;
      userStoryStatus: string;
      createdDate: string;
      updatedDate: string;
    }[];
  };
}

@Component({
  selector: 'app-scrum-master-sprint-backlog',
  templateUrl: './scrum-master-sprint-backlog.component.html',
  styleUrls: ['./scrum-master-sprint-backlog.component.css'],
  standalone: false
})
export class ScrumMasterSprintBacklogComponent implements OnInit {
  // Modal visibility flags
  showCreateSprintModal: boolean = false;
  showCreateBacklogModal: boolean = false;

  // Form groups
  createSprintForm!: FormGroup;
  createBacklogForm!: FormGroup;

  // Data arrays
  epicTitles: string[] = [];
  availableUserStories: string[] = [];

  // Date constraints
  minStartDate!: string;
  minEndDate!: string;

  sprintDetails: SprintDetails | null = null;

  constructor(
    private fb: FormBuilder,
    private scrumMasterService: ScrumMasterService
  ) {
    this.initializeForms();
    this.setMinDates();
  }

  ngOnInit(): void {
    this.loadSprintDetails();
    // Load project details and epics when component initializes
    this.scrumMasterService.getProjectDetails().subscribe({
      next: (details) => {
        if (details && details.projectName) {
          this.loadEpics(details.projectName);
        }
      },
      error: (error) => console.error('Error loading project details:', error)
    });
  }

  private initializeForms(): void {
    this.createSprintForm = this.fb.group({
      epicTitle: ['', Validators.required],
      sprintTitle: ['', Validators.required],
      sprintGoal: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.createBacklogForm = this.fb.group({
      epicTitle: ['', Validators.required],
      userStoryTitles: [[], Validators.required]
    });
  }

  private setMinDates(): void {
    const today = new Date();
    this.minStartDate = today.toISOString().split('T')[0];
  }

  private loadEpics(projectName: string): void {
    this.scrumMasterService.getEpics(projectName).subscribe({
      next: (epics) => {
        this.epicTitles = epics;
        console.log('Loaded epics:', epics); // Debug log
      },
      error: (error) => console.error('Error loading epics:', error)
    });
  }

  private loadSprintDetails(): void {
    this.scrumMasterService.getSprintDetails().subscribe({
      next: (details) => {
        this.sprintDetails = details;
      },
      error: (error) => console.error('Error loading sprint details:', error)
    });
  }

  onStartDateChange(event: any): void {
    const startDate = new Date(event.target.value);
    const minEndDate = new Date(startDate);
    minEndDate.setDate(startDate.getDate() + 14); // 2 weeks minimum
    this.minEndDate = minEndDate.toISOString().split('T')[0];
    
    const currentEndDate = this.createSprintForm.get('endDate')?.value;
    if (currentEndDate && new Date(currentEndDate) < minEndDate) {
      this.createSprintForm.patchValue({ endDate: this.minEndDate });
    }
  }

  onEpicSelectForBacklog(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedEpic = selectElement.value;
    
    if (selectedEpic) {
      this.scrumMasterService.getAvailableUserStories(selectedEpic).subscribe({
        next: (stories) => {
          this.availableUserStories = stories;
          console.log('Loaded user stories:', stories); // Debug log
        },
        error: (error) => console.error('Error loading user stories:', error)
      });
    } else {
      this.availableUserStories = [];
    }
  }

  createSprint(): void {
    if (this.createSprintForm.valid) {
      this.scrumMasterService.createSprint(this.createSprintForm.value).subscribe({
        next: () => {
          console.log('Sprint created successfully');
          this.showCreateSprintModal = false;
          this.createSprintForm.reset();
        },
        error: (error: any) => console.error('Error creating sprint:', error)
      });
    }
  }

  createSprintBacklog(): void {
    if (this.createBacklogForm.valid) {
      this.scrumMasterService.createSprintBacklog(this.createBacklogForm.value).subscribe({
        next: () => {
          console.log('Sprint backlog created successfully');
          this.showCreateBacklogModal = false;
          this.createBacklogForm.reset();
        },
        error: (error: any) => console.error('Error creating sprint backlog:', error)
      });
    }
  }
}