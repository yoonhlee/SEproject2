package com.example.demo.global.config

import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

@Configuration // 이 파일이 설정 파일임을 스프링에게 알려줌
@EnableJpaAuditing // 엔티티의 생성/수정 시간을 자동으로 기록하는 기능을 켬
class JpaConfig