package com.relead.schoolManagement.service;
import com.relead.schoolManagement.entity.Level;
import com.relead.schoolManagement.entity.Student;
import com.relead.schoolManagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentServiceTest {

    @Mock
    private StudentRepository repo;

    @InjectMocks
    private StudentService studentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllStudents() {
        List<Student> students = List.of(new Student(1L, "Alice", Level.PRIMARY));
        when(repo.findAll()).thenReturn(students);

        List<Student> result = studentService.getAllStudents();

        assertEquals(1, result.size());
        assertEquals("Alice", result.get(0).getUsername());
    }

    @Test
    void testGetStudentByIdNotFound() {
        Optional<Student> studentOpt = Optional.of(new Student());
        // ou Optional.empty()
        when(repo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                studentService.getStudentById(1L));
        assertEquals("Student not found", exception.getMessage());
    }

    @Test
    void testGetStudentsPage() {
        List<Student> students = List.of(new Student(1L, "Alice", Level.PRIMARY));
        Page<Student> page = new PageImpl<>(students);

        when(repo.findAll(PageRequest.of(0, 10))).thenReturn(page);

        Page<Student> result = studentService.getStudentsPage(0, 10);

        assertEquals(1, result.getContent().size());
        assertEquals("Alice", result.getContent().get(0).getUsername());
    }
}
