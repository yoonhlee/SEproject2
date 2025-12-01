package com.example.demo.domain.place.dto

import com.example.demo.domain.place.model.DogSize
import com.example.demo.domain.place.model.PlaceCategory

data class PlaceFilterRequest(
    val categories: List<PlaceCategory>? = null,
    val dogSizes: List<DogSize>? = null,
    val hasParking: Boolean? = null,
    val isOutdoor: Boolean? = null,
    val hasWifi: Boolean? = null // [추가] 콤마(,) 필수!
)