package com.example.demo.domain.wizard.dto

// API 응답용: WizardAnswer 엔티티를 반환할 때 사용하는 DTO
data class WizardAnswerDto(
    val answerId: Long,
    val answerText: String,
    val matchingTag: String
)
