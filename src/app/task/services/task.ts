import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private api = 'http://localhost:8080/api/tasks';
  private localTasksKey = 'local_tasks';

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && !localStorage.getItem(this.localTasksKey)) {
      const initialTasks: Task[] = [
        { id: '1', title: 'Diseñar interfaz de usuario', description: 'Crear bocetos y definir paleta de colores para la app.', completed: true },
        { id: '2', title: 'Implementar CRUD de tareas', description: 'Crear componentes task-list, task-create y task-edit.', completed: false },
        { id: '3', title: 'Configurar interceptor de seguridad', description: 'Agregar token JWT a todas las cabeceras de HTTP.', completed: false }
      ];
      localStorage.setItem(this.localTasksKey, JSON.stringify(initialTasks));
    }
  }

  private getLocalTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.localTasksKey);
    return data ? JSON.parse(data) : [];
  }

  private saveLocalTasks(tasks: Task[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.localTasksKey, JSON.stringify(tasks));
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api).pipe(
      tap(tasks => this.saveLocalTasks(tasks)),
      catchError(() => of(this.getLocalTasks()))
    );
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.api}/${id}`).pipe(
      catchError(() => {
        const local = this.getLocalTasks().find(t => t.id === id);
        return local ? of(local) : throwError(() => new Error('Tarea no encontrada'));
      })
    );
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.api, task).pipe(
      tap(() => this.getTasks().subscribe()),
      catchError(() => {
        const local = this.getLocalTasks();
        const newTask: Task = {
          ...task,
          id: Date.now().toString()
        };
        local.push(newTask);
        this.saveLocalTasks(local);
        return of(newTask);
      })
    );
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.api}/${id}`, task).pipe(
      tap(() => this.getTasks().subscribe()),
      catchError(() => {
        const local = this.getLocalTasks();
        const index = local.findIndex(t => t.id === id);
        if (index > -1) {
          local[index] = { ...local[index], ...task, id };
          this.saveLocalTasks(local);
          return of(local[index]);
        }
        return throwError(() => new Error('Tarea no encontrada'));
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`).pipe(
      tap(() => this.getTasks().subscribe()),
      catchError(() => {
        const local = this.getLocalTasks();
        const updated = local.filter(t => t.id !== id);
        this.saveLocalTasks(updated);
        return of(undefined);
      })
    );
  }
}
