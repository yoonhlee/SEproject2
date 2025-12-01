package com.example.demo.domain.place

import com.example.demo.domain.place.model.DogSize
import com.example.demo.domain.place.model.LocationType
import com.example.demo.domain.place.model.PlaceCategory
import com.example.demo.global.entity.BaseTimeEntity
import jakarta.persistence.*

@Entity
@Table(name = "places")
class Place(
    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var address: String,

    var phone: String? = null,
    var operationHours: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var category: PlaceCategory,

    var hasParking: Boolean = false,
    var isOffLeash: Boolean = false,
    
    // [추가] 와이파이 여부
    var hasWifi: Boolean = false,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var locationType: LocationType,

    @ElementCollection(targetClass = DogSize::class)
    @CollectionTable(name = "place_allowed_sizes", joinColumns = [JoinColumn(name = "place_id")])
    @Enumerated(EnumType.STRING)
    var allowedSizes: MutableSet<DogSize> = mutableSetOf(),

    @Column(nullable = false)
    var petPolicy: String,

    var latitude: Double? = null,
    var longitude: Double? = null

): BaseTimeEntity() {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val placeId: Long = 0

    @Column(nullable = false)
    var avgRating: Double = 0.0

    @Column(nullable = false)
    var reviewCount: Int = 0

    @ElementCollection
    @CollectionTable(name = "place_photos", joinColumns = [JoinColumn(name = "place_id")])
    @Column(name = "photo_url")
    var photos: MutableList<String> = mutableListOf()

    // [수정] 정보 수정 메서드에 hasWifi 추가
    fun updateInfo(
        name: String, address: String, phone: String?, operationHours: String?,
        petPolicy: String, category: PlaceCategory, locationType: LocationType,
        hasParking: Boolean, isOffLeash: Boolean, hasWifi: Boolean, // [추가]
        allowedSizes: Set<DogSize>,
        latitude: Double?, longitude: Double?, newPhotos: List<String>
    ) {
        this.name = name
        this.address = address
        this.phone = phone
        this.operationHours = operationHours
        this.petPolicy = petPolicy
        this.category = category
        this.locationType = locationType
        this.hasParking = hasParking
        this.isOffLeash = isOffLeash
        this.hasWifi = hasWifi // [추가]
        this.allowedSizes.clear()
        this.allowedSizes.addAll(allowedSizes)
        this.latitude = latitude
        this.longitude = longitude
        this.photos.clear()
        this.photos.addAll(newPhotos)
    }

    fun updateRatingInfo(newRating: Double, newReviewCount: Int) {
        this.avgRating = newRating
        this.reviewCount = newReviewCount
    }
}