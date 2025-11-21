package com.example.demo.api

import com.example.demo.domain.map.Location
import com.example.demo.domain.map.LocationService
import com.example.demo.domain.map.MapService
import com.example.demo.domain.map.dto.MapSearchCondition
import com.example.demo.domain.map.dto.MapSearchResponse
import com.example.demo.domain.user.dto.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * 지도 관련 HTTP API 엔드포인트
 */
@RestController
@RequestMapping("/api/map")
class MapController(
    private val mapService: MapService,
    private val locationService: LocationService
) {

    /**
     * 1. 내 위치 가져오기 (GET)
     * GET /api/map/location
     */
    @GetMapping("/location")
    fun getMyLocation(): ResponseEntity<ApiResponse<Location>> {
        val location = locationService.getCurrentLocation()
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = "현재 위치 조회 성공",
                data = location
            )
        )
    }

    /**
     * 2. 내 위치 업데이트 (POST)
     * POST /api/map/location
     * 프론트에서 GPS를 주면 현재 위치를 갱신함
     */
    @PostMapping("/location")
    fun updateMyLocation(
        @RequestBody location: Location
    ): ResponseEntity<ApiResponse<Unit>> {

        locationService.updateLocation(location)

        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = "현재 위치 업데이트 성공",
                data = null
            )
        )
    }

    /**
     * 3. 지도 검색 + 정렬 (POST)
     * /api/map/search
     */
    @PostMapping("/search")
    fun searchMap(
        @Valid @RequestBody condition: MapSearchCondition
    ): ResponseEntity<ApiResponse<MapSearchResponse>> {

        val result = mapService.searchInArea(condition)

        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = "지도 검색 성공",
                data = result
            )
        )
    }
}
