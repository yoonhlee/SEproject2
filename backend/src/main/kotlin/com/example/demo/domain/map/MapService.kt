package com.example.demo.domain.map

import com.example.demo.domain.map.dto.MapSearchResponse
import com.example.demo.domain.map.mapper.PlaceMapper
import com.example.demo.domain.place.PlaceRepository
import org.springframework.stereotype.Service

/**
 * 지도 관련 비즈니스 로직 담당 
 * - 영역 내 장소 검색
 * - MarkerInfo 변환
 * - 정렬 처리
 */
@Service
class MapService(
    private val placeRepository: PlaceRepository,
    private val locationService: LocationService
) {

    /**
     * 지도 영역 내 장소들을 검색하고,
     * MarkerInfo 리스트 + 개수로 반환
     */
    fun searchInArea(
        area: Area,
        sort: MapSortType
    ): MapSearchResponse {

        val userLocation = locationService.getCurrentLocation()

        // 1) 영역 조건으로 장소 조회 (PlaceRepository 쿼리 필요)
        val places = placeRepository.findPlacesInArea(
            area.minLatitude,
            area.maxLatitude,
            area.minLongitude,
            area.maxLongitude
        )

        // 2) Place -> MarkerInfo 변환 + 거리 계산
        var markers = places.map { place ->
            PlaceMapper.toMarkerInfo(place, userLocation)
        }

        // 3) 정렬 기준 적용
        markers = when (sort) {
            MapSortType.DISTANCE ->
                markers.sortedBy { it.distance ?: Double.MAX_VALUE }

            MapSortType.RATING ->
                markers.sortedByDescending { it.rating ?: 0.0 }

            MapSortType.POPULARITY ->
                markers.sortedByDescending { it.rating ?: 0.0 } // reviewCount 있으면 교체
        }

        return MapSearchResponse(
            markers = markers,
            totalCount = markers.size
        )
    }
}
