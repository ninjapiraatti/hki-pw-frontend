<template>
	<div class="login-container">
		<div class="login-card angled-corner p-4">
			<h2 class="mb-4">Login</h2>
			<form @submit.prevent="login">
				<div class="mb-3">
					<label for="username" class="form-label">Username</label>
					<input v-model="username" class="form-control" id="username" required>
				</div>
				<div class="mb-3">
					<label for="password" class="form-label">Password</label>
					<input v-model="password" type="password" class="form-control" id="password" required>
				</div>
				<button type="submit" class="btn--glitch btn w-100">
					<span class="btn__content">Login</span>
					<span class="btn__effect"></span>
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from '@/stores/user'
import router from "@/router"

const refreshToken = ref("")
const userStore = useUserStore()
const username = ref("")
const password = ref("")

const login = async () => {
	try {
		const response = await fetch(`https://hki2050.com/api/auth`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": import
					.meta
					.env
					.VITE_PW_APIKEY as string,
				"authorization": 'Basic ' + btoa(username.value + ':' + password.value),
			},
		})
		if (response.ok) {
			const data = await response.json()
			refreshToken.value = data.refresh_token
      await getAccessToken()
		} else {
			throw new Error(`Error: ${response.status} ${response.statusText}`)
		}
	} catch (error) {	
		console.error("Error:", error)
	}
}

const getAccessToken = async () => {
	try {
		const response = await fetch(`https://hki2050.com/api/auth/access`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": import
					.meta
					.env
					.VITE_PW_APIKEY as string,
				"authorization": 'Bearer ' + refreshToken.value,
			},
		})
		if (response.ok) {
			const data = await response.json()
			userStore.setToken(data.access_token)
      router.push("/")
		} else {
			throw new Error(`Error: ${response.status} ${response.statusText}`)
		}
	} catch (error) {
		console.error("Error:", error)
	}
}
</script>

<style scoped lang="scss">
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: calc(100vh - 200px);
	padding: 2rem;
}

.login-card {
	width: 100%;
	max-width: 400px;
}
</style>
