package com.example.demo.domain.user
import com.example.demo.domain.pet.Pet
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

    // [추가된 필드들]
    var name: String? = null,
    var birthdate: String? = null,
    var phone: String? = null,
    var address: String? = null,

    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = [CascadeType.ALL], orphanRemoval = true)
    val pets: MutableList<Pet> = mutableListOf()
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

    // [중요] UserService에서 호출하는 메서드와 파라미터가 일치해야 함
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