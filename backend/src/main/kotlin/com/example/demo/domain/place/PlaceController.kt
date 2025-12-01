package com.example.demo.domain.place

import com.example.demo.domain.place.dto.PlaceCreateRequest
import com.example.demo.domain.place.dto.PlaceDtoResponse
import com.example.demo.domain.place.dto.PlaceUpdateRequest
// [중요] 필터 요청 DTO import
import com.example.demo.domain.place.dto.PlaceFilterRequest 
import com.example.demo.domain.user.dto.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/places")
class PlaceController(
    private val placeService: PlaceService
) {

    // 장소 등록
    @PostMapping
    fun createPlace(@Valid @RequestBody request: PlaceCreateRequest): ResponseEntity<ApiResponse<PlaceDtoResponse>> {
        val place = placeService.createPlace(request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse(success = true, message = "장소가 등록되었습니다.", data = place))
    }

    // 장소 수정
    @PutMapping("/{placeId}")
    fun updatePlace(
        @PathVariable placeId: Long,
        @RequestBody request: PlaceUpdateRequest
    ): ResponseEntity<ApiResponse<PlaceDtoResponse>> {
        val updatedPlace = placeService.updatePlace(placeId, request)
        return ResponseEntity.ok(ApiResponse(success = true, message = "장소 정보가 수정되었습니다.", data = updatedPlace))
    }

    // 장소 삭제
    @DeleteMapping("/{placeId}")
    fun deletePlace(@PathVariable placeId: Long): ResponseEntity<ApiResponse<Unit>> {
        placeService.deletePlace(placeId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "장소가 삭제되었습니다."))
    }

    // 전체 장소 조회
    @GetMapping
    fun getAllPlaces(): ResponseEntity<ApiResponse<List<PlaceDtoResponse>>> {
        val places = placeService.getAllPlaces()
        return ResponseEntity.ok(ApiResponse(success = true, message = "전체 장소 목록 조회 성공", data = places))
    }

    // 장소 상세 조회
    @GetMapping("/{placeId}")
    fun getPlace(@PathVariable placeId: Long): ResponseEntity<ApiResponse<PlaceDtoResponse>> {
        val place = placeService.getPlaceById(placeId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "장소 상세 조회 성공", data = place))
    }

    // 장소 검색 (키워드)
    @GetMapping("/search")
    fun searchPlaces(@RequestParam keyword: String): ResponseEntity<ApiResponse<List<PlaceDtoResponse>>> {
        val places = placeService.searchPlaces(keyword)
        return ResponseEntity.ok(ApiResponse(success = true, message = "검색 결과 조회 성공", data = places))
    }

    // [추가] 필터 검색 API
    @PostMapping("/filter")
    fun searchByFilter(@RequestBody request: PlaceFilterRequest): ResponseEntity<ApiResponse<List<PlaceDtoResponse>>> {
        val places = placeService.searchByFilter(request)
        return ResponseEntity.ok(ApiResponse(success = true, message = "필터 검색 성공", data = places))
    }
}