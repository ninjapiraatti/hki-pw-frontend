<template>
	<form @submit.prevent="login">
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input v-model="username"class="form-control" id="username" aria-describedby="emailHelp">
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input v-model="password" type="password" class="form-control" id="password">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
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
