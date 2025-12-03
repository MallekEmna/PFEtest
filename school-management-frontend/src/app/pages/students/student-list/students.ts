import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/StudentService';
import { Student } from '../../../models/student';
import { CommonModule } from '@angular/common';
import { StudentTable } from '../components/student-table/student-table';
import { StudentForm } from '../components/student-form/student-form';
import { StudentEdit } from '../components/student-edit/student-edit';
import { Level } from '../../../models/Level';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, StudentTable, StudentForm, StudentEdit],
  templateUrl: './students.html',
  styleUrls: ['./students.css'],
})
export class Students implements OnInit {
  students: Student[] = [];
  isLoading = false;
  hasError = false;
  showForm = false;
  showEditForm = false;
  selectedStudent: Student | null = null;

  constructor(private studentService: StudentService) { }

  ngOnInit() {
    console.log('Students component initialized');
    this.loadStudents();
  }
  onDeleteStudentRequest(studentId: number): void {
    console.log('Delete request received for student:', studentId);
    this.studentService.deleteStudent(studentId).subscribe({
      next: () => {
        console.log('Student deleted successfully');
        this.students = this.students.filter(s => s.id !== studentId);
        this.loadStudents();
      },
      error: (err) => {
        console.error('Error deleting student:', err);
        alert('Failed to delete student. Please try again.');
      }
    });
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
        this.loadStudents();
      },
      error: (err) => {
        console.error('Error adding student:', err);
        alert('Failed to add student. Please try again.');
      }
    });
  }

  openEditForm(student: Student): void {
    this.selectedStudent = student;
    this.showEditForm = true;
  }

  hideEditForm(): void {
    this.showEditForm = false;
    this.selectedStudent = null;
  }

  onStudentUpdated(student: Student): void {
    console.log('Updating student:', student);
    
    if (!student.id) {
      console.error('Student ID is required for update');
      alert('Student ID is missing. Cannot update student.');
      return;
    }
    
    this.studentService.updateStudent(student.id, student).subscribe({
      next: (updatedStudent) => {
        console.log('Student updated successfully:', updatedStudent);
        this.hideEditForm();
        this.loadStudents();
      },
      error: (err) => {
        console.error('Error updating student:', err);
        alert('Failed to update student. Please try again.');
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
