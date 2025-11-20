package com.example.demo.domain.pet
import org.springframework.data.jpa.repository.JpaRepository

interface PetRepository : JpaRepository<Pet, Long> {

    // 1. 특정 '주인(User)'의 ID로 모든 펫 목록을 찾는 기능 (마이페이지에서 내 펫 목록 보여줄 때 사용)
    fun findAllByOwnerUserId(ownerId: Long): List<Pet>

    // 2. 특정 '주인' ID와 '펫' ID로 펫을 찾는 기능 (펫 수정/삭제 시, 내가 주인(owner)이 맞는지 확인용)
    fun findByPetIdAndOwnerUserId(petId: Long, ownerId: Long): Pet?
}