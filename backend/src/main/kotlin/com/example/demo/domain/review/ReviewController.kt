package com.example.demo.domain.review

import com.example.demo.domain.review.dto.ReviewCreateRequest
import com.example.demo.domain.review.dto.ReviewDtoResponse
import com.example.demo.domain.review.dto.ReviewUpdateRequest
import com.example.demo.domain.user.dto.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class ReviewController(
    private val reviewService: ReviewService
) {
    // ... (기존 create, update, delete, getReviewsByPlace 함수 유지) ...
    @PostMapping("/places/{placeId}/reviews")
    fun createReview(
        @PathVariable placeId: Long,
        @AuthenticationPrincipal userId: Long,
        @Valid @RequestBody request: ReviewCreateRequest
    ): ResponseEntity<ApiResponse<ReviewDtoResponse>> {
        val response = reviewService.createReview(userId, placeId, request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse(success = true, message = "리뷰가 등록되었습니다.", data = response))
    }

    @PutMapping("/reviews/{reviewId}")
    fun updateReview(
        @PathVariable reviewId: Long,
        @AuthenticationPrincipal userId: Long,
        @Valid @RequestBody request: ReviewUpdateRequest
    ): ResponseEntity<ApiResponse<ReviewDtoResponse>> {
        val response = reviewService.updateReview(userId, reviewId, request)
        return ResponseEntity.ok(ApiResponse(success = true, message = "리뷰가 수정되었습니다.", data = response))
    }

    @DeleteMapping("/reviews/{reviewId}")
    fun deleteReview(
        @PathVariable reviewId: Long,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<ApiResponse<Unit>> {
        reviewService.deleteReview(userId, reviewId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "리뷰가 삭제되었습니다."))
    }

    @GetMapping("/places/{placeId}/reviews")
    fun getReviewsByPlace(
        @PathVariable placeId: Long
    ): ResponseEntity<ApiResponse<List<ReviewDtoResponse>>> {
        val reviews = reviewService.getReviewsByPlace(placeId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "", data = reviews))
    }

    // [추가] 내 리뷰 조회 API (GET /api/users/{userId}/reviews)
    @GetMapping("/users/{userId}/reviews")
    fun getReviewsByUserId(
        @PathVariable userId: Long
    ): ResponseEntity<ApiResponse<List<ReviewDtoResponse>>> {
        val reviews = reviewService.getReviewsByUserId(userId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "내 리뷰 조회 성공", data = reviews))
    }
}