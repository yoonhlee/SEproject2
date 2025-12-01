package com.example.demo.domain.review

import com.example.demo.domain.user.User
import com.example.demo.domain.place.Place
import com.example.demo.global.entity.BaseTimeEntity
import jakarta.persistence.*
import jakarta.validation.constraints.Size

@Entity
@Table(name = "reviews")
class Review(
    @Column(nullable = false, length = 1000)
    // [수정] 최소 20자 -> 1자로 완화
    @field:Size(min = 1, max = 1000, message = "1자 이상 1000자 이하로 작성해 주세요.")
    var content: String,

    @Column(nullable = false)
    var rating: Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User, 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    var place: Place 

): BaseTimeEntity() {
    @Id
    @Column(name = "review_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val reviewId: Long = 0

    @ElementCollection
    @CollectionTable(
        name = "review_photos",
        joinColumns = [JoinColumn(name = "review_id")])
    @Column(name = "review_url")
    var photos: MutableList<String> = mutableListOf()

    init {
        require(rating in 1..5) { "리뷰 평점은 1~5 사이여야 합니다." }
    }

    fun updateInfo(content: String, rating: Int, newPhoto: List<String>) {
        require(rating in 1..5) { "리뷰 평점은 1~5 사이여야 합니다." }
        this.content = content
        this.rating = rating
        this.photos.clear()
        this.photos.addAll(newPhoto)
    }
}