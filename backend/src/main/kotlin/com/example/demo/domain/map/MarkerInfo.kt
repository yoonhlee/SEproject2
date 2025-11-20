package com.example.demo.domain.map

/**
 * 지도에 마커로 표시할 최소 정보
 * (장소 전체 엔티티 대신 이 DTO만 프론트에 전달)
 */
data class MarkerInfo(
    val placeId: Long,
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val distance: Double?,        // 사용자로부터 거리 (m 단위)
    val rating: Double?,          // 평균 평점
    val shortDescription: String? // 한 줄 설명
)
