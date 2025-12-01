package com.example.demo.domain.place.model

enum class PlaceCategory(val description: String) {
    CAFE("카페"),
    RESTAURANT("음식점"),
    PLAYGROUND("운동장"),
    SWIMMING("물놀이"),
    ACCOMMODATION("숙소"),
    PARK("공원")
}

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

// [수정] 마법사 질문의 답변과 매핑되는 태그들
enum class WizardTag {
    // Q1. 크기
    SMALL, MEDIUM, LARGE,

    // Q2. 컨디션 (활동량)
    ENERGY_HIGH, ENERGY_LOW,

    // Q3. 장소 취향
    TYPE_NATURE, TYPE_CITY, TYPE_PRIVATE
}