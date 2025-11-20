package com.example.demo.domain.review

import com.example.demo.domain.review.dto.ReviewCreateRequest
import com.example.demo.domain.review.dto.ReviewDtoResponse
import com.example.demo.domain.review.dto.ReviewUpdateRequest
import com.example.demo.domain.user.dto.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class ReviewController(
    private val reviewService: ReviewService
) {

    // 리뷰 등록 (POST /api/places/{placeId}/reviews) (로그인한 유저 ID는 일단 파라미터로 받음)
    @PostMapping("/places/{placeId}/reviews")
    fun createReview(
        @PathVariable placeId: Long,
        @RequestParam userId: Long, // (보안상 나중엔 토큰에서 추출해야 함)
        @Valid @RequestBody request: ReviewCreateRequest
    ): ResponseEntity<ApiResponse<ReviewDtoResponse>> {
        val response = reviewService.createReview(userId, placeId, request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse(success = true, message = "리뷰가 등록되었습니다.", data = response))
    }

    // 리뷰 수정 (PUT /api/reviews/{reviewId})
    @PutMapping("/reviews/{reviewId}")
    fun updateReview(
        @PathVariable reviewId: Long,
        @RequestParam userId: Long,
        @Valid @RequestBody request: ReviewUpdateRequest
    ): ResponseEntity<ApiResponse<ReviewDtoResponse>> {
        val response = reviewService.updateReview(userId, reviewId, request)
        return ResponseEntity.ok(ApiResponse(success = true, message = "리뷰가 수정되었습니다.", data = response))
    }

    // 리뷰 삭제 (DELETE /api/reviews/{reviewId})
    @DeleteMapping("/reviews/{reviewId}")
    fun deleteReview(
        @PathVariable reviewId: Long,
        @RequestParam userId: Long
    ): ResponseEntity<ApiResponse<Unit>> {
        reviewService.deleteReview(userId, reviewId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "리뷰가 삭제되었습니다."))
    }

    // 특정 장소의 리뷰 목록 조회 (GET /api/places/{placeId}/reviews)
    @GetMapping("/places/{placeId}/reviews")
    fun getReviewsByPlace(
        @PathVariable placeId: Long
    ): ResponseEntity<ApiResponse<List<ReviewDtoResponse>>> {
        val reviews = reviewService.getReviewsByPlace(placeId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "", data = reviews))
    }
}