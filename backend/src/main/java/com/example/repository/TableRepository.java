package com.example.repository;

import com.example.model.CoffeeTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<CoffeeTable, Long> {
}