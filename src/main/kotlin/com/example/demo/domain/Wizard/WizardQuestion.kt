package com.example.demo.domain.wizard

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@Table(name = "wizard_questions")
@EntityListeners(AuditingEntityListener::class)
class WizardQuestion(

    @Column(nullable = false)
    val step: Int,

    @Column(nullable = false, length = 200)
    val questionText: String,

    @Column(nullable = false)
    val isRequired: Boolean = true,

    @OneToMany(
        mappedBy = "question",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    val answers: MutableList<WizardAnswer> = mutableListOf()

) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val questionId: Long = 0

    @CreatedDate
    @Column(nullable = false, updatable = false)
    lateinit var createdAt: LocalDateTime

    @LastModifiedDate
    @Column(nullable = false)
    lateinit var updatedAt: LocalDateTime
}
