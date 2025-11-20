package com.example.demo.domain.place

import com.example.demo.domain.place.dto.PlaceCreateRequest
import com.example.demo.domain.place.dto.PlaceDtoResponse
import com.example.demo.domain.place.dto.PlaceUpdateRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PlaceService(
    private val placeRepository: PlaceRepository
) {

    // 장소 등록 (관리자용)
    @Transactional
    fun createPlace(request: PlaceCreateRequest): PlaceDtoResponse {
        val place = Place(
            name = request.name,
            address = request.address,
            phone = request.phone,
            operationHours = request.operationHours,
            petPolicy = request.petPolicy,
            latitude = request.latitude,
            longitude = request.longitude
        ).apply {
            this.photos.addAll(request.photos)
        }

        val savedPlace = placeRepository.save(place)
        return PlaceDtoResponse.from(savedPlace)
    }

    @Transactional
    fun updatePlace(placeId: Long, request: PlaceUpdateRequest): PlaceDtoResponse {
        // 수정할 장소 조회
        val place = placeRepository.findByIdOrNull(placeId)
            ?: throw IllegalArgumentException("존재하지 않는 장소입니다.")

        // 데이터 수정 (Dirty Checking에 의해 트랜잭션 종료 시 DB 반영)
        place.updateInfo(
            name = request.name,
            address = request.address,
            phone = request.phone,
            operationHours = request.operationHours,
            petPolicy = request.petPolicy,
            latitude = request.latitude,
            longitude = request.longitude,
            newPhotos = request.photos
        )

        return PlaceDtoResponse.from(place)
    }

    // 전체 장소 조회
    @Transactional(readOnly = true)
    fun getAllPlaces(): List<PlaceDtoResponse> {
        return placeRepository.findAll().map { PlaceDtoResponse.from(it) }
    }

    // 특정 장소 상세 조회
    @Transactional(readOnly = true)
    fun getPlaceById(placeId: Long): PlaceDtoResponse {
        val place = placeRepository.findByIdOrNull(placeId)
            ?: throw IllegalArgumentException("존재하지 않는 장소입니다.")
        return PlaceDtoResponse.from(place)
    }

    // 장소 검색 (이름 또는 주소)
    @Transactional(readOnly = true)
    fun searchPlaces(keyword: String): List<PlaceDtoResponse> {
        // 이름이나 주소에 키워드가 포함된 장소 검색
        val places = placeRepository.findByNameContainingIgnoreCase(keyword)
            .ifEmpty { placeRepository.findByAddressContainingIgnoreCase(keyword) }

        return places.map { PlaceDtoResponse.from(it) }
    }
}