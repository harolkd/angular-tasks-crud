import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth';
import { TaskService, Task } from '../services/task';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchQuery: string = '';
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  isLoading: boolean = false;
  errorMessage: string = '';
  showDeleteConfirmId: string | null = null;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las tareas. Intente de nuevo.';
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    let temp = this.tasks;

    // Filter by completed status
    if (this.filterStatus === 'active') {
      temp = temp.filter(t => !t.completed);
    } else if (this.filterStatus === 'completed') {
      temp = temp.filter(t => t.completed);
    }

    // Filter by search query (title or description)
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }

    this.filteredTasks = temp;
  }

  setFilter(status: 'all' | 'active' | 'completed') {
    this.filterStatus = status;
    this.applyFilter();
  }

  toggleTaskStatus(task: Task) {
    if (!task.id) return;
    
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: (savedTask) => {
        const idx = this.tasks.findIndex(t => t.id === task.id);
        if (idx > -1) {
          this.tasks[idx] = savedTask;
          this.applyFilter();
        }
      },
      error: () => {
        this.errorMessage = 'Error al actualizar el estado de la tarea.';
      }
    });
  }

  confirmDelete(id: string) {
    this.showDeleteConfirmId = id;
  }

  cancelDelete() {
    this.showDeleteConfirmId = null;
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.applyFilter();
        this.showDeleteConfirmId = null;
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar la tarea.';
        this.showDeleteConfirmId = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
