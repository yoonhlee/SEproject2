package com.example.demo.domain.pet

import com.example.demo.domain.user.User
import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime
import com.example.demo.global.entity.BaseTimeEntity


@Entity
@Table(name = "pets")
class Pet(
    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var gender: PetGender,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var size: Size,

    var birthDate: LocalDate? = null,
    
    // [추가] 나이 필드 추가
    var age: Int = 0, 

    var weight: Double? = null,
    var specialNotes: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var owner: User

): BaseTimeEntity() {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val petId: Long = 0

    // [수정] updateInfo에 age 추가
    fun updateInfo(name: String, gender: PetGender, size: Size, birthDate: LocalDate?, age: Int, weight: Double?, specialNotes: String?) {
        this.name = name
        this.gender = gender
        this.size = size
        this.birthDate = birthDate
        this.age = age // [추가]
        this.weight = weight
        this.specialNotes = specialNotes
    }
}

enum class PetGender {
    MALE, FEMALE, UNKNOWN
}

enum class Size {
    BIG, MEDIUM, SMALL
}