import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SdetEngineerService } from '../../services/sdet-engineer.service';

interface Task {
  userStoryTitle: string;
  taskTitle: string;
  taskDescription: string;
  dueDate: string;
  priority: string;
  createdDate: string;
  createdBy: string;
  status: string;
}

@Component({
  selector: 'app-sdet-engineer-tasks',
  templateUrl: './sdet-engineer-tasks.component.html',
  styleUrls: ['./sdet-engineer-tasks.component.css'],
  standalone: false
})
export class SdetEngineerTasksComponent implements OnInit {
  showCreateTaskModal = false;
  createTaskForm!: FormGroup;
  userStories: string[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  minDate!: string;

  constructor(
    private fb: FormBuilder,
    private sdetEngineerService: SdetEngineerService
  ) {
    this.initializeForm();
    this.setMinDate();
  }

  ngOnInit(): void {
    this.loadUserStories();
    this.loadTasks();
  }

  private initializeForm(): void {
    this.createTaskForm = this.fb.group({
      userStoryTitle: ['', Validators.required],
      taskTitle: ['', Validators.required],
      taskDescription: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required]
    });
  }

  private setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  private loadUserStories(): void {
    this.sdetEngineerService.getSprintDetails('Marvels').subscribe({
      next: (response) => {
        this.userStories = response.epicResponse.userStories.map(
          (story: any) => story.userStoryTitle
        );
      },
      error: (error) => console.error('Error loading user stories:', error)
    });
  }

  private loadTasks(): void {
    console.log('Fetching tasks from backend...');
    
    this.sdetEngineerService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        console.log('Received tasks from backend:', tasks);
        
        // Clear existing arrays
        this.todoTasks = [];
        this.inProgressTasks = [];
        this.completedTasks = [];
        
        // Distribute tasks based on their status
        tasks.forEach(task => {
          console.log('Processing task:', {
            title: task.taskTitle,
            status: task.status
          });
          
          const taskCopy = {...task};
          switch(taskCopy.status) {
            case 'Todo':
              this.todoTasks.push(taskCopy);
              break;
            case 'In Progress':
              this.inProgressTasks.push(taskCopy);
              break;
            case 'Completed':
              this.completedTasks.push(taskCopy);
              break;
            default:
              console.warn('Unknown task status:', taskCopy.status);
          }
        });

        console.log('Tasks distributed:', {
          todo: this.todoTasks.length,
          inProgress: this.inProgressTasks.length,
          completed: this.completedTasks.length
        });
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        alert('Error loading tasks. Please refresh the page.');
      }
    });
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const taskToMove = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getStatusFromListId(event.container.id);
      
      console.log('Attempting to move task:', {
        taskTitle: taskToMove.taskTitle,
        fromStatus: taskToMove.status,
        toStatus: newStatus
      });

      this.sdetEngineerService.changeTaskStatus(taskToMove.taskTitle, newStatus).subscribe({
        next: (response) => {
          console.log('Backend response for status change:', response);
          
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          
          // Update the task status in our local state
          const movedTask = event.container.data[event.currentIndex];
          movedTask.status = newStatus;
          
          console.log('Task status updated successfully:', {
            taskTitle: movedTask.taskTitle,
            newStatus: movedTask.status
          });
        },
        error: (error) => {
          console.error('Failed to update task status:', error);
          alert('Failed to move task. Please try again.');
        }
      });
    }
  }

  private getStatusFromListId(listId: string): string {
    switch (listId) {
      case 'todoList':
        return 'Todo';
      case 'inProgressList':
        return 'In Progress';
      case 'completedList':
        return 'Completed';
      default:
        return 'Todo';
    }
  }

  createTask(): void {
    if (this.createTaskForm.valid) {
      this.sdetEngineerService.createTask(this.createTaskForm.value).subscribe({
        next: () => {
          this.showCreateTaskModal = false;
          this.createTaskForm.reset();
          this.loadTasks();
        },
        error: (error) => console.error('Error creating task:', error)
      });
    }
  }
}