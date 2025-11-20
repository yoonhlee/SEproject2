package com.example.demo.domain.wizard.controller

import com.example.demo.domain.wizard.dto.WizardRecommendRequest
import com.example.demo.domain.wizard.service.WizardService
import org.springframework.web.bind.annotation.*

// Wizard 관련 API 컨트롤러
@RestController
@RequestMapping("/api/wizard")
class WizardController(
    private val wizardService: WizardService
) {

    // 질문과 답변 리스트 제공
    @GetMapping("/questions")
    fun getQuestions() = wizardService.getWizardQuestions()

    // 추천 실행 API
    @PostMapping("/recommend")
    fun recommend(
        @RequestBody request: WizardRecommendRequest,
        @RequestParam(defaultValue = "distance") sort: String
    ) = wizardService.getRecommendations(request, sort)
}
