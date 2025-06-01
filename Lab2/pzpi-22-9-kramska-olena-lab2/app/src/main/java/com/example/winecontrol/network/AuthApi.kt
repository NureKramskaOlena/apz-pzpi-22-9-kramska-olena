package com.example.winecontrol.network
import com.example.winecontrol.network.User

import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

data class LoginRequest(val username: String, val password: String)
data class LoginResponse(
    val success: Boolean,
    val user: User
)


interface AuthApi {
    @Headers("Content-Type: application/json")
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
}
