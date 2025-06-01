package com.example.winecontrol

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.winecontrol.network.*
import kotlinx.coroutines.*
import retrofit2.HttpException
import com.example.winecontrol.network.User



class LoginActivity : AppCompatActivity() {

    private lateinit var etUsername: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button
    private val authApi = ApiClient.instance.create(AuthApi::class.java)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        etUsername = findViewById(R.id.etUsername)
        etPassword = findViewById(R.id.etPassword)
        btnLogin = findViewById(R.id.btnLogin)

        btnLogin.setOnClickListener {
            val username = etUsername.text.toString().trim()
            val password = etPassword.text.toString().trim()

            Log.d("LOGIN_DEBUG", "username=[$username], password=[$password]")

            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val response = authApi.login(LoginRequest(username, password))
                    val userId = response.user.user_id
                    if (response.user != null) {


                        withContext(Dispatchers.Main) {
                            val intent = Intent(this@LoginActivity, DashboardActivity::class.java)
                            intent.putExtra("username", username)
                            intent.putExtra("user_id", userId)
                            startActivity(intent)



                            finish()
                        }
                    } else {
                        showToast("Невірні дані")
                    }
                } catch (e: HttpException) {
                    Log.e("LOGIN_ERROR", "HTTP exception: ${e.code()}", e)
                    showToast("HTTP помилка: ${e.code()}")
                } catch (e: Exception) {
                    Log.e("LOGIN_ERROR", "Exception: ${e.message}", e)
                    showToast("Проблема з сервером")
                }
            }
        }

    }

    private suspend fun showToast(message: String) {
        withContext(Dispatchers.Main) {
            Toast.makeText(this@LoginActivity, message, Toast.LENGTH_SHORT).show()
        }
    }
}