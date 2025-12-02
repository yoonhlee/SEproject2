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

    // [추가] 회원가입 시 함께 저장할 추가 정보들
    val name: String?,
    val birthdate: String?,
    val phone: String?,
    val address: String?,
    
    val profileImage: String? = null
)

data class UserLoginRequest(
    @field:NotBlank(message = "아이디를 입력해주세요.")
    val loginId: String?,

    @field:NotBlank(message = "비밀번호를 입력해주세요.")
    val passwordRaw: String?
)

data class FindIdRequest(
    @field:NotBlank(message = "이름을 입력해주세요.")
    val name: String?,

    @field:NotBlank(message = "생년월일을 입력해주세요.")
    val birthdate: String?,

    @field:NotBlank(message = "이메일을 입력해주세요.")
    @field:Email(message = "올바른 이메일 형식이 아닙니다")
    val email: String?
)

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

    @field:NotBlank(message = "이메일을 입력해주세요.")
    val email: String?,

    val name: String? = null,
    val birthdate: String? = null,
    val phone: String? = null,
    val address: String? = null,
    val profileImage: String? = null
)

data class ChangePasswordRequest(
    @field:NotBlank(message = "현재 비밀번호를 입력해주세요.")
    val currentPassword: String?,

    @field:NotBlank(message = "새 비밀번호를 입력해주세요.")
    @field:Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하여야 합니다")
    val newPassword: String?
)