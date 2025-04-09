<template>
  <div class="container-fluid p-5">
    <h1 class="mb-3">Weapons, items, and all such things</h1>
    <MasonryListing
      baseUrl="things"
      :items="things"
      :ssr-columns="1"
      :column-width="300"
      :gap="48"
    />
  </div>
</template>

<script setup lang="ts">
import { Listable } from "@/types"
import { useUserStore } from "@/stores/user"
import { ref, onMounted, computed } from "vue"
import router from "@/router"
import MasonryListing from "@/components/MasonryListing.vue"

const things = ref<Listable[]>([])
const userStore = useUserStore()
const rnd5 = computed(() => Math.floor(Math.random() * 5) + 1)
const isLocalEnvironment = computed(() => import.meta.env.DEV)

const getThings = async () => {
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

const createDummyItems = () => {
  for (let i = 0; i < 12; i++) {
    things.value.push({
      id: `i`,
      title: `Dummy item ${i}`,
      body: getDummyText(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    })
  }
}

const getDummyText = () => {
  const text = [
    "Lorem ipsum dolor sit amet, conset.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex e dunt ut labore et dolore magna dunt ut labore et dolore magna  a commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  ]
  return text[Math.floor(Math.random() * text.length)]
}

onMounted(async() => {
	await getThings()
  if (isLocalEnvironment.value) {
    createDummyItems()
  }
})
</script>
