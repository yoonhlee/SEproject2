package com.example.demo.domain.pet

import com.example.demo.domain.pet.dto.PetDtoCreateRequest
import com.example.demo.domain.pet.dto.PetDtoResponse
import com.example.demo.domain.pet.dto.PetDtoUpdateRequest
import com.example.demo.domain.user.dto.ApiResponse // (공통 응답 DTO)
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class PetController(
    private val petService: PetService
) {
    @PostMapping("/users/{userId}/pets")
    fun createPet(
        @PathVariable ownerId: Long,
        @Valid @RequestBody request: PetDtoCreateRequest
    ): ResponseEntity<ApiResponse<PetDtoResponse>> {

        val petResponse = petService.createPet(ownerId, request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse(success = true, message = "반려동물이 등록되었습니다.", data = petResponse))
    }

    // 사용자의 모든 펫 조회
    @GetMapping("/users/{userId}/pets")
    fun getPetsByUserId(
        @PathVariable ownerId: Long
    ): ResponseEntity<ApiResponse<List<PetDtoResponse>>> {

        val pets = petService.getPetsByUserId(ownerId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "반려동물 목록 조회 성공.", data = pets))
    }

    @PutMapping("/users/{userId}/pets/{petId}")
    fun updatePet(
        @PathVariable ownerId: Long, // (보안상: 나중에 토큰으로 대체)
        @PathVariable petId: Long,
        @Valid @RequestBody request: PetDtoUpdateRequest
    ): ResponseEntity<ApiResponse<PetDtoResponse>> {

        val updatedPet = petService.updatePet(ownerId, petId, request)
        return ResponseEntity.ok(ApiResponse(success = true, message = "반려동물 정보가 수정되었습니다.", data = updatedPet))
    }

    @DeleteMapping("/users/{userId}/pets/{petId}")
    fun deletePet(
        @PathVariable ownerId: Long, // (보안상: 나중에 토큰으로 대체)
        @PathVariable petId: Long
    ): ResponseEntity<ApiResponse<Unit>> { // (데이터가 없으므로 Unit)

        petService.deletePet(ownerId, petId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "반려동물 정보가 삭제되었습니다."))
    }
}