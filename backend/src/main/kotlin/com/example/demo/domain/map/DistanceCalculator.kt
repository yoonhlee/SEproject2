package com.example.demo.domain.map

import kotlin.math.*

/**
 * 위도/경도를 이용해 두 지점 사이의 실제 거리(m)를 계산하는 유틸
 * (Haversine formula)
 */
object DistanceCalculator {

    private const val EARTH_RADIUS_M = 6371000.0 // 지구 반지름 (m)

    fun calculate(
        lat1: Double, lon1: Double,
        lat2: Double, lon2: Double
    ): Double {
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)

        val a = sin(dLat / 2).pow(2.0) +
                cos(Math.toRadians(lat1)) *
                cos(Math.toRadians(lat2)) *
                sin(dLon / 2).pow(2.0)

        val c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return EARTH_RADIUS_M * c
    }
}
