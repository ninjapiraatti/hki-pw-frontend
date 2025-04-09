<template>
  <div class="container-fluid p-5">
    <h1 class="mb-3">Articles</h1>
    <MasonryListing
			baseUrl="articles"
      :items="articles"
      :ssr-columns="1"
      :column-width="300"
      :gap="48"
    />
  </div>
	<div class="card">
		<p>{{ responseMessage }}</p>
	</div>
</template>

<script setup lang="ts">
import { Listable } from "@/types"
import { useUserStore } from "@/stores/user"
import { ref, onMounted } from "vue"
import router from "@/router"
import MasonryListing from "@/components/MasonryListing.vue"

const responseMessage = ref("")
const articles = ref<Listable[]>([])
const userStore = useUserStore()

const getArticles = async () => {
	try {
		const response = await fetch(`https://hki2050.com/api/articles`, {
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
			articles.value = data.articles
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
	await getArticles()
})
</script>
