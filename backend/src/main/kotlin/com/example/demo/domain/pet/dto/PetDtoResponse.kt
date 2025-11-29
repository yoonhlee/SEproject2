package com.example.demo.domain.pet.dto

import com.example.demo.domain.pet.Pet
import com.example.demo.domain.pet.PetGender
import com.example.demo.domain.pet.Size
import java.time.LocalDate

data class PetDtoResponse(
    val petId: Long,
    val name: String,
    val gender: PetGender,
    val size: Size,
    val birthDate: LocalDate?,
    val age: Int, // [추가]
    val weight: Double?,
    val specialNotes: String?,
    val ownerId: Long
) {
    companion object {
        fun from(pet: Pet): PetDtoResponse {
            return PetDtoResponse(
                petId = pet.petId,
                name = pet.name,
                gender = pet.gender,
                size = pet.size,
                birthDate = pet.birthDate,
                age = pet.age, // [추가]
                weight = pet.weight,
                specialNotes = pet.specialNotes,
                ownerId = pet.owner.userId
            )
        }
    }
}