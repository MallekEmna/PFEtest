import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, GraduationCap, Edit, Trash2, Users } from 'lucide-angular';
import { Student } from '../../../../models/student';
import { Level } from '../../../../models/Level';
import { LevelColorPipe } from '../../../../shared/pipe/LevelColorPipe';
import { StudentService } from '../../../../services/StudentService';

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LevelColorPipe],
  templateUrl: './student-table.html',
  styleUrl: './student-table.css',
})
export class StudentTable {
  @Input() data: Student[] = [];
  @Output() studentDeleted = new EventEmitter<number>();
  
  readonly UserIcon = User;
  readonly GraduationCapIcon = GraduationCap;
  readonly EditIcon = Edit;
  readonly Trash2Icon = Trash2;
  readonly UsersIcon = Users;
  
  constructor(private studentService: StudentService) {}
  
  getLevelName(level: Level): string {
    return Level[level];
  }
  
  deleteStudent(studentId: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          console.log('Student deleted successfully');
          this.studentDeleted.emit(studentId);
        },
        error: (err) => {
          console.error('Error deleting student:', err);
          alert('Failed to delete student. Please try again.');
        }
      });
    }
  }
}
