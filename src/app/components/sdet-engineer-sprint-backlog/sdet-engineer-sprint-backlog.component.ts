import { Component, OnInit } from '@angular/core';
import { SdetEngineerService } from '../../services/sdet-engineer.service';

@Component({
  selector: 'app-sdet-engineer-sprint-backlog',
  templateUrl: './sdet-engineer-sprint-backlog.component.html',
  standalone: false
})
export class SdetEngineerSprintBacklogComponent implements OnInit {
  scrumMaster: any = null;
  sprintDetails: any = null;
  teamName: string = 'Marvels';

  constructor(private sdetEngineerService: SdetEngineerService) {}

  ngOnInit(): void {
    this.loadScrumMasterDetails();
    this.loadSprintDetails();
  }

  private loadScrumMasterDetails(): void {
    this.sdetEngineerService.getScrumMasterDetails(this.teamName).subscribe({
      next: (details) => {
        this.scrumMaster = details;
      },
      error: (error) => console.error('Error loading Scrum Master details:', error)
    });
  }

  private loadSprintDetails(): void {
    this.sdetEngineerService.getSprintDetails(this.teamName).subscribe({
      next: (details) => {
        this.sprintDetails = details;
      },
      error: (error) => console.error('Error loading Sprint details:', error)
    });
  }
}