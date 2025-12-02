package com.example.demo.domain.user

import com.example.demo.domain.pet.Pet
import com.example.demo.domain.review.Review // [추가] 리뷰 엔티티 import
import jakarta.persistence.*
import com.example.demo.global.entity.BaseTimeEntity
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "users")
class User (
    @Column(nullable = false, unique = true, length = 50)
    val loginId: String,

    @Column(nullable = false, unique = true, length = 100)
    var email: String,

    @Column(nullable = false)
    var passwordHash: String,

    @Column(nullable = false, length = 50)
    var nickname: String,

    @Column(length = 500)
    var profileImage: String? = null,

    // 추가 정보 필드들
    var name: String? = null,
    var birthdate: String? = null,
    var phone: String? = null,
    var address: String? = null,

    // 1. 주인(1) : 펫(N) 관계 (주인 삭제 시 펫도 삭제)
    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = [CascadeType.ALL], orphanRemoval = true)
    val pets: MutableList<Pet> = mutableListOf(),

    // [추가] 2. 유저(1) : 리뷰(N) 관계 (유저 삭제 시 리뷰도 삭제)
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    val reviews: MutableList<Review> = mutableListOf()

): BaseTimeEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    val userId: Long = 0

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var role: UserRole = UserRole.USER
        protected set

    @Column(nullable = false)
    var isActive: Boolean = true
        protected set

    fun updateProfile(nickname: String, email: String, name: String?, birthdate: String?, phone: String?, address: String?, profileImage: String?) {
        this.nickname = nickname
        this.email = email
        this.name = name
        this.birthdate = birthdate
        this.phone = phone
        this.address = address
        this.profileImage = profileImage
    }

    fun updatePassword(newPasswordHash: String) {
        this.passwordHash = newPasswordHash
    }

    fun deactivate() {
        this.isActive = false
    }
}

enum class UserRole {
    USER, ADMIN
}