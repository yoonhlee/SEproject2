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
        
        if (userRepository.existsByNickname(request.nickname!!)) {
            throw IllegalArgumentException("이미 사용 중인 닉네임입니다")
        }

        val encodedPassword = passwordEncoder.encode(request.passwordRaw!!)

        val user = User(
            loginId = request.loginId,
            email = request.email,
            passwordHash = encodedPassword,
            nickname = request.nickname,
            name = request.name,
            birthdate = request.birthdate,
            phone = request.phone,
            address = request.address,
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
        val user = userRepository.findByNameAndBirthdateAndEmail(
            request.name!!, 
            request.birthdate!!, 
            request.email!!
        ) ?: throw IllegalArgumentException("입력하신 정보와 일치하는 계정이 없습니다.")

        return user.loginId
    }

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

    @Transactional
    fun updateProfile(userId: Long, request: UpdateProfileRequest): UserResponse {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }

        if (request.email != user.email && userRepository.existsByEmail(request.email!!)) {
            throw IllegalArgumentException("이미 사용 중인 이메일입니다.")
        }
        
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

    // [수정] 계정 완전 삭제 (데이터베이스에서 제거)
    @Transactional
    fun deleteAccount(userId: Long) {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }
        // user.deactivate() // 기존: 비활성화
        userRepository.delete(user) // 수정: 영구 삭제 (Cascade 설정으로 펫, 리뷰도 자동 삭제됨)
    }

    @Transactional(readOnly = true)
    fun getAllUsers(): List<UserResponse> {
        return userRepository.findAll()
            .map { UserResponse.from(it) }
    }

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