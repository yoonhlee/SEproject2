package com.example.demo.domain.wizard.dto

// API 응답용: 질문과 그 질문의 답변 목록을 함께 전달하는 DTO
data class WizardQuestionDto(
    val questionId: Long,
    val step: Int,
    val questionText: String,
    val answers: List<WizardAnswerDto>
)
