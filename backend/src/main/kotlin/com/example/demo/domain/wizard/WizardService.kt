package com.example.demo.domain.wizard.service

import com.example.demo.domain.place.Place
import com.example.demo.domain.place.PlaceRepository
import com.example.demo.domain.wizard.dto.*
import com.example.demo.domain.wizard.WizardAnswerRepository
import com.example.demo.domain.wizard.WizardQuestionRepository
import org.springframework.stereotype.Service

// 마법사 질문 조회 + 추천 알고리즘을 처리하는 서비스 계층
@Service
class WizardService(
    private val questionRepository: WizardQuestionRepository,
    private val answerRepository: WizardAnswerRepository,
    private val placeRepository: PlaceRepository
) {

    // 마법사 질문 전체 리스트(step 순으로) 반환
    fun getWizardQuestions(): List<WizardQuestionDto> {
        return questionRepository.findAllByOrderByStepAsc().map { q ->

            WizardQuestionDto(
                questionId = q.questionId,
                step = q.step,
                questionText = q.questionText,

                // 질문에 속한 답변들을 DTO로 변환
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

    // 선택한 답변을 기반으로 장소 추천
    fun getRecommendations(
        request: WizardRecommendRequest,
        sort: String = "distance" // 기본 정렬: 거리 기준
    ): List<Place> {

        // 사용자가 선택한 답변 ID → 답변 엔티티 조회
        val selectedAnswers = request.selectedAnswerIds.mapNotNull {
            answerRepository.findById(it).orElse(null)
        }

        // 선택된 답변에서 추천 태그 추출
        val tags = selectedAnswers.map { it.matchingTag }

        // 태그 조건에 맞는 장소 목록 검색
        var places = placeRepository.findByWizardTagsIn(tags)

        // 조건에 맞는 장소가 없으면 SRS의 실패 메시지 처리
        if (places.isEmpty()) {
            throw IllegalStateException("아쉽지만 맞는 장소를 찾지 못했어요.")
        }

        // 정렬 기준에 따라 정렬
        places = when (sort) {
            "rating" -> places.sortedByDescending { it.avgRating }     // 평점순
            "popular" -> places.sortedByDescending { it.reviewCount }  // 인기순(리뷰 많은 순)
            else -> places.sortedBy { it.distanceFromUser }            // 거리순
        }

        // 상위 3개만 제공
        return places.take(3)
    }
}
