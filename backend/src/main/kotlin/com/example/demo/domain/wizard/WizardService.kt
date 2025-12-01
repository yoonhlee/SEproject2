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

    @Transactional(readOnly = true)
    fun getRecommendations(
        request: WizardRecommendRequest,
        sort: String = "distance"
    ): List<PlaceDtoResponse> {

        // 1. 사용자가 선택한 태그 모음
        val selectedTags = request.tags.toSet()

        // 2. 전체 장소 조회
        val allPlaces = placeRepository.findAll()

        // 3. 필터링 (교집합 찾기)
        val filteredPlaces = allPlaces.map { place ->
            // 거리 계산 (위치 정보가 있을 때만)
            val dist = if (request.userLatitude != null && request.userLongitude != null) {
                DistanceCalculator.calculate(
                    request.userLatitude, request.userLongitude,
                    place.latitude ?: 0.0, place.longitude ?: 0.0
                )
            } else {
                0.0 // 위치 정보 없으면 거리 0 취급
            }
            Pair(place, dist)
        }.filter { (place, _) ->
            // [핵심] 매칭 로직 호출
            isPlaceMatchedWithTags(place, selectedTags)
        }

        // 4. 정렬 (기본: 거리순, 옵션: 평점순/리뷰순)
        val sortedList = when (sort) {
            "rating" -> filteredPlaces.sortedByDescending { it.first.avgRating }
            "popular" -> filteredPlaces.sortedByDescending { it.first.reviewCount }
            else -> filteredPlaces.sortedBy { it.second } // 거리순 (가까운 순)
        }

        // 5. 상위 3개 추천
        return sortedList.take(3).map { (place, _) ->
            PlaceDtoResponse.from(place)
        }
    }

    /**
     * 장소가 사용자의 선택 태그와 맞는지 검사하는 함수 (교집합 로직)
     */
    private fun isPlaceMatchedWithTags(place: Place, tags: Set<WizardTag>): Boolean {

        // Q1. 크기 매칭 (필수: 장소가 해당 크기를 허용해야 함)
        if (tags.contains(WizardTag.SMALL) && !place.allowedSizes.contains(DogSize.SMALL)) return false
        if (tags.contains(WizardTag.MEDIUM) && !place.allowedSizes.contains(DogSize.MEDIUM)) return false
        if (tags.contains(WizardTag.LARGE) && !place.allowedSizes.contains(DogSize.LARGE)) return false

        // Q2. 컨디션 매칭 (활동량)
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

        // Q3. 장소 취향 매칭
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
            // 프라이빗 -> 숙소 (또는 나중에 Private룸 속성이 생기면 추가)
            val isPrivate = place.category == PlaceCategory.ACCOMMODATION
            if (!isPrivate) return false
        }

        return true // 모든 조건을 통과하면 true
    }
}