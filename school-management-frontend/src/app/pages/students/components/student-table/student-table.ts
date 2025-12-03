import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, GraduationCap, Edit, Trash2, Users } from 'lucide-angular';
import { Student } from '../../../../models/student';
import { Level } from '../../../../models/Level';
import { LevelColorPipe } from '../../../../shared/pipe/LevelColorPipe';

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LevelColorPipe],
  templateUrl: './student-table.html',
  styleUrl: './student-table.css',
})
export class StudentTable {
  @Input() data: Student[] = [];
  @Output() deleteStudentRequest = new EventEmitter<number>();
  @Output() editStudentRequest = new EventEmitter<Student>();
  
  readonly UserIcon = User;
  readonly GraduationCapIcon = GraduationCap;
  readonly EditIcon = Edit;
  readonly Trash2Icon = Trash2;
  readonly UsersIcon = Users;
    
  getLevelName(level: Level): string {
    return level; // Now returns "PRIMARY", "MIDDLE", "HIGH" directly
  }
  
  requestDeleteStudent(studentId: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.deleteStudentRequest.emit(studentId);
    }
  }

  requestEditStudent(student: Student): void {
    this.editStudentRequest.emit(student);
  }
}
