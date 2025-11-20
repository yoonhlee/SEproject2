package com.example.demo.domain.place.dto

data class PlaceCreateRequest(
    val name: String,
    val address: String,
    val phone: String? = null,
    val operationHours: String? = null,
    val petPolicy: String,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val photos: List<String> = emptyList()
)

data class PlaceUpdateRequest(
    val name: String,
    val address: String,
    val phone: String? = null,
    val operationHours: String? = null,
    val petPolicy: String,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val photos: List<String> = emptyList()
)