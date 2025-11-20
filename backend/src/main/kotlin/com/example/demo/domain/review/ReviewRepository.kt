package com.example.demo.domain.review

import org.springframework.data.jpa.repository.JpaRepository

interface ReviewRepository : JpaRepository<Review, Long> {

    // 특정 장소(Place)에 달린 모든 리뷰 조회 (최신순 정렬 권장)
    fun findAllByPlace_PlaceIdOrderByCreatedAtDesc(placeId: Long): List<Review>

    // 특정 유저(User)가 쓴 모든 리뷰 조회 (마이페이지용)
    fun findAllByUser_UserIdOrderByCreatedAtDesc(userId: Long): List<Review>
}