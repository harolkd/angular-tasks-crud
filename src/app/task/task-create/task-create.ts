import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task';

@Component({
  selector: 'app-task-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-create.html',
  styleUrl: './task-create.css',
})
export class TaskCreate {
  task = {
    title: '',
    description: '',
    completed: false
  };
  errorMessage = '';
  isLoading = false;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.task.title.trim()) {
      this.errorMessage = 'El título es requerido.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.createTask(this.task).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Ocurrió un error al guardar la tarea. Intente nuevamente.';
      }
    });
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}
