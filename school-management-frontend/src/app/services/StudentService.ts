import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    private API_URL = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    getAllStudents(): Observable<Student[]> {
        return this.http.get<Student[]>(`${this.API_URL}/students`);
    }

    getStudentById(id: number): Observable<Student> {
        return this.http.get<Student>(`${this.API_URL}/students/${id}`);
    }

    createStudent(student: Student): Observable<Student> {
        return this.http.post<Student>(`${this.API_URL}/students`, student);
    }

    updateStudent(id: number, student: Student): Observable<Student> {
        return this.http.put<Student>(`${this.API_URL}/students/${id}`, student);
    }
    deleteStudent(id: number): Observable<void> {

        return this.http.delete<void>(`${this.API_URL}/students/${id}`);
    }

}
