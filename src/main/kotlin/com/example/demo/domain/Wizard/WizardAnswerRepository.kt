package com.example.demo.domain.wizard.repository

import com.example.demo.domain.wizard.WizardAnswer
import org.springframework.data.jpa.repository.JpaRepository

interface WizardAnswerRepository : JpaRepository<WizardAnswer, Long>
