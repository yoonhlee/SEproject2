package com.example.demo.api.map

import com.example.demo.domain.map.Area
import com.example.demo.domain.map.Location
import com.example.demo.domain.map.LocationService
import com.example.demo.domain.map.MapService
import com.example.demo.domain.map.MapSortType
import org.springframework.web.bind.annotation.*

/**
 * 지도 관련 HTTP API 진입점
 */
@RestController
@RequestMapping("/api/map")
class MapController(
    private val mapService: MapService,
    private val locationService: LocationService
) {

    /**
     * 내 위치 가져오기 (SRS: 나의 위치로 이동)
     */
    @GetMapping("/location")
    fun getMyLocation(): Location =
        locationService.getCurrentLocation()

    /**
     * 프론트에서 현재 위치를 업데이트할 때 호출
     * (앱/웹에서 GPS 값 전달)
     */
    @PostMapping("/location")
    fun updateMyLocation(@RequestBody location: Location) {
        locationService.updateLocation(location)
    }

    /**
     * 지도 영역 내 장소 검색 + 정렬
     * sort 파라미터: DISTANCE / RATING / POPULARITY
     */
    @PostMapping("/search")
    fun searchInArea(
        @RequestBody area: Area,
        @RequestParam(defaultValue = "DISTANCE") sort: String
    ) = mapService.searchInArea(
        area = area,
        sort = MapSortType.valueOf(sort.uppercase())
    )
}
