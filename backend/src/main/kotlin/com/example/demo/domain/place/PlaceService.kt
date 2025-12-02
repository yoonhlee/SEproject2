package com.example.demo.domain.place

import com.example.demo.domain.place.dto.PlaceCreateRequest
import com.example.demo.domain.place.dto.PlaceDtoResponse
import com.example.demo.domain.place.dto.PlaceUpdateRequest
import com.example.demo.domain.place.dto.PlaceFilterRequest 
import com.example.demo.domain.place.model.LocationType
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PlaceService(
    private val placeRepository: PlaceRepository
) {

    // 장소 등록
    @Transactional
    fun createPlace(request: PlaceCreateRequest): PlaceDtoResponse {
        val place = Place(
            name = request.name,
            address = request.address,
            phone = request.phone,
            operationHours = request.operationHours,
            petPolicy = request.petPolicy,

            category = request.category,
            locationType = request.locationType,
            hasParking = request.hasParking,
            isOffLeash = request.isOffLeash,
            hasWifi = request.hasWifi, // [추가]

            latitude = request.latitude,
            longitude = request.longitude
        ).apply {
            this.allowedSizes.addAll(request.allowedSizes)
            this.photos.addAll(request.photos)
        }

        val savedPlace = placeRepository.save(place)
        return PlaceDtoResponse.from(savedPlace)
    }

    // 장소 수정
    @Transactional
    fun updatePlace(placeId: Long, request: PlaceUpdateRequest): PlaceDtoResponse {
        val place = placeRepository.findByIdOrNull(placeId)
            ?: throw IllegalArgumentException("존재하지 않는 장소입니다.")

        place.updateInfo(
            name = request.name,
            address = request.address,
            phone = request.phone,
            operationHours = request.operationHours,
            petPolicy = request.petPolicy,

            category = request.category,
            locationType = request.locationType,
            hasParking = request.hasParking,
            isOffLeash = request.isOffLeash,
            hasWifi = request.hasWifi, // [추가]
            allowedSizes = request.allowedSizes,

            latitude = request.latitude,
            longitude = request.longitude,
            newPhotos = request.photos
        )

        return PlaceDtoResponse.from(place)
    }

    // 장소 삭제
    @Transactional
    fun deletePlace(placeId: Long) {
        val place = placeRepository.findByIdOrNull(placeId)
            ?: throw IllegalArgumentException("존재하지 않는 장소입니다.")
        
        placeRepository.delete(place)
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

    // 장소 검색
    @Transactional(readOnly = true)
    fun searchPlaces(keyword: String): List<PlaceDtoResponse> {
        val places = placeRepository.findByNameContainingIgnoreCase(keyword)
            .ifEmpty { placeRepository.findByAddressContainingIgnoreCase(keyword) }

        return places.map { PlaceDtoResponse.from(it) }
    }

    @Transactional(readOnly = true)
    fun searchByFilter(request: PlaceFilterRequest): List<PlaceDtoResponse> {
        val allPlaces = placeRepository.findAll()

        val filtered = allPlaces.filter { place ->
            // 1. 카테고리 필터 (카페, 음식점, 물놀이, 운동장, 미용 등)
            // 요청된 카테고리 목록에 내 카테고리가 포함되어 있는지 확인
            val matchCategory = if (request.categories.isNullOrEmpty()) true
            else request.categories.contains(place.category)

            // 2. 견종 크기 필터
            val matchSize = if (request.dogSizes.isNullOrEmpty()) true
            else place.allowedSizes.any { it in request.dogSizes }

            // 3. 주차 여부 (체크된 경우만 검사 -> hasParking이 true여야 함)
            val matchParking = if (request.hasParking == true) place.hasParking else true
            
            // 4. 와이파이 여부 (체크된 경우만 검사 -> hasWifi가 true여야 함)
            val matchWifi = if (request.hasWifi == true) place.hasWifi else true

            // 5. 야외 여부 (체크된 경우 -> OUTDOOR 또는 BOTH 여야 함)
            val matchOutdoor = if (request.isOutdoor == true) {
                place.locationType == LocationType.OUTDOOR || place.locationType == LocationType.BOTH
            } else true

            matchCategory && matchSize && matchParking && matchWifi && matchOutdoor
        }

        return filtered.map { PlaceDtoResponse.from(it) }
    }
}