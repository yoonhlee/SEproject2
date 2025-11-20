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
    private val userRepository: UserRepository, // 작성자 확인용
    private val placeRepository: PlaceRepository // 장소 확인용
) {

    // 리뷰 등록
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

    // 리뷰 수정
    @Transactional
    fun updateReview(userId: Long, reviewId: Long, request: ReviewUpdateRequest): ReviewDtoResponse {
        val review = reviewRepository.findByIdOrNull(reviewId)
            ?: throw IllegalArgumentException("존재하지 않는 리뷰입니다.")

        // 본인 확인
        if (review.user.userId != userId) {
            throw IllegalArgumentException("수정 권한이 없습니다.")
        }

        review.updateInfo(request.content, request.rating, request.photos)

        updatePlaceAvgRating(review.place.placeId)
        return ReviewDtoResponse.from(review)
    }

    // 리뷰 삭제
    @Transactional
    fun deleteReview(userId: Long, reviewId: Long) {
        val review = reviewRepository.findByIdOrNull(reviewId)
            ?: throw IllegalArgumentException("존재하지 않는 리뷰입니다.")

        if (review.user.userId != userId) {
            throw IllegalArgumentException("삭제 권한이 없습니다.")
        }

        // 삭제하기 전에 이 리뷰가 속한 장소의 ID를 추출하여 변수에 저장
        // review.place는 Review 엔티티에 정의된 Place 엔티티 객체
        val placeIdToUpdate = review.place.placeId

        reviewRepository.delete(review)
        updatePlaceAvgRating(placeIdToUpdate)
    }

    // (내부 메서드) 장소의 평균 평점을 다시 계산해서 저장하는 함수
    private fun updatePlaceAvgRating(placeId: Long) {
        // 해당 장소의 모든 리뷰를 가져옴
        val reviews = reviewRepository.findAllByPlace_PlaceIdOrderByCreatedAtDesc(placeId)

        // 평균 계산 (리뷰가 없으면 0.0)
        val avgRating = if (reviews.isEmpty()) {
            0.0
        } else {
            // 모든 리뷰의 rating 합계 / 리뷰 개수
            reviews.map { it.rating }.average()
        }

        // 소수점 첫째 자리까지만 반올림
        val roundedAvgRating = Math.round(avgRating * 10) / 10.0

        // 장소 엔티티 찾아서 업데이트
        val place = placeRepository.findByIdOrNull(placeId)
            ?: return // 장소가 없으면 무시

        place.updateAvgRating(roundedAvgRating)
        placeRepository.save(place)
    }

    // 특정 장소의 리뷰 목록 조회
    @Transactional(readOnly = true)
    fun getReviewsByPlace(placeId: Long): List<ReviewDtoResponse> {
        return reviewRepository.findAllByPlace_PlaceIdOrderByCreatedAtDesc(placeId)
            .map { ReviewDtoResponse.from(it) }
    }
}