package com.example.demo.domain.map

/**
 * 지도에서 장소 정렬 기준
 */
enum class MapSortType {
    DISTANCE,   // 거리순
    RATING,     // 평점순
    POPULARITY  // 인기순(리뷰 수 기준으로 사용)
}
