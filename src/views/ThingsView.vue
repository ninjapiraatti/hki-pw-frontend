<template>
	<div class="container-fluid">
		<div class="angled-corner p-4 mb-4 mt-4">
			<h1>Weapons, items, and all such things</h1>
			<ul>
				<li v-for="thing in things" :key="thing.id">
					<router-link :to="`/things/${thing.id}`">{{ thing.title }}</router-link>
				</li>
			</ul>
			<div class="card">
				<p>{{ responseMessage }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Thing } from "@/types"
import { useUserStore } from "@/stores/user"
import { ref, onMounted } from "vue"
import router from "@/router"

const responseMessage = ref("")
const things = ref<Thing[]>([])
const userStore = useUserStore()

const getthings = async () => {
	try {
		const response = await fetch(`https://hki2050.com/api/things`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": import
					.meta
					.env
					.VITE_PW_APIKEY as string,
				"authorization": 'Bearer ' + userStore.jwt,
			},
		})
		if (response.ok) {
			const data = await response.json()
			things.value = data.things
		} else if (response.status === 404) {
			console.warn("No content")
		} else if (response.status === 401) {
			router.push("/login")
		} else {
			throw new Error(`Error: ${response.status} ${response.statusText}`)
		}
	} catch (error) {
		console.error("Error:", error)
	}
}

onMounted(async() => {
	await getthings()
})
</script>
