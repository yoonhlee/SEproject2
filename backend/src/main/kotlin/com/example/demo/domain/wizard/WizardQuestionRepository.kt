package com.example.demo.domain.wizard

import com.example.demo.domain.wizard.WizardQuestion
import org.springframework.data.jpa.repository.JpaRepository

// 질문 조회용 리포지토리
interface WizardQuestionRepository : JpaRepository<WizardQuestion, Long> {

    // step 순으로 정렬하여 모든 질문을 가져옴
    fun findAllByOrderByStepAsc(): List<WizardQuestion>
}
