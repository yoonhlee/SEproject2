package com.example.demo.domain.review

import com.example.demo.domain.place.PlaceRepository
import com.example.demo.domain.review.dto.ReviewCreateRequest
import com.example.demo.domain.review.dto.ReviewDtoResponse
import com.example.demo.domain.review.dto.ReviewUpdateRequest
import com.example.demo.domain.user.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val userRepository: UserRepository,
    private val placeRepository: PlaceRepository
) {

    // ... (기존 create, update, delete, updatePlaceAvgRating 함수 유지) ...
    @Transactional
    fun createReview(userId: Long, placeId: Long, request: ReviewCreateRequest): ReviewDtoResponse {
        val user = userRepository.findByIdOrNull(userId)
            ?: throw IllegalArgumentException("존재하지 않는 사용자입니다.")

        val place = placeRepository.findByIdOrNull(placeId)
            ?: throw IllegalArgumentException("존재하지 않는 장소입니다.")

        val review = Review(
            content = request.content,
            rating = request.rating,
            user = user,
            place = place
        ).apply {
            this.photos.addAll(request.photos)
        }

        val savedReview = reviewRepository.save(review)

        updatePlaceAvgRating(placeId)
        return ReviewDtoResponse.from(savedReview)
    }

    @Transactional
    fun updateReview(userId: Long, reviewId: Long, request: ReviewUpdateRequest): ReviewDtoResponse {
        val review = reviewRepository.findByIdOrNull(reviewId)
            ?: throw IllegalArgumentException("존재하지 않는 리뷰입니다.")

        if (review.user.userId != userId) {
            throw IllegalArgumentException("수정 권한이 없습니다.")
        }

        review.updateInfo(request.content, request.rating, request.photos)

        updatePlaceAvgRating(review.place.placeId)
        return ReviewDtoResponse.from(review)
    }

    @Transactional
    fun deleteReview(userId: Long, reviewId: Long) {
        val review = reviewRepository.findByIdOrNull(reviewId)
            ?: throw IllegalArgumentException("존재하지 않는 리뷰입니다.")

        if (review.user.userId != userId) {
            throw IllegalArgumentException("삭제 권한이 없습니다.")
        }

        val placeIdToUpdate = review.place.placeId

        reviewRepository.delete(review)
        updatePlaceAvgRating(placeIdToUpdate)
    }

    private fun updatePlaceAvgRating(placeId: Long) {
        val reviews = reviewRepository.findAllByPlace_PlaceIdOrderByCreatedAtDesc(placeId)
        val reviewCount = reviews.size
        val avgRating = if (reviews.isEmpty()) 0.0 else reviews.map { it.rating }.average()
        val roundedAvgRating = Math.round(avgRating * 10) / 10.0

        val place = placeRepository.findByIdOrNull(placeId) ?: return
        place.updateRatingInfo(roundedAvgRating, reviewCount)
        placeRepository.save(place)
    }

    // 특정 장소의 리뷰 목록 조회
    @Transactional(readOnly = true)
    fun getReviewsByPlace(placeId: Long): List<ReviewDtoResponse> {
        return reviewRepository.findAllByPlace_PlaceIdOrderByCreatedAtDesc(placeId)
            .map { ReviewDtoResponse.from(it) }
    }

    // [추가] 특정 유저가 쓴 리뷰 목록 조회
    @Transactional(readOnly = true)
    fun getReviewsByUserId(userId: Long): List<ReviewDtoResponse> {
        return reviewRepository.findAllByUser_UserIdOrderByCreatedAtDesc(userId)
            .map { ReviewDtoResponse.from(it) }
    }
}