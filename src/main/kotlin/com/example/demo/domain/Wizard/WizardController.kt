package com.example.demo.domain.wizard.controller

import com.example.demo.domain.wizard.dto.WizardRecommendRequest
import com.example.demo.domain.wizard.service.WizardService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/wizard")
class WizardController(
    private val wizardService: WizardService
) {

    @GetMapping("/questions")
    fun getQuestions() = wizardService.getWizardQuestions()

    @PostMapping("/recommend")
    fun recommend(
        @RequestBody request: WizardRecommendRequest,
        @RequestParam(defaultValue = "distance") sort: String
    ) = wizardService.getRecommendations(request, sort)
}
