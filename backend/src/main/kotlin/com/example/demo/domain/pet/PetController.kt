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
    // 1. 펫 등록
    @PostMapping("/users/{userId}/pets")
    fun createPet(
        @PathVariable userId: Long, // [수정] ownerId -> userId 로 변경!
        @Valid @RequestBody request: PetDtoCreateRequest
    ): ResponseEntity<ApiResponse<PetDtoResponse>> {
        // [수정] 서비스 호출할 때도 userId 변수 사용
        val petResponse = petService.createPet(userId, request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse(success = true, message = "반려동물이 등록되었습니다.", data = petResponse))
    }

    // 2. 펫 조회
    @GetMapping("/users/{userId}/pets")
    fun getPetsByUserId(
        @PathVariable userId: Long // [수정] ownerId -> userId 로 변경!
    ): ResponseEntity<ApiResponse<List<PetDtoResponse>>> {
        // [수정] 서비스 호출 시 userId 사용
        val pets = petService.getPetsByUserId(userId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "반려동물 목록 조회 성공.", data = pets))
    }

    // 3. 펫 수정
    @PutMapping("/users/{userId}/pets/{petId}")
    fun updatePet(
        @PathVariable userId: Long, // [수정] ownerId -> userId 로 변경!
        @PathVariable petId: Long,
        @Valid @RequestBody request: PetDtoUpdateRequest
    ): ResponseEntity<ApiResponse<PetDtoResponse>> {
        // [수정] 서비스 호출 시 userId 사용
        val updatedPet = petService.updatePet(userId, petId, request)
        return ResponseEntity.ok(ApiResponse(success = true, message = "반려동물 정보가 수정되었습니다.", data = updatedPet))
    }

    // 4. 펫 삭제
    @DeleteMapping("/users/{userId}/pets/{petId}")
    fun deletePet(
        @PathVariable userId: Long, // [수정] ownerId -> userId 로 변경!
        @PathVariable petId: Long
    ): ResponseEntity<ApiResponse<Unit>> {
        // [수정] 서비스 호출 시 userId 사용
        petService.deletePet(userId, petId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "반려동물 정보가 삭제되었습니다."))
    }
}