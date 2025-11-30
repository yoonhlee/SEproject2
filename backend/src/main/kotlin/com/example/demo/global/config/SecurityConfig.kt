package com.example.demo.global.config

import com.example.demo.global.security.JwtAuthenticationFilter
import com.example.demo.global.security.JwtTokenProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springdoc.core.utils.SpringDocUtils

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtTokenProvider: JwtTokenProvider
) {
    
    // Swagger 관련 어노테이션 무시 설정 (아까 추가한 것 유지)
    init {
        SpringDocUtils.getConfig().addAnnotationsToIgnore(
            org.springframework.security.core.annotation.AuthenticationPrincipal::class.java
        )
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { it.configurationSource(corsConfigurationSource()) } // [중요] CORS 설정 연결!
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers(
                    "/**", // 테스트 편의를 위해 일단 모든 요청 허용 (나중에 줄여도 됨)
                    "/api/users/signup", "/api/users/login",
                    "/api/map/**", "/api/places/**",
                    "/v3/api-docs/**", "/swagger-ui/**"
                ).permitAll()
                it.anyRequest().permitAll()
            }
            .addFilterBefore(
                JwtAuthenticationFilter(jwtTokenProvider),
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

    // [핵심] 여기에 프론트엔드 IP를 등록해야 합니다!
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        
        // 허용할 프론트엔드 주소 목록
        configuration.allowedOrigins = listOf(
            "http://localhost:3000",
            "http://13.209.190.232:3000" // [수정됨] 에러 로그에 뜬 프론트엔드 IP 추가
        )
        
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}