package com.relead.schoolManagement.controller;

import com.relead.schoolManagement.entity.Level;
import com.relead.schoolManagement.entity.Student;
import com.relead.schoolManagement.service.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {
    @Autowired
    private StudentService studentService ;

        public StudentController(StudentService studentService) {
            this.studentService = studentService;
        }

        @GetMapping
        public List<Student> getAllStudents() {
            return studentService.getAllStudents();
        }

        @GetMapping("/{id}")
        public Student getStudent(@PathVariable Long id) {
            return studentService.getStudentById(id);
        }

        @PostMapping
        public Student createStudent(@RequestBody Student student) {
            return studentService.createStudent(student);
        }

        @PutMapping("/{id}")
        public Student updateStudent(@PathVariable Long id, @RequestBody Student student) {
            return studentService.updateStudent(id, student);
        }

        @DeleteMapping("/{id}")
        public void deleteStudent(@PathVariable Long id) {
            studentService.deleteStudent(id);
        }

        @GetMapping("/search")
        public List<Student> searchStudents(@RequestParam String q) {
            return studentService.searchStudents(q);
        }

        @GetMapping("/filter")
        public List<Student> filterByLevel(@RequestParam Level level) {
            return studentService.filterByLevel(level);
        }

        @GetMapping("/page")
        public Page<Student> getStudentsPage(@RequestParam int page,
                                             @RequestParam int size) {
            return studentService.getStudentsPage(page, size);
        }

        @GetMapping("/export")
        public byte[] export() {
            return studentService.exportStudents();
        }

        @PostMapping("/import")
        public void importStudents(@RequestParam("file") MultipartFile file)
                throws IOException {
            studentService.importStudents(file);
        }
    }
