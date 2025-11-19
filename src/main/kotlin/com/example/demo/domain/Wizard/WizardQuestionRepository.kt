package com.example.demo.domain.wizard.repository

import com.example.demo.domain.wizard.WizardQuestion
import org.springframework.data.jpa.repository.JpaRepository

interface WizardQuestionRepository : JpaRepository<WizardQuestion, Long> {
    fun findAllByOrderByStepAsc(): List<WizardQuestion>
}
