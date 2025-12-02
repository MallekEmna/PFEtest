import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/StudentService';
import { Student } from '../../../models/student';
import { CommonModule } from '@angular/common';
import { StudentTable } from '../components/student-table/student-table';
import { StudentForm } from '../components/student-form/student-form';
import { Level } from '../../../models/Level';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, StudentTable, StudentForm],
  templateUrl: './students.html',
  styleUrls: ['./students.css'],
})
export class Students implements OnInit {
  students: Student[] = [];
  isLoading = false;
  hasError = false;
  showForm = false;

  constructor(private studentService: StudentService) { }

  ngOnInit() {
    console.log('Students component initialized');
    this.loadStudents();
  }

  onStudentDeleted(studentId: number): void {
    console.log('Student deleted:', studentId);
    //remove immediately from UI
    this.students = this.students.filter(s => s.id !== studentId);
    this.loadStudents();
  }

  showAddForm(): void {
    this.showForm = true;
  }

  hideForm(): void {
    this.showForm = false;
  }

  onStudentAdded(student: Student): void {
    console.log('Adding student:', student);
    
    this.studentService.createStudent(student).subscribe({
      next: (newStudent) => {
        console.log('Student added successfully:', newStudent);
        this.hideForm();
        this.loadStudents(); // Recharger la liste
      },
      error: (err) => {
        console.error('Error adding student:', err);
        alert('Failed to add student. Please try again.');
      }
    });
  }

  loadStudents() {
    console.log('Loading students...');
    this.isLoading = true;
    this.hasError = false;
    
    const timeout = setTimeout(() => {
      if (this.isLoading) {
        console.warn('Loading timeout - resetting state');
        this.isLoading = false;
        this.hasError = true;
      }
    }, 5000); 
    
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        clearTimeout(timeout);
        console.log('Students loaded:', data);
        this.students = data;
        this.isLoading = false;
      },
      error: (err) => {
        clearTimeout(timeout);
        console.error('Error loading students:', err);
        this.isLoading = false;
        this.hasError = true;
      }
    });
    
  }
}
