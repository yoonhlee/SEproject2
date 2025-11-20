package com.example.demo.domain.user.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class UserRegisterRequest(
    @field:NotBlank(message = "아이디는 필수입니다")
    @field:Size(min = 4, max = 20, message = "아이디는 4자 이상 20자 이하여야 합니다")
    val loginId: String?,

    @field:NotBlank(message = "이메일은 필수입니다")
    @field:Email(message = "올바른 이메일 형식이 아닙니다")
    val email: String?,

    @field:NotBlank(message = "비밀번호는 필수입니다")
    @field:Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하여야 합니다")
    val passwordRaw: String?,

    @field:NotBlank(message = "닉네임은 필수입니다")
    @field:Size(min = 2, max = 20, message = "닉네임은 2자 이상 20자 이하여야 합니다")
    val nickname: String?,

    val profileImage: String? = null
)

data class UserLoginRequest(
    @field:NotBlank(message = "아이디를 입력해주세요.")
    val loginId: String?,

    @field:NotBlank(message = "비밀번호를 입력해주세요.")
    val passwordRaw: String?
)

// ID 찾기 요청
data class FindIdRequest(
    @field:NotBlank(message = "이메일을 입력해주세요.")
    @field:Email(message = "올바른 이메일 형식이 아닙니다")
    val email: String?
)

// 비밀번호 찾기(임시 비밀번호 발급) 요청
data class FindPasswordRequest(
    @field:NotBlank(message = "아이디를 입력해주세요.")
    val loginId: String?,

    @field:NotBlank(message = "이메일을 입력해주세요.")
    @field:Email(message = "올바른 이메일 형식이 아닙니다")
    val email: String?
)

data class UpdateProfileRequest(
    @field:NotBlank(message = "닉네임을 입력해주세요.")
    @field:Size(min = 2, max = 20, message = "닉네임은 2자 이상 20자 이하여야 합니다")
    val nickname: String?,

    val profileImage: String? = null
)

data class ChangePasswordRequest(
    @field:NotBlank(message = "현재 비밀번호를 입력해주세요.")
    val currentPassword: String?,

    @field:NotBlank(message = "새 비밀번호를 입력해주세요.")
    @field:Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하여야 합니다")
    val newPassword: String?
)