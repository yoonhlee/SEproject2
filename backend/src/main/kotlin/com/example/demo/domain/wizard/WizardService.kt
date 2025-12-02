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
        val selectedTags = request.tags.toSet()
        val allPlaces = placeRepository.findAll()

        val filteredPlaces = allPlaces.map { place ->
            val dist = if (request.userLatitude != null && request.userLongitude != null) {
                DistanceCalculator.calculate(
                    request.userLatitude, request.userLongitude,
                    place.latitude ?: 0.0, place.longitude ?: 0.0
                )
            } else 0.0
            Pair(place, dist)
        }.filter { (place, _) ->
            isPlaceMatchedWithTags(place, selectedTags)
        }

        val sortedList = when (sort) {
            "rating" -> filteredPlaces.sortedByDescending { it.first.avgRating }
            "popular" -> filteredPlaces.sortedByDescending { it.first.reviewCount }
            else -> filteredPlaces.sortedBy { it.second }
        }

        return sortedList.take(3).map { (place, _) -> PlaceDtoResponse.from(place) }
    }

    private fun isPlaceMatchedWithTags(place: Place, tags: Set<WizardTag>): Boolean {
        // Q1. 크기 (필수 교집합)
        if (tags.contains(WizardTag.SMALL) && !place.allowedSizes.contains(DogSize.SMALL)) return false
        if (tags.contains(WizardTag.MEDIUM) && !place.allowedSizes.contains(DogSize.MEDIUM)) return false
        if (tags.contains(WizardTag.LARGE) && !place.allowedSizes.contains(DogSize.LARGE)) return false

        // Q2. 컨디션 (활발함 vs 조용함)
        if (tags.contains(WizardTag.ENERGY_HIGH)) {
            // 활발함 -> 오프리쉬 가능(isOffLeash=true)하거나 야외(OUTDOOR)여야 함
            val isHighEnergy = place.isOffLeash || 
                               place.locationType == LocationType.OUTDOOR || 
                               place.category == PlaceCategory.PLAYGROUND ||
                               place.category == PlaceCategory.PARK ||
                               place.category == PlaceCategory.SWIMMING
            if (!isHighEnergy) return false
        }
        if (tags.contains(WizardTag.ENERGY_LOW)) {
            // 조용함 -> 실내(INDOOR)거나 카페/숙소 등 정적인 곳
            val isLowEnergy = place.locationType == LocationType.INDOOR || 
                              place.category == PlaceCategory.CAFE ||
                              place.category == PlaceCategory.RESTAURANT ||
                              place.category == PlaceCategory.ACCOMMODATION
            if (!isLowEnergy) return false
        }

        // Q3. 장소 취향 (자연 vs 도시 vs 프라이빗)
        if (tags.contains(WizardTag.TYPE_NATURE)) {
            // 자연친화적 -> 야외(OUTDOOR)거나 공원
            val isNature = place.locationType == LocationType.OUTDOOR || 
                           place.locationType == LocationType.BOTH ||
                           place.category == PlaceCategory.PARK
            if (!isNature) return false
        }
        if (tags.contains(WizardTag.TYPE_CITY)) {
            // 도시적 -> 실내(INDOOR)거나 카페/음식점/미용/와이파이 있음
            val isCity = place.locationType == LocationType.INDOOR ||
                         place.category == PlaceCategory.CAFE ||
                         place.category == PlaceCategory.RESTAURANT ||
                         place.category == PlaceCategory.BEAUTY ||
                         place.hasWifi // 도시적인 곳은 와이파이가 보통 있음
            if (!isCity) return false
        }
        if (tags.contains(WizardTag.TYPE_PRIVATE)) {
            // 프라이빗 -> 숙소(ACCOMMODATION) 또는 오프리쉬 가능한 곳(우리끼리 놀기)
            val isPrivate = place.category == PlaceCategory.ACCOMMODATION || place.isOffLeash
            if (!isPrivate) return false
        }

        return true
    }
}