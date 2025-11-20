package com.example.demo.domain.map.dto

import com.example.demo.domain.map.MarkerInfo

/**
 * 지도 영역 검색 결과 응답 DTO
 */
data class MapSearchResponse(
    val markers: List<MarkerInfo>, // 지도에 표시할 마커 목록
    val totalCount: Int            // 검색된 장소 개수
)
