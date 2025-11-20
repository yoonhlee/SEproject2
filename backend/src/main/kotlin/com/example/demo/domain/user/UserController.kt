package com.example.demo.domain.user

import com.example.demo.domain.user.dto.UserRegisterRequest
import com.example.demo.domain.user.dto.UserLoginRequest
import com.example.demo.domain.user.dto.UserResponse
import com.example.demo.domain.user.dto.FindIdRequest
import com.example.demo.domain.user.dto.FindPasswordRequest
import com.example.demo.domain.user.dto.UpdateProfileRequest
import com.example.demo.domain.user.dto.ChangePasswordRequest
import com.example.demo.domain.user.dto.LoginResponse
import com.example.demo.domain.user.dto.ApiResponse // (ApiResponse는 UserDtoResponse.kt에 있었음)

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users") // /api/v1/users 와 같이 버전 명시
class UserController(
    private val userService: UserService
) {

    // 회원가입
    @PostMapping("/signup")
    fun signUp(@Valid @RequestBody request: UserRegisterRequest): ResponseEntity<ApiResponse<UserResponse>> { // (수정) DTO 변경
        val user = userService.signUp(request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(
                ApiResponse(
                success = true,
                message = "회원가입이 완료되었습니다",
                data = user
            )
            )
    }

    // 로그인
    @PostMapping("/login")
    fun login(@Valid @RequestBody request: UserLoginRequest): ResponseEntity<ApiResponse<LoginResponse>> { // (수정) DTO 및 반환 타입 변경
        // Service가 LoginResponse를 직접 반환
        val loginResponse = userService.login(request)

        return ResponseEntity.ok(
            ApiResponse(
            success = true,
            message = "로그인에 성공했습니다",
            data = loginResponse
        )
        )
    }

    // 아이디 찾기 (POST /api/users/find-id)
    @PostMapping("/find-id")
    fun findId(@Valid @RequestBody request: FindIdRequest): ResponseEntity<ApiResponse<String>> {
        val loginId = userService.findLoginId(request)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = "아이디 찾기 성공",
                data = loginId
            )
        )
    }

    // 비밀번호 찾기/재설정 (POST /api/users/reset-password)
    @PostMapping("/reset-password")
    fun findPassword(@Valid @RequestBody request: FindPasswordRequest): ResponseEntity<ApiResponse<String>> {
        val tempPassword = userService.resetPassword(request)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = "임시 비밀번호가 발급되었습니다.",
                data = tempPassword // 실제 서비스에서는 보안상 이메일로 보내지만, 프로젝트용으로 직접 반환
            )
        )
    }


    // ID기반 사용자 조회
    @GetMapping("/{userId}")
    fun getUser(@PathVariable userId: Long): ResponseEntity<ApiResponse<UserResponse>> {
        val user = userService.getUserById(userId)
        return ResponseEntity.ok(
            ApiResponse(
            success = true,
            message = "사용자 조회 성공",
            data = user
        )
        )
    }

    // 프로필 업데이트
    @PutMapping("/{userId}/profile")
    fun updateProfile(
        @PathVariable userId: Long,
        @Valid @RequestBody request: UpdateProfileRequest
    ): ResponseEntity<ApiResponse<UserResponse>> {
        val user = userService.updateProfile(userId, request)
        return ResponseEntity.ok(
            ApiResponse(
            success = true,
            message = "프로필이 수정되었습니다",
            data = user
        )
        )
    }

    // 비밀번호 변경
    @PutMapping("/{userId}/password")
    fun changePassword(
        @PathVariable userId: Long,
        @Valid @RequestBody request: ChangePasswordRequest
    ): ResponseEntity<ApiResponse<Unit>> {
        userService.changePassword(userId, request)
        return ResponseEntity.ok(
            ApiResponse(
            success = true,
            message = "비밀번호가 변경되었습니다"
        )
        )
    }

    // 회원탈퇴
    @DeleteMapping("/{userId}")
    fun deleteAccount(@PathVariable userId: Long): ResponseEntity<ApiResponse<Unit>> {
        userService.deleteAccount(userId)
        return ResponseEntity.ok(
            ApiResponse(
            success = true,
            message = "계정이 삭제되었습니다"
        )
        )
    }
}
