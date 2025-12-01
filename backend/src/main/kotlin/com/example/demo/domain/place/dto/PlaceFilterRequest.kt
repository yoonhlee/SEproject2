package com.example.demo.domain.place.dto

import com.example.demo.domain.place.model.DogSize
import com.example.demo.domain.place.model.PlaceCategory

data class PlaceFilterRequest(
    val categories: List<PlaceCategory>? = null, // 장소 유형
    val dogSizes: List<DogSize>? = null,         // 견종 크기
    val hasParking: Boolean? = null,             // 주차 가능 여부
    val isOutdoor: Boolean? = null               // 야외 여부 (true면 OUTDOOR 또는 BOTH)
)