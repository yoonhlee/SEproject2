package com.example.demo.domain.wizard

// 마법사 답변에서 사용하는 태그(추천 조건)
enum class WizardTag {
    // Q1. 강아지 크기
    SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE,

    // Q2. 컨디션
    ENERGY_HIGH, ENERGY_LOW,

    // Q3. 이동 거리
    DIST_NEAR, DIST_MID, DIST_FAR,

    // Q4. 장소 유형
    TYPE_NATURE, TYPE_CITY, TYPE_PRIVATE
}
