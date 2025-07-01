import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProjectCreate {
  projectName: string;
  projectDescription: string;
}

export interface EpicCreate {
  projectName: string;
  epicTitle: string;
  epicDescription: string;
}

export interface UserStoryCreate {
  epicTitle: string;
  userStoryTitle: string;
  userStoryDescription: string;
  userStoryAcceptanceCriteria: string;
  userStoryPriority: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8081/api/admin'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getProjectStats(): Observable<any> {
    console.log('Fetching project stats from:', `${this.apiUrl}/stats`);
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }

  createProject(projectData: ProjectCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-project`, projectData, this.getHttpOptions());
  }

  assignScrumTeam(teamData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-scrum-team`, teamData, this.getHttpOptions());
  }

  createEpic(epicData: EpicCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-epic`, epicData, this.getHttpOptions());
  }

  createUserStory(userStoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-userstory`, userStoryData, this.getHttpOptions());
  }

  getEpicsByProject(projectName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/epics/${projectName}`);
  }

  getEpicDetails(epicTitle: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/epic/${epicTitle}`);
  }

  getScrumTeams(projectName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/get-scrum-teams/${projectName}`);
  }

  getScrumTeamDetails(teamName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-scrum-team/${teamName}`);
  }

  private getHttpOptions(): { headers: { [key: string]: string } } {
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  // Add other project-related methods here
}