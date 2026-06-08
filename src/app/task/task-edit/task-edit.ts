import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, Task } from '../services/task';

@Component({
  selector: 'app-task-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-edit.html',
  styleUrl: './task-edit.css',
})
export class TaskEdit implements OnInit {
  id: string = '';
  task: Task = {
    title: '',
    description: '',
    completed: false
  };
  errorMessage = '';
  isLoading = false;
  isFetching = true;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (!taskId) {
      this.errorMessage = 'No se proporcionó un ID de tarea válido.';
      this.isFetching = false;
      return;
    }

    this.id = taskId;
    this.fetchTask();
  }

  fetchTask() {
    this.isFetching = true;
    this.errorMessage = '';

    this.taskService.getTask(this.id).subscribe({
      next: (data) => {
        this.task = { ...data };
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la tarea o no existe.';
        this.isFetching = false;
      }
    });
  }

  onSubmit() {
    if (!this.task.title.trim()) {
      this.errorMessage = 'El título es requerido.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.updateTask(this.id, this.task).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Ocurrió un error al actualizar la tarea. Intente nuevamente.';
      }
    });
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}
