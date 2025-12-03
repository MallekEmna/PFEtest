import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/StudentService';
import { Student } from '../../../models/student';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentTable } from '../components/student-table/student-table';
import { StudentForm } from '../components/student-form/student-form';
import { StudentEdit } from '../components/student-edit/student-edit';
import { Level } from '../../../models/Level';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentTable, StudentForm, StudentEdit],
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
  
  // Search and filter properties
  searchQuery = '';
  selectedLevel: Level | '' = '';
  
  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  
  // Import/Export properties
  isImporting = false;
  isExporting = false;

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

  // Search functionality
  searchStudents(): void {
    if (!this.searchQuery.trim()) {
      this.loadStudents();
      return;
    }
    
    this.isLoading = true;
    this.studentService.searchStudents(this.searchQuery).subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching students:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  // Filter by level functionality
  filterByLevel(): void {
    if (!this.selectedLevel) {
      this.loadStudents();
      return;
    }
    
    this.isLoading = true;
    this.studentService.filterByLevel(this.selectedLevel as Level).subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error filtering students:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  // Pagination functionality
  loadStudentsPage(): void {
    this.isLoading = true;
    this.studentService.getStudentsPage(this.currentPage, this.pageSize).subscribe({
      next: (pageData: any) => {
        this.students = pageData.content;
        this.totalElements = pageData.totalElements;
        this.totalPages = pageData.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading students page:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStudentsPage();
  }

  // Export functionality
  exportStudents(): void {
    this.isExporting = true;
    this.studentService.exportStudents().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
      },
      error: (err) => {
        console.error('Error exporting students:', err);
        alert('Failed to export students. Please try again.');
        this.isExporting = false;
      }
    });
  }

  // Import functionality
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.importStudents(file);
    }
  }

  importStudents(file: File): void {
    this.isImporting = true;
    this.studentService.importStudents(file).subscribe({
      next: () => {
        console.log('Students imported successfully');
        this.loadStudents();
        this.isImporting = false;
        alert('Students imported successfully!');
      },
      error: (err) => {
        console.error('Error importing students:', err);
        alert('Failed to import students. Please try again.');
        this.isImporting = false;
      }
    });
  }

  // Clear filters
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedLevel = '';
    this.currentPage = 0;
    this.loadStudents();
  }
}
