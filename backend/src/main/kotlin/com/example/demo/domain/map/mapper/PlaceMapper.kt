package com.example.demo.domain.map.mapper

import com.example.demo.domain.map.DistanceCalculator
import com.example.demo.domain.map.Location
import com.example.demo.domain.map.MarkerInfo
import com.example.demo.domain.place.Place

/**
 * Place 엔티티 -> MarkerInfo DTO 로 변환하는 매퍼
 */
object PlaceMapper {

    fun toMarkerInfo(
        place: Place,
        userLocation: Location?
    ): MarkerInfo {

        // 사용자 위치가 있으면 거리 계산, 없으면 null
        val distance = userLocation?.let {
            DistanceCalculator.calculate(
                it.latitude,
                it.longitude,
                place.latitude,
                place.longitude
            )
        }

        return MarkerInfo(
            placeId = place.id,
            name = place.name,
            latitude = place.latitude,
            longitude = place.longitude,
            distance = distance,
            rating = place.avgRating,
            shortDescription = place.shortDescription
        )
    }
}
