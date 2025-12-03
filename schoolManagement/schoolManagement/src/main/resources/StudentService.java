package com.relead.schoolManagement.service;
import com.relead.schoolManagement.entity.Level;
import com.relead.schoolManagement.entity.Student;
import com.relead.schoolManagement.repository.StudentRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
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

    public Student updateStudent(Long id, Student updatedInfo) {
        Student student = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setUsername(updatedInfo.getUsername());
        student.setLevel(updatedInfo.getLevel());

        return repo.save(student);
    }


    public void deleteStudent(Long id) {
        repo.deleteById(id);
    }

    public List<Student> searchStudents(String keyword) {
        return repo.findByUsernameContainingIgnoreCase(keyword);
    }
    public List<Student> filterByLevel(Level level) {
        return repo.findByLevel(level);
    }
    public Page<Student> getStudentsPage(int page, int size) {
        return repo.findAll(PageRequest.of(page, size));
    }
    public void exportStudents(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=students.csv");

        List<Student> students = repo.findAll();
        PrintWriter writer = response.getWriter();
        writer.println("id,username,level");

        for(Student s : students){
            writer.println(s.getId() + "," + s.getUsername() + "," + s.getLevel());
        }
        writer.flush();
        writer.close();
    }
    public void importStudents(MultipartFile file) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()));
        String line;
        br.readLine();
        while ((line = br.readLine()) != null) {
            String[] fields = line.split(",");
            Student s = new Student();
            s.setUsername(fields[1]);
            s.setLevel(Level.valueOf(fields[2]));
            repo.save(s);
        }
    }




}
