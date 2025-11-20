package com.example.demo.domain.wizard.dto

// 사용자가 선택한 답변 ID들을 서버에 넘길 때 사용하는 DTO
data class WizardRecommendRequest(
    val selectedAnswerIds: List<Long>
)
