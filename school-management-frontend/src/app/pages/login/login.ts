import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username!: string;
  password!: string;
 
  constructor(private auth: AuthService , private router: Router) {}

  submitForm(): void {
    console.log('submitForm called', { username: this.username, password: this.password });
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        console.log('login success', res);
        console.log('Token received:', res.token);
        this.auth.saveToken(res.token);
        console.log('Token after saveToken:', this.auth.getToken());
        this.router.navigate(['/students']);
      },
      error: (err) => {
        console.error('login error', err);
        alert('Bad credentials');
      }
    });
  }
}
