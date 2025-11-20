package com.example.demo.domain.wizard

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

// 마법사에서 사용되는 질문 엔티티 (1개의 질문이 여러 개의 답변을 가짐)
@Entity
@Table(name = "wizard_questions")
@EntityListeners(AuditingEntityListener::class)
class WizardQuestion(

    @Column(nullable = false)
    val step: Int, // 질문 표시 순서 (Q1~Q4)

    @Column(nullable = false, length = 200)
    val questionText: String, // 사용자에게 보여줄 질문 텍스트

    @Column(nullable = false)
    val isRequired: Boolean = true, // 필수 질문 여부 (마법사에서는 모두 true)

    // 각 질문에 속한 답변 목록(1:N)
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
    val questionId: Long = 0 // 질문 PK

    @CreatedDate
    lateinit var createdAt: LocalDateTime // 생성 시각 자동 기록

    @LastModifiedDate
    lateinit var updatedAt: LocalDateTime // 수정 시각 자동 기록
}

