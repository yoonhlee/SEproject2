package com.example.demo.domain.wizard

import com.example.demo.domain.wizard.WizardAnswer
import org.springframework.data.jpa.repository.JpaRepository

// 답변 조회용 리포지토리
interface WizardAnswerRepository : JpaRepository<WizardAnswer, Long>
