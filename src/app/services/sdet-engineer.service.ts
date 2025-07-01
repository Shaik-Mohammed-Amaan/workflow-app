import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SdetEngineerService {
  private apiUrl = 'http://localhost:8081/api/sdet-engineer';

  constructor(private http: HttpClient) { }

  getProjectDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/project`);
  }

  getScrumTeamDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-scrum-team`);
  }

  getScrumMasterDetails(teamName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-scrum-master/${teamName}`);
  }

  getSprintDetails(teamName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-sprint/${teamName}`);
  }

  createTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-task`, taskData);
  }

  getTasks(): Observable<any> {
    console.log('Making GET request to:', `${this.apiUrl}/get-tasks`);
    return this.http.get(`${this.apiUrl}/get-tasks`).pipe(
      tap(response => console.log('GET tasks response:', response)),
      catchError(error => {
        console.error('GET tasks error:', error);
        return throwError(() => error);
      })
    );
  }

  changeTaskStatus(taskTitle: string, status: string): Observable<any> {
    const payload = {
      taskTitle: taskTitle,
      status: status
    };
    
    console.log('Making POST request to change status:', {
      url: `${this.apiUrl}/change-status`,
      payload
    });
    
    return this.http.post(`${this.apiUrl}/change-status`, payload).pipe(
      tap(response => console.log('POST change-status response:', response)),
      catchError(error => {
        console.error('POST change-status error:', error);
        return throwError(() => error);
      })
    );
  }
}