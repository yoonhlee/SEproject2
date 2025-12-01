package com.example.demo.domain.place.dto

import com.example.demo.domain.place.Place
import com.example.demo.domain.place.model.DogSize
import com.example.demo.domain.place.model.LocationType
import com.example.demo.domain.place.model.PlaceCategory

data class PlaceDtoResponse(
    val placeId: Long,
    val name: String,
    val address: String,
    val phone: String?,
    val operationHours: String?,
    val petPolicy: String,

    val category: PlaceCategory,
    val locationType: LocationType,
    val allowedSizes: Set<DogSize>,
    val hasParking: Boolean,
    val isOffLeash: Boolean,
    val hasWifi: Boolean, // [추가]

    val avgRating: Double,
    val reviewCount: Int,
    val latitude: Double?,
    val longitude: Double?,
    val photos: List<String>
) {
    companion object {
        fun from(place: Place): PlaceDtoResponse {
            return PlaceDtoResponse(
                placeId = place.placeId,
                name = place.name,
                address = place.address,
                phone = place.phone,
                operationHours = place.operationHours,
                petPolicy = place.petPolicy,

                category = place.category,
                locationType = place.locationType,
                allowedSizes = place.allowedSizes,
                hasParking = place.hasParking,
                isOffLeash = place.isOffLeash,
                hasWifi = place.hasWifi, // [추가]

                avgRating = place.avgRating,
                reviewCount = place.reviewCount,
                latitude = place.latitude,
                longitude = place.longitude,
                photos = place.photos
            )
        }
    }
}