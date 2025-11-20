package com.example.demo.domain.review

import com.example.demo.domain.user.User
import com.example.demo.domain.place.Place
import jakarta.persistence.*
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

@Entity
@Table(name = "reviews")
class Review(
    @Column(nullable = false, length = 1000)
    @field:Size(min = 20, max = 1000, message = "20자 이상 1000자 이하로 작성해 주세요.")
    var content: String,

    @Column(nullable = false)
    var rating: Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User, // 리뷰 작성한 유저 (FK)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    var place: Place // 리뷰 작성한 장소 (FK)

) {
    @Id
    @Column(name = "review_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val reviewId: Long = 0 // 리뷰 구분값(PK)

    // 사진 URL 목록 (별도의 테이블로 관리됨)
    @ElementCollection
    @CollectionTable(
        name = "review_photos",
        joinColumns = [JoinColumn(name = "review_id")])
    @Column(name = "review_url")
    var photos: MutableList<String> = mutableListOf()

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
        protected set

    // 정보 수정 메서드
    fun updateInfo(content: String, rating: Int, newPhoto: List<String>) {
        this.content = content
        this.rating = rating
        this.photos.clear()
        this.photos.addAll(newPhoto)
        this.updatedAt = LocalDateTime.now()
    }
}