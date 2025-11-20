package com.example.demo.domain.user

import com.example.demo.domain.user.dto.UserRegisterRequest
import com.example.demo.domain.user.dto.UserLoginRequest
import com.example.demo.domain.user.dto.FindIdRequest
import com.example.demo.domain.user.dto.FindPasswordRequest
import com.example.demo.domain.user.dto.UserResponse
import com.example.demo.domain.user.dto.UpdateProfileRequest
import com.example.demo.domain.user.dto.ChangePasswordRequest
import com.example.demo.domain.user.dto.LoginResponse

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
    // private val jwtTokenProvider: JwtTokenProvider // (추가 권장) 실제 토큰 발급용
) {

    @Transactional
    fun signUp(request: UserRegisterRequest): UserResponse {
        if (userRepository.existsByLoginId(request.loginId!!)) {
            throw IllegalArgumentException("이미 사용 중인 아이디입니다")
        }

        if (userRepository.existsByEmail(request.email!!)) {
            throw IllegalArgumentException("이미 사용 중인 이메일입니다")
        }

        // 비밀번호 암호화
        val encodedPassword = passwordEncoder.encode(request.passwordRaw!!)

        // 사용자 생성
        val user = User(
            loginId = request.loginId,
            email = request.email,
            passwordHash = encodedPassword,
            nickname = request.nickname!!,
            profileImage = request.profileImage
        )

        val savedUser = userRepository.save(user)
        return UserResponse.from(savedUser)
    }

    fun login(request: UserLoginRequest): LoginResponse {
        val user = userRepository.findByLoginId(request.loginId!!)
            ?: throw IllegalArgumentException("존재하지 않는 사용자입니다")

        if (!user.isActive) {
            throw IllegalStateException("비활성화된 계정입니다")
        }

        if (!passwordEncoder.matches(request.passwordRaw!!, user.passwordHash)) {
            throw IllegalArgumentException("비밀번호가 일치하지 않습니다")
        }

        // (추가) 실제 토큰 생성 로직
        // val accessToken = jwtTokenProvider.createAccessToken(user.id, user.role)
        // val refreshToken = jwtTokenProvider.createRefreshToken(user.id)

        // (임시)
        val accessToken = "dummy-access-token"
        val refreshToken = "dummy-refresh-token"


        return LoginResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            user = UserResponse.from(user) // (수정) MemberResponse -> UserResponse
        )
    }

    @Transactional(readOnly = true)
    fun findLoginId(request: FindIdRequest): String {
        val user = userRepository.findByEmail(request.email!!)
            ?: throw IllegalArgumentException("해당 이메일로 가입된 계정이 없습니다.")

        return user.loginId
    }

    //  비밀번호 찾기 -> 임시 비밀번호 발급
    @Transactional
    fun resetPassword(request: FindPasswordRequest): String {
        // 아이디와 이메일로 사용자 확인
        val user = userRepository.findByLoginIdAndEmail(request.loginId!!, request.email!!)
            ?: throw IllegalArgumentException("일치하는 사용자 정보가 없습니다.")

        // 임시 비밀번호 생성 (랜덤 8자리 문자열)
        val tempPassword = generateTempPassword()

        // 임시 비밀번호 암호화 및 DB 업데이트
        val encodedPassword = passwordEncoder.encode(tempPassword)
        user.updatePassword(encodedPassword)

        // 사용자가 로그인할 수 있도록 임시 비밀번호 반환
        return tempPassword
    }

    // 임시 비밀번호 생성 로직
    private fun generateTempPassword(): String {
        val charPool = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        return (1..8)
            .map { charPool.random() }
            .joinToString("")
    }

    // ID 기반 사용자 조회 (프로필, 마이페이지 접속 시 사용)
    @Transactional(readOnly = true)
    fun getUserById(userId: Long): UserResponse {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }
        return UserResponse.from(user)
    }

    // Email 기반 사용자 조회 (비밀번호 재설정 시 필요)
    @Transactional(readOnly = true)
    fun getUserByEmail(email: String): UserResponse {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("존재하지 않는 사용자입니다")
        return UserResponse.from(user)
    }

    @Transactional
    fun updateProfile(userId: Long, request: UpdateProfileRequest): UserResponse {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }

        user.updateProfile(
            nickname = request.nickname!!,
            profileImage = request.profileImage
        )

        return UserResponse.from(user)
    }

    @Transactional
    fun changePassword(userId: Long, request: ChangePasswordRequest) {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }

        if (!passwordEncoder.matches(request.currentPassword!!, user.passwordHash)) {
            throw IllegalArgumentException("현재 비밀번호가 일치하지 않습니다")
        }

        val newEncodedPassword = passwordEncoder.encode(request.newPassword!!)
        user.updatePassword(newEncodedPassword)
    }

    // 데이터 베이스에서 지우지 않고 isActive = false로 두어 비활성화
    @Transactional
    fun deleteAccount(userId: Long) {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }
        user.deactivate()
    }

    @Transactional(readOnly = true)
    fun getAllUsers(): List<UserResponse> {
        return userRepository.findAll()
            .map { UserResponse.from(it) }
    }
}