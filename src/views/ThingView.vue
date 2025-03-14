<template>
	<div class="container-fluid">
		<div class="angled-corner p-4 mb-4 mt-4">
			<h1>{{ thing?.title }}</h1>
			<div v-html="thingBody" class="text-start"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Thing } from "@/types"
import { useUserStore } from "@/stores/user"
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import router from "@/router"

const thing = ref<Thing>()
const userStore = useUserStore()
const route = useRoute()
const thingBody = computed(() => thing.value?.body)

const getthing = async (thingId: string) => {
	try {
		const response = await fetch(`https://hki2050.com/api/things/${thingId}`, {
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
			thing.value = data
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
	await getthing(route.params.id as string)
})
</script>
