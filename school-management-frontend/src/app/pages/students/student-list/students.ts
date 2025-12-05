import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { StudentService } from '../../../services/StudentService';
import { Student } from '../../../models/student';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentTable } from '../components/student-table/student-table';
import { StudentForm } from '../components/student-form/student-form';
import { StudentEdit } from '../components/student-edit/student-edit';
import { Level } from '../../../models/Level';
import { finalize } from 'rxjs/operators';

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
  isSearchActive = false;
  isFilterActive = false;
  
  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  
  // Import/Export properties
  isImporting = false;
  isExporting = false;
  constructor(private studentService: StudentService, private cdr: ChangeDetectorRef,@Inject(PLATFORM_ID) private platformId: any
) { }


  ngOnInit() {
    console.log('Students component initialized');
     if (!isPlatformBrowser(this.platformId)) {
        console.log("SSR mode detected → skip API calls");
        return;
    }
    this.loadStudentsPage();
  }

  onDeleteStudentRequest(studentId: number): void {
    console.log('Delete request received for student:', studentId);
    this.studentService.deleteStudent(studentId).subscribe({
      next: () => {
        console.log('Student deleted successfully');
        // Recharger la page actuelle pour maintenir la cohérence
        this.loadCurrentPage();
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
        this.loadCurrentPage();
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
        this.loadCurrentPage();
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

    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        console.log('Students loaded:', data);
        this.students = data;
        this.totalElements = data.length;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  loadStudentsPage(): void {
    console.log('Loading paginated students...');
    this.isLoading = true;
    this.hasError = false;

    this.studentService.getStudentsPage(this.currentPage, this.pageSize).subscribe({
      next: (pageData: any) => {
        console.log('Page loaded:', pageData);
        this.students = pageData.content || [];
        this.totalElements = pageData.totalElements || 0;
        this.totalPages = pageData.totalPages || 0;
        this.isLoading = false;
        // Forcer la détection de changement
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading students page:', err);
        this.hasError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCurrentPage(): void {
    if (this.isSearchActive) {
      this.searchStudents();
    } else if (this.isFilterActive) {
      this.filterByLevel();
    } else {
      this.loadStudentsPage();
    }
  }

  // Search functionality
  searchStudents(): void {
    if (!this.searchQuery.trim()) {
      this.isSearchActive = false;
      this.currentPage = 0;
      this.loadStudentsPage();
      return;
    }
    
    this.isSearchActive = true;
    this.isFilterActive = false;
    this.currentPage = 0;
    this.isLoading = true;
    this.hasError = false;
    
    this.studentService.searchStudents(this.searchQuery).subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.totalElements = data.length;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error searching students:', err);
        this.hasError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Filter by level functionality
  filterByLevel(): void {
    if (!this.selectedLevel) {
      this.isFilterActive = false;
      this.currentPage = 0;
      this.loadStudentsPage();
      return;
    }
    
    this.isFilterActive = true;
    this.isSearchActive = false;
    this.currentPage = 0;
    this.isLoading = true;
    this.hasError = false;
    
    this.studentService.filterByLevel(this.selectedLevel as Level).subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.totalElements = data.length;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error filtering students:', err);
        this.hasError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadCurrentPage();
  }

  // Export functionality
  exportStudents(): void {
    if (this.isExporting) return;
    this.isExporting = true;
    this.studentService.exportStudents()
      .pipe(finalize(() => { this.isExporting = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (blob: Blob) => {
          try {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'students.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          } catch (e) {
            console.error('Export handling error:', e);
            alert('Failed to download file.');
          }
        },
        error: (err) => {
          console.error('Error exporting students:', err);
          alert('Failed to export students. Please try again.');
        }
      });
  }

  // Import functionality
  onFileSelected(event: any): void {
    if (this.isImporting) return;
    const input = event.target as HTMLInputElement;
    const file = input?.files && input.files[0];
    if (file) {
      this.importStudents(file);
    }
    // reset input so selecting the same file triggers change again
    if (input) {
      input.value = '';
    }
  }

  importStudents(file: File): void {
    if (this.isImporting) return;
    this.isImporting = true;
    this.studentService.importStudents(file)
      .pipe(finalize(() => { this.isImporting = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: () => {
          console.log('Students imported successfully');
          this.loadCurrentPage();
          alert('Students imported successfully!');
        },
        error: (err) => {
          console.error('Error importing students:', err);
          alert('Failed to import students. Please try again.');
        }
      });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedLevel = '';
    this.currentPage = 0;
    this.isSearchActive = false;
    this.isFilterActive = false;
    this.loadStudentsPage();
  }
}
