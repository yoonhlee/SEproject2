package com.example.demo.domain.wizard.dto

import com.example.demo.domain.place.model.WizardTag
import jakarta.validation.constraints.NotNull

// 질문 조회 응답 DTO
data class WizardQuestionDto(
    val questionId: Long,
    val step: Int,
    val questionText: String,
    val answers: List<WizardAnswerDto>
)

// 답변 정보 DTO
data class WizardAnswerDto(
    val answerId: Long,
    val answerText: String,
    val matchingTag: String
)

// [수정] 추천 요청 DTO: ID 리스트 대신 태그 리스트를 받음
data class WizardRecommendRequest(
    @field:NotNull
    val tags: List<WizardTag>, // "SMALL", "ENERGY_HIGH" 등의 Enum 값 직접 수신

    // 사용자 위치
    val userLatitude: Double? = null,
    val userLongitude: Double? = null
)