package com.relead.schoolManagement.service;

import com.relead.schoolManagement.entity.Level;
import com.relead.schoolManagement.entity.Student;
import com.relead.schoolManagement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.io.IOException;
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

        public Student updateStudent(Long id, Student updatedStudent) {
            Student existing = getStudentById(id);

            existing.setUsername(updatedStudent.getUsername());
            existing.setLevel(updatedStudent.getLevel());

            return repo.save(existing);
        }

        public void deleteStudent(Long id) {
            repo.deleteById(id);
        }


        public List<Student> searchStudents(String query) {
            return repo.searchStudents(query.toLowerCase());
        }

        public List<Student> filterByLevel(Level level) {
            return repo.findByLevel(level);
        }

        public Page<Student> getStudentsPage(int page, int size) {
            return repo.findAll(PageRequest.of(page, size));
        }

        public byte[] exportStudents() {
            List<Student> students = repo.findAll();
            StringBuilder sb = new StringBuilder("id,username,email,level\n");
            for (Student s : students) {
                sb.append(s.getId()).append(",")
                        .append(s.getUsername()).append(",")
                        .append(s.getLevel()).append("\n");
            }
            return sb.toString().getBytes();
        }

        public void importStudents(MultipartFile file) throws IOException {
            String content = new String(file.getBytes());
            String[] lines = content.split("\n");

            for (int i = 1; i < lines.length; i++) { // skip header
                String[] fields = lines[i].split(",");
                Student student = new Student();
                student.setUsername(fields[1]);
                student.setLevel(Level.valueOf(fields[2]));
                repo.save(student);
            }
        }
    }
