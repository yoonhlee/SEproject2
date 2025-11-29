package com.example.demo.domain.user.dto

import com.example.demo.domain.user.User
import com.example.demo.domain.user.UserRole
import com.example.demo.domain.pet.Size
import java.time.LocalDateTime

data class UserResponse(
    val userId: Long,
    val loginId: String,
    val email: String,
    val nickname: String,
    val profileImage: String?,
    // [추가]
    val name: String?,
    val birthdate: String?,
    val phone: String?,
    val address: String?,
    
    val role: UserRole,
    val pets: List<PetProfileDto>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun from(user: User): UserResponse {
            return UserResponse(
                userId = user.userId,
                loginId = user.loginId,
                email = user.email,
                nickname = user.nickname,
                profileImage = user.profileImage,
                // [추가 매핑]
                name = user.name,
                birthdate = user.birthdate,
                phone = user.phone,
                address = user.address,
                
                role = user.role,
                pets = user.pets.map { pet ->
                    PetProfileDto(
                        petId = pet.petId,
                        name = pet.name,
                        size = pet.size
                    )
                },
                createdAt = user.createdAt,
                updatedAt = user.updatedAt
            )
        }
    }
}

data class PetProfileDto(
    val petId: Long,
    val name: String,
    val size: Size
)

data class LoginResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: UserResponse
)

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T? = null
)