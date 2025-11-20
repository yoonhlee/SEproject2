package com.example.demo.domain.wizard

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

// 마법사 질문에 대한 개별 답변 엔티티
@Entity
@Table(name = "wizard_answers")
@EntityListeners(AuditingEntityListener::class)
class WizardAnswer(

    @Column(nullable = false, length = 200)
    val answerText: String, // 사용자에게 보여줄 답변 텍스트

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    val matchingTag: WizardTag, // 이 답변이 의미하는 추천 태그(조건)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    val question: WizardQuestion // 부모 질문
) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val answerId: Long = 0 // 답변 PK

    @CreatedDate
    lateinit var createdAt: LocalDateTime

    @LastModifiedDate
    lateinit var updatedAt: LocalDateTime
}
