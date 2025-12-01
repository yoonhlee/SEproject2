package com.example.demo.domain.user

import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long> {

        // '이메일'로 유저 찾기 버튼
        fun findByEmail(email: String): User?

        // '이메일'이 존재하는지 확인하는 버튼
        fun existsByEmail(email: String): Boolean

        // 아이디와 이메일이 모두 일치하는 사용자 찾기 (비밀번호 찾기용)
        fun findByLoginIdAndEmail(loginId: String, email: String): User?

        // '로그인 ID'로 유저 찾기 버튼
        fun findByLoginId(loginId: String): User?

        // 데이터베이스에  '로그인 ID'를 가진 사용자가 있는지 찾는 버튼
        fun existsByLoginId(loginId: String): Boolean

        // 닉네임 중복 확인
        fun existsByNickname(nickname: String): Boolean

        // [추가] 이름 + 생년월일 + 이메일로 유저 찾기 (아이디 찾기용)
    fun findByNameAndBirthdateAndEmail(name: String, birthdate: String, email: String): User?
}