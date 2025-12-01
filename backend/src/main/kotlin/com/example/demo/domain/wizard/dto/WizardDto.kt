package com.example.demo.domain.wizard.dto

import com.example.demo.domain.place.model.WizardTag
import jakarta.validation.constraints.NotNull

data class WizardQuestionDto(
    val questionId: Long,
    val step: Int,
    val questionText: String,
    val answers: List<WizardAnswerDto>
)

data class WizardAnswerDto(
    val answerId: Long,
    val answerText: String,
    val matchingTag: String
)

// [수정] 추천 요청 DTO: 태그 리스트를 받음
data class WizardRecommendRequest(
    @field:NotNull
    val tags: List<WizardTag>, // 프론트에서 보낸 태그들 (예: ["SMALL", "ENERGY_HIGH"])

    val userLatitude: Double? = null,
    val userLongitude: Double? = null
)