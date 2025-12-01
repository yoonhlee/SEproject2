package com.example.demo.domain.wizard.service

import com.example.demo.domain.map.DistanceCalculator
import com.example.demo.domain.place.Place
import com.example.demo.domain.place.PlaceRepository
import com.example.demo.domain.place.dto.PlaceDtoResponse
import com.example.demo.domain.place.model.DogSize
import com.example.demo.domain.place.model.LocationType
import com.example.demo.domain.place.model.PlaceCategory
import com.example.demo.domain.place.model.WizardTag
import com.example.demo.domain.wizard.dto.WizardAnswerDto
import com.example.demo.domain.wizard.WizardQuestionRepository
import com.example.demo.domain.wizard.WizardAnswerRepository
import com.example.demo.domain.wizard.dto.WizardQuestionDto
import com.example.demo.domain.wizard.dto.WizardRecommendRequest

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class WizardService(
    private val questionRepository: WizardQuestionRepository,
    private val answerRepository: WizardAnswerRepository,
    private val placeRepository: PlaceRepository
) {

    @Transactional(readOnly = true)
    fun getWizardQuestions(): List<WizardQuestionDto> {
        return questionRepository.findAllByOrderByStepAsc().map { q ->
            WizardQuestionDto(
                questionId = q.questionId,
                step = q.step,
                questionText = q.questionText,
                answers = q.answers.map { a ->
                    WizardAnswerDto(
                        answerId = a.answerId,
                        answerText = a.answerText,
                        matchingTag = a.matchingTag.name
                    )
                }
            )
        }
    }

    // [수정] 태그 기반 추천 알고리즘
    @Transactional(readOnly = true)
    fun getRecommendations(
        request: WizardRecommendRequest,
        sort: String = "distance"
    ): List<PlaceDtoResponse> {

        // 1. 사용자 선택 태그 (Enum Set으로 변환)
        val selectedTags = request.tags.toSet()

        // 2. 전체 장소 조회 (데이터가 많아지면 QueryDSL 등으로 최적화 필요)
        val allPlaces = placeRepository.findAll()

        // 3. 거리 계산 및 필터링
        val filteredPlaces = allPlaces.map { place ->
            val dist = if (request.userLatitude != null && request.userLongitude != null) {
                DistanceCalculator.calculate(
                    request.userLatitude, request.userLongitude,
                    place.latitude ?: 0.0, place.longitude ?: 0.0
                )
            } else {
                Double.MAX_VALUE 
            }
            Pair(place, dist)
        }.filter { (place, _) ->
            // [핵심] 교집합 매칭 검사
            isPlaceMatchedWithTags(place, selectedTags)
        }

        // 4. 정렬
        val sortedList = when (sort) {
            "rating" -> filteredPlaces.sortedByDescending { it.first.avgRating }
            "popular" -> filteredPlaces.sortedByDescending { it.first.reviewCount }
            else -> filteredPlaces.sortedBy { it.second } // 거리순
        }

        // 5. 상위 3개 반환
        return sortedList.take(3).map { (place, _) ->
            PlaceDtoResponse.from(place)
        }
    }

    // [수정] 매칭 로직 상세 구현 (Q1, Q2, Q3 반영)
    private fun isPlaceMatchedWithTags(place: Place, tags: Set<WizardTag>): Boolean {

        // Q1. 댕댕이 크기 (필수 조건: 해당 크기를 허용하는지)
        if (tags.contains(WizardTag.SMALL) && !place.allowedSizes.contains(DogSize.SMALL)) return false
        if (tags.contains(WizardTag.MEDIUM) && !place.allowedSizes.contains(DogSize.MEDIUM)) return false
        if (tags.contains(WizardTag.LARGE) && !place.allowedSizes.contains(DogSize.LARGE)) return false

        // Q2. 컨디션 (활발 vs 조용)
        if (tags.contains(WizardTag.ENERGY_HIGH)) {
            // 활발함 -> 야외, 운동장, 공원, 물놀이 등
            val isHighEnergy = place.locationType == LocationType.OUTDOOR || 
                               place.locationType == LocationType.BOTH ||
                               place.category == PlaceCategory.PLAYGROUND ||
                               place.category == PlaceCategory.PARK ||
                               place.category == PlaceCategory.SWIMMING
            if (!isHighEnergy) return false
        }
        if (tags.contains(WizardTag.ENERGY_LOW)) {
            // 조용함 -> 실내, 카페, 음식점, 숙소
            val isLowEnergy = place.locationType == LocationType.INDOOR || 
                              place.category == PlaceCategory.CAFE ||
                              place.category == PlaceCategory.RESTAURANT ||
                              place.category == PlaceCategory.ACCOMMODATION
            if (!isLowEnergy) return false
        }

        // Q3. 장소 선호 (자연 vs 도시 vs 프라이빗)
        if (tags.contains(WizardTag.TYPE_NATURE)) {
            // 자연친화적 -> 야외, 공원, 물놀이
            val isNature = place.locationType == LocationType.OUTDOOR || 
                           place.locationType == LocationType.BOTH ||
                           place.category == PlaceCategory.PARK ||
                           place.category == PlaceCategory.SWIMMING
            if (!isNature) return false
        }
        if (tags.contains(WizardTag.TYPE_CITY)) {
            // 도시적 -> 실내, 카페, 음식점
            val isCity = place.locationType == LocationType.INDOOR ||
                         place.category == PlaceCategory.CAFE ||
                         place.category == PlaceCategory.RESTAURANT
            if (!isCity) return false
        }
        if (tags.contains(WizardTag.TYPE_PRIVATE)) {
            // 프라이빗 -> 숙소 또는 오프리쉬 가능한 곳(가정)
            // (로직을 더 엄격하게 하려면 ACCOMMODATION만 허용할 수도 있음)
            val isPrivate = place.category == PlaceCategory.ACCOMMODATION
            if (!isPrivate) return false
        }

        return true
    }
}