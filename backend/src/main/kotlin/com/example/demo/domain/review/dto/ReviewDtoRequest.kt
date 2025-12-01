package com.example.demo.domain.review.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ReviewCreateRequest(
    @field:NotBlank(message = "20자 이상의 리뷰를 작성해 주십시오.")
    @field:Size(min = 1, max = 1000, message = "1자 이상 1000자 내로 작성해 주십시오.")
    val content: String,

    @field:Min(1) @field:Max(5)
    val rating: Int,

    val photos: List<String> = emptyList()

    // (참고: userId, placeId는 보통 DTO가 아니라 URL 경로(@PathVariable)나 토큰에서 받으므로 제외하는 게 더 깔끔합니다)
)

data class ReviewUpdateRequest(
    @field:NotBlank(message = "내용을 입력해주세요.")
    @field:Size(min = 1, max = 1000, message = "1자 이상 1000자 내로 작성해 주십시오.")
    val content: String,

    @field:Min(1) @field:Max(5)
    val rating: Int,

    val photos: List<String> = emptyList()
)