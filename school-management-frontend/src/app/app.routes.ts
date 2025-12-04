import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Students } from './pages/students/student-list/students';
import { AuthGuard } from './security/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'students', component: Students  ,  canActivate: [AuthGuard]}
];
