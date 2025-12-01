package com.example.demo.domain.place.model

// 장소 카테고리
enum class PlaceCategory(val description: String) {
    CAFE("카페"),
    RESTAURANT("음식점"),
    PLAYGROUND("운동장"), // 운동
    SWIMMING("물놀이"),   // 물놀이
    ACCOMMODATION("숙소"),
    PARK("공원"),
    BEAUTY("미용")      // [추가] 미용
}

// (나머지 DogSize, LocationType, WizardTag 등은 그대로 유지)
enum class DogSize(val description: String) {
    SMALL("소형견"),
    MEDIUM("중형견"),
    LARGE("대형견")
}

enum class LocationType(val description: String) {
    INDOOR("실내"),
    OUTDOOR("야외"),
    BOTH("실내+야외")
}

enum class WizardTag {
    SMALL, MEDIUM, LARGE,
    ENERGY_HIGH, ENERGY_LOW,
    DIST_NEAR, DIST_MID, DIST_FAR,
    TYPE_NATURE, TYPE_CITY, TYPE_PRIVATE
}