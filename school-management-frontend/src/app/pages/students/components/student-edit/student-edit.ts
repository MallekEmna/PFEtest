import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User, GraduationCap, X, Save } from 'lucide-angular';
import { Student } from '../../../../models/student';
import { Level } from '../../../../models/Level';

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './student-edit.html',
  styleUrl: './student-edit.css',
})
export class StudentEdit {
  @Input() student: Student | null = null;
  @Input() isVisible: boolean = false;
  @Output() studentUpdated = new EventEmitter<Student>();
  @Output() formClosed = new EventEmitter<void>();
  
  readonly UserIcon = User;
  readonly GraduationCapIcon = GraduationCap;
  readonly XIcon = X;
  readonly SaveIcon = Save;
  
  levels = Object.values(Level).filter(value => typeof value === 'number') as Level[];
  
  editForm: Student = {
    id: 0,
    username: '',
    level: Level.HIGH
  };

  ngOnChanges(): void {
    if (this.student) {
      this.editForm = { ...this.student };
    }
  }

  onSubmit(): void {
    if (this.editForm.username.trim()) {
      this.studentUpdated.emit(this.editForm);
    }
  }

  closeForm(): void {
    this.formClosed.emit();
  }

  getLevelName(level: Level): string {
    return level; 
  }
}
