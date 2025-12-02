package com.relead.schoolManagement.service;

import com.relead.schoolManagement.entity.Student;
import com.relead.schoolManagement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public List<Student> getAllStudents() {
        return repo.findAll();
    }

    public Student getStudentById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student createStudent(Student student) {
        return repo.save(student);
    }

    public Student updateStudent(Student updatedStudent) {
        return repo.save(updatedStudent);
    }

    public void deleteStudent(Long id) {
        repo.deleteById(id);
    }
}
