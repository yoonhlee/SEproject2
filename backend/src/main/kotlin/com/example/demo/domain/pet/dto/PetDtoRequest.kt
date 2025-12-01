package com.example.demo.domain.pet.dto

import com.example.demo.domain.pet.PetGender
import com.example.demo.domain.pet.Size
import java.time.LocalDate

data class PetDtoCreateRequest(
    val name: String,
    val gender: PetGender,
    val size: Size,
    val birthDate: LocalDate? = null,
    val age: Int = 0, // [추가]
    val weight: Double? = null,
    val specialNotes: String? = null,
    val photo: String? = null // [추가]
)

data class PetDtoUpdateRequest(
    val name: String,
    val gender: PetGender,
    val size: Size,
    val birthDate: LocalDate? = null,
    val age: Int = 0, // [추가]
    val weight: Double? = null,
    val specialNotes: String? = null,
    val photo: String? = null // [추가]
)