package com.example.demo.domain.user

import com.example.demo.domain.user.dto.UserRegisterRequest
import com.example.demo.domain.user.dto.UserLoginRequest
import com.example.demo.domain.user.dto.FindIdRequest
import com.example.demo.domain.user.dto.FindPasswordRequest
import com.example.demo.domain.user.dto.UserResponse
import com.example.demo.domain.user.dto.UpdateProfileRequest
import com.example.demo.domain.user.dto.ChangePasswordRequest
import com.example.demo.domain.user.dto.LoginResponse
import com.example.demo.global.security.JwtTokenProvider
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider
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

        val accessToken = jwtTokenProvider.createAccessToken(user.userId, user.role)
        val refreshToken = "refresh-token-not-implemented-yet"

        return LoginResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            user = UserResponse.from(user)
        )
    }

    @Transactional(readOnly = true)
    fun findLoginId(request: FindIdRequest): String {
        val user = userRepository.findByEmail(request.email!!)
            ?: throw IllegalArgumentException("해당 이메일로 가입된 계정이 없습니다.")

        return user.loginId
    }

    // 비밀번호 찾기 -> 임시 비밀번호 발급
    @Transactional
    fun resetPassword(request: FindPasswordRequest): String {
        val user = userRepository.findByLoginIdAndEmail(request.loginId!!, request.email!!)
            ?: throw IllegalArgumentException("일치하는 사용자 정보가 없습니다.")

        val tempPassword = generateTempPassword()
        val encodedPassword = passwordEncoder.encode(tempPassword)
        user.updatePassword(encodedPassword)

        return tempPassword
    }

    private fun generateTempPassword(): String {
        val charPool = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        return (1..8)
            .map { charPool.random() }
            .joinToString("")
    }

    @Transactional(readOnly = true)
    fun getUserById(userId: Long): UserResponse {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }
        return UserResponse.from(user)
    }

    @Transactional(readOnly = true)
    fun getUserByEmail(email: String): UserResponse {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("존재하지 않는 사용자입니다")
        return UserResponse.from(user)
    }

    // [수정된 부분] 프로필 업데이트 (모든 필드 반영)
    @Transactional
    fun updateProfile(userId: Long, request: UpdateProfileRequest): UserResponse {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }

        // 이메일 변경 시 중복 검사
        if (request.email != user.email && userRepository.existsByEmail(request.email!!)) {
            throw IllegalArgumentException("이미 사용 중인 이메일입니다.")
        }
        
        // 닉네임 변경 시 중복 검사
        if (request.nickname != user.nickname && userRepository.existsByNickname(request.nickname!!)) {
            throw IllegalArgumentException("이미 사용 중인 닉네임입니다.")
        }

        user.updateProfile(
            nickname = request.nickname!!,
            email = request.email!!,
            name = request.name,
            birthdate = request.birthdate,
            phone = request.phone,
            address = request.address,
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

    // 중복 확인용 함수들
    @Transactional(readOnly = true)
    fun checkLoginIdDuplicate(loginId: String): Boolean {
        return userRepository.existsByLoginId(loginId)
    }

    @Transactional(readOnly = true)
    fun checkEmailDuplicate(email: String): Boolean {
        return userRepository.existsByEmail(email)
    }

    @Transactional(readOnly = true)
    fun checkNicknameDuplicate(nickname: String): Boolean {
        return userRepository.existsByNickname(nickname)
    }
}