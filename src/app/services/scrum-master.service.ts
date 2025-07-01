import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrumMasterService {
  private apiUrl = 'http://localhost:8081/api/scrum-master';

  constructor(private http: HttpClient) { }

  getProjectDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/project`);
  }

  getScrumTeamDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-scrum-team`);
  }

  getEpics(projectName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/epics/${projectName}`);
  }

  getEpicDetails(epicTitle: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/epic/${epicTitle}`);
  }

  createSprint(sprintData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-sprint`, sprintData);
  }

  getAvailableUserStories(epicTitle: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/get-available-user-stories/${epicTitle}`);
  }

  createSprintBacklog(backlogData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-sprint-backlog`, backlogData);
  }

  getSprintDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-sprint`);
  }
}