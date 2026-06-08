import { Component } from '@angular/core';
import { AuthService, RegisterRequest } from '../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  userData: RegisterRequest = { name: '', email: '', password: '' };
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.userData.name || !this.userData.email || !this.userData.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.userData.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.router.navigate(['/tasks']);
    /*this.authService.register(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = 'Ese email ya está registrado.';
        } else {
          this.errorMessage = 'Error al conectar con el servidor.';
        }
      }
    });*/
  }
}
