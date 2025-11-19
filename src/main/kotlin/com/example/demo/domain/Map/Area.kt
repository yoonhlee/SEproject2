package com.example.demo.domain.map

/**
 * 지도에서 현재 화면에 보이는 영역 범위 정보
 */
data class Area(
    val minLatitude: Double,
    val maxLatitude: Double,
    val minLongitude: Double,
    val maxLongitude: Double
)
