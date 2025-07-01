import { Component, OnInit } from '@angular/core';
import { ScrumMasterService } from '../../services/scrum-master.service';

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
  selector: 'app-scrum-master-product-backlog',
  templateUrl: './scrum-master-product-backlog.component.html',
  standalone: false
})
export class ScrumMasterProductBacklogComponent implements OnInit {
  projectName: string = '';
  epicTitles: string[] = [];
  selectedEpic: string = '';
  epicDetails: EpicDetails | null = null;

  constructor(private scrumMasterService: ScrumMasterService) {}

  ngOnInit(): void {
    // Get project details from the API
    this.scrumMasterService.getProjectDetails().subscribe({
      next: (details) => {
        this.projectName = details.projectName;
        console.log('Project Name:', this.projectName); // Debug log
        this.loadEpics();
      },
      error: (error) => console.error('Error loading project details:', error)
    });
  }

  loadEpics(): void {
    if (!this.projectName) {
      console.error('Project name is not available');
      return;
    }

    console.log('Loading epics for project:', this.projectName); // Debug log
    this.scrumMasterService.getEpics(this.projectName).subscribe({
      next: (epics) => {
        console.log('Received epics:', epics); // Debug log
        this.epicTitles = epics;
      },
      error: (error) => console.error('Error loading epics:', error)
    });
  }

  onEpicSelect(epicTitle: string): void {
    this.selectedEpic = epicTitle;
    if (epicTitle) {
      this.scrumMasterService.getEpicDetails(epicTitle).subscribe({
        next: (details) => {
          this.epicDetails = details;
        },
        error: (error) => console.error('Error loading epic details:', error)
      });
    } else {
      this.epicDetails = null;
    }
  }
}