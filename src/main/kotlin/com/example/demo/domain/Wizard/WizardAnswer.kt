package com.example.demo.domain.wizard

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@Table(name = "wizard_answers")
@EntityListeners(AuditingEntityListener::class)
class WizardAnswer(

    @Column(nullable = false, length = 200)
    val answerText: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    val matchingTag: WizardTag,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    val question: WizardQuestion

) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val answerId: Long = 0

    @CreatedDate
    @Column(nullable = false, updatable = false)
    lateinit var createdAt: LocalDateTime

    @LastModifiedDate
    @Column(nullable = false)
    lateinit var updatedAt: LocalDateTime
}
