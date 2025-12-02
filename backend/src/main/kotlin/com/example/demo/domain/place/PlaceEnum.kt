package com.example.demo.domain.place.model

enum class PlaceCategory(val description: String) {
    CAFE("카페"),
    RESTAURANT("음식점"),
    PLAYGROUND("운동장"),
    SWIMMING("물놀이"), // 필터의 '물놀이'와 매핑
    ACCOMMODATION("숙소"),
    PARK("공원"),
    BEAUTY("미용")      // [추가] 필터의 '미용'과 매핑
}

enum class DogSize(val description: String) {
    SMALL("소형견"),
    MEDIUM("중형견"),
    LARGE("대형견")
}

enum class LocationType(val description: String) {
    INDOOR("실내"),
    OUTDOOR("야외"), // 필터의 '야외'와 매핑
    BOTH("실내+야외")
}

enum class WizardTag {
    SMALL, MEDIUM, LARGE,
    ENERGY_HIGH, ENERGY_LOW,
    TYPE_NATURE, TYPE_CITY, TYPE_PRIVATE
}