package com.example.demo.domain.pet

import com.example.demo.domain.user.User
import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "pets") // DB에 'pets' 테이블 생성
class Pet(
    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING) // "MALE", "FEMALE" 문자열로 저장
    var gender: PetGender,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING) // "SMALL", "MEDIUM", "BIG" 문자열로 저장
    var size: Size,

    var birthDate: LocalDate? = null,

    var weight: Double? = null,

    var specialNotes: String? = null,

    // 펫(N) : 유저(1) 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // DB에 'user_id' 컬럼 생성
    var owner: User

) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val petId: Long = 0

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
        protected set

    // 펫 정보 수정을 위한 메서드
    fun updateInfo(name: String, gender: PetGender, size: Size, birthDate: LocalDate?, weight: Double?, specialNotes: String?) {
        this.name = name
        this.gender = gender
        this.size = size
        this.birthDate = birthDate
        this.weight = weight
        this.specialNotes = specialNotes
        this.updatedAt = LocalDateTime.now()
    }
}

enum class PetGender {
    MALE, FEMALE, UNKNOWN
}

enum class Size {
    BIG, MEDIUM, SMALL
}