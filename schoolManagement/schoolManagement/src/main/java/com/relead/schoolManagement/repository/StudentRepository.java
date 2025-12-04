package com.relead.schoolManagement.repository;

import com.relead.schoolManagement.entity.Level;
import com.relead.schoolManagement.entity.Student;
import org.springframework.boot.autoconfigure.flyway.FlywayProperties;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByUsernameContainingIgnoreCase(String username);
    Student findById(long id);
    List<Student> findByLevel(Level level);
    @Query("SELECT s FROM Student s WHERE LOWER(s.username) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchStudents(@Param("keyword") String keyword);
}


