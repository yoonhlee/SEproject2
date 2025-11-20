package com.example.demo.domain.map

import org.springframework.stereotype.Service

/**
 * 사용자 현재 위치를 관리하는 서비스
 * 실제 GPS는 프론트/앱에서 처리하고,
 * 백엔드는 값만 받아 저장/조회한다고 가정.
 */
@Service
class LocationService {

    // 임시 기본값 (학교 좌표 등으로 세팅해도 됨)
    private var currentLocation: Location = Location(
        latitude = 35.0,
        longitude = 128.0
    )

    /** 현재 위치 1회 조회 */
    fun getCurrentLocation(): Location = currentLocation

    /** 프론트에서 보낸 GPS 값 저장용 */
    fun updateLocation(newLocation: Location) {
        currentLocation = newLocation
    }
}
