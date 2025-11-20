package com.example.demo.domain.pet

import com.example.demo.domain.pet.dto.PetDtoCreateRequest
import com.example.demo.domain.pet.dto.PetDtoResponse
import com.example.demo.domain.pet.dto.PetDtoUpdateRequest
import com.example.demo.domain.user.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PetService(
    private val petRepository: PetRepository,
    private val userRepository: UserRepository // '주인'을 찾기 위해 UserRepository도 필요
) {
    @Transactional
    fun createPet(userId: Long, request: PetDtoCreateRequest): PetDtoResponse {
        // 주인을 찾는다
        val owner = userRepository.findByIdOrNull(userId)
            ?: throw IllegalArgumentException("존재하지 않는 사용자입니다.")

        // 펫 엔티티 생성
        val pet = Pet(
            name = request.name,
            gender = request.gender,
            size = request.size,
            birthDate = request.birthDate,
            weight = request.weight,
            specialNotes = request.specialNotes,
            owner = owner // 펫의 주인으로 방금 찾은 user를 지정
        )

        val savedPet = petRepository.save(pet)

        return PetDtoResponse.from(savedPet)
    }

    @Transactional(readOnly = true)
    fun getPetsByUserId(userId: Long): List<PetDtoResponse> {
        val pets = petRepository.findAllByOwnerUserId(userId)

        // 펫 목록을 PetResponse 목록으로 변환
        return pets.map { pet -> PetDtoResponse.from(pet) }
    }

    @Transactional
    fun updatePet(userId: Long, petId: Long, request: PetDtoUpdateRequest): PetDtoResponse {
        val pet = petRepository.findByPetIdAndOwnerUserId(petId, userId)
            ?: throw IllegalArgumentException("펫이 존재하지 않거나 수정 권한이 없습니다.")

        // 펫 정보 수정 (Pet 엔티티의 헬퍼 메서드 사용)
        pet.updateInfo(
            name = request.name,
            gender = request.gender,
            size = request.size,
            birthDate = request.birthDate,
            weight = request.weight,
            specialNotes = request.specialNotes
        )

        return PetDtoResponse.from(pet)
    }

    @Transactional
    fun deletePet(userId: Long, petId: Long) {
        // 펫(petId)의 주인(userId)이 맞는지 확인
        val pet = petRepository.findByPetIdAndOwnerUserId(petId, userId)
            ?: throw IllegalArgumentException("펫이 존재하지 않습니다.")

        petRepository.delete(pet)
    }
}