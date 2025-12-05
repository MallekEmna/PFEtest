import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student';
import { Level } from '../models/Level';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    private API_URL = 'http://127.0.0.1:8080/api';

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

    searchStudents(query: string): Observable<Student[]> {
        return this.http.get<Student[]>(`${this.API_URL}/students/search`, {
            params: { q: query }
        });
    }

    filterByLevel(level: Level): Observable<Student[]> {
        return this.http.get<Student[]>(`${this.API_URL}/students/filter`, {
            params: { level: level }
        });
    }

    getStudentsPage(page: number, size: number): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/students/page`, {
            params: { page: page.toString(), size: size.toString() }
        });
    }

    exportStudents(): Observable<Blob> {
        return this.http.get(`${this.API_URL}/students/export`, {
            responseType: 'blob'
        });
    }

    importStudents(file: File): Observable<void> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<void>(`${this.API_URL}/students/import`, formData);
    }

}
