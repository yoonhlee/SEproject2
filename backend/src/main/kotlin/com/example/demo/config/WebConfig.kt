package com.example.SEproject.project.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            // 1. CORS 설정 적용 (WebConfig보다 이게 더 강력함)
            .cors { it.configurationSource(corsConfigurationSource()) }
            // 2. CSRF 보호 기능 끄기 (이게 켜져 있으면 로그인이 안 됨! 🚨)
            .csrf { it.disable() }
            // 3. 모든 주소 접속 허용 (로그인 없이도 들어갈 수 있게)
            .authorizeHttpRequests {
                it.anyRequest().permitAll()
            }
        
        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        // 허용할 프론트엔드 주소 (AWS IP, 로컬호스트)
        configuration.allowedOrigins = listOf("http://52.79.197.189:3000", "http://localhost:3000")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowCredentials = true
        configuration.allowedHeaders = listOf("*")
        
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}