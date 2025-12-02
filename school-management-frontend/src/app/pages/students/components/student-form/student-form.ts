import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../../../models/student';
import { Level } from '../../../../models/Level';
import { LucideAngularModule, X, User, GraduationCap } from 'lucide-angular';

@Component({
  selector: 'app-student-form', 
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css',
})
export class StudentForm {
  @Output() studentAdded = new EventEmitter<Student>();
  @Output() formClosed = new EventEmitter<void>();
  
  readonly XIcon = X;
  readonly UserIcon = User;
  readonly GraduationCapIcon = GraduationCap;
  readonly Level = Level;
  
  newStudent: Student = {
    username: '',
    level: Level.PRIMARY
  };
  
  levels = Object.values(Level);
  
  onSubmit(): void {
    if (this.newStudent.username.trim()) {
      this.studentAdded.emit({ ...this.newStudent });
      this.resetForm();
    }
  }
  
  onClose(): void {
    this.formClosed.emit();
    this.resetForm();
  }
  
  private resetForm(): void {
    this.newStudent = {
      username: '',
      level: Level.PRIMARY
    };
  }
}
