<template>
	<div class="container-fluid">
		<div class="angled-corner p-4 mb-4 mt-4">
			<h1>{{ article?.title }}</h1>
			<div v-html="articleBody" class="text-start"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Article } from "@/types"
import { useUserStore } from "@/stores/user"
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import router from "@/router"

const article = ref<Article>()
const userStore = useUserStore()
const route = useRoute()
const articleBody = computed(() => article.value?.body)

const getArticle = async (articleId: string) => {
	try {
		const response = await fetch(`https://hki2050.com/api/articles/${articleId}`, {
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
			article.value = data
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
	await getArticle(route.params.id as string)
})
</script>
