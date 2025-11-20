package com.example.demo.domain.place

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "places")
class Place(
    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var address: String,

    var phone: String? = null,

    var operationHours: String? = null,

    @Column(nullable = false)
    var petPolicy: String, // 반려동물 정책 (예: "대형견 가능")

    var latitude: Double? = null,

    var longitude: Double? = null

) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val placeId: Long = 0

    @Column(nullable = false)
    var avgRating: Double = 0.0 // 평균 평점 (리뷰가 쌓이면 갱신)
        protected set

    // 사진 URL 목록 (별도의 테이블로 관리됨)
    @ElementCollection
    @CollectionTable(name = "place_photos", joinColumns = [JoinColumn(name = "place_id")])
    @Column(name = "photo_url")
    var photos: MutableList<String> = mutableListOf()

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
        protected set

    // 정보 수정 메서드
    fun updateInfo(
        name: String,
        address: String,
        phone: String?,
        operationHours: String?,
        petPolicy: String,
        latitude: Double?,
        longitude: Double?,
        newPhotos: List<String>
    ) {
        this.name = name
        this.address = address
        this.phone = phone
        this.operationHours = operationHours
        this.petPolicy = petPolicy
        this.latitude = latitude
        this.longitude = longitude
        this.updatedAt = LocalDateTime.now()

        // 사진 리스트 교체 (싹 지우고 다시 넣기)
        this.photos.clear()
        this.photos.addAll(newPhotos)
    }

    // 평점 업데이트 메서드 (Review 기능 추가 시 사용)
    fun updateAvgRating(newRating: Double) {
        this.avgRating = newRating
    }
}