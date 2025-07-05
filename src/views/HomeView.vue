<template>
	<div class="container text-center">
		<div class="w-100 my-4">
			<img class="logo" src="../assets/logo.png" alt="HKI2050 logo" />
		</div>
		<div class="angled-corner text-start p-4 mb-4">
			<p>The November rain falls heavy. In the city below, the delusional promises of the early 21st century never came true. Too easily, those with power took, and those without paid the price.</p>
			<p>Helsinki is a very different place now. The institutions, infrastructure, and charm of the Pearl of the Baltic Sea are a thing of the past, replaced by a despairing melancholy, vile corporations, corrupt officials, and ruthless factions.</p>
			<p>Yet, hope dies hard. Hope is the senseless fuel in the form of a warm bowl of hernekeitto-ramen in the steamy bazaars of Nether Helsinki. Hope is why they're trying to rob you in the flooded highrises of Ruoholahti. And ultimately, hope is what will claim you in HKI2050.</p>
		</div>
		<router-link :to="characterLink">
			<button type="button" class="btn--glitch btn" role="link">
				<span class="btn__content">Create Character</span>
				<span class="btn__effect"></span>
				<span class="btn__label">
					<PlusCircleIcon class="btn__label__icon" />
				</span>
			</button>
		</router-link>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { v4 as uuidv4 } from "uuid"
import { PlusCircleIcon } from "@heroicons/vue/24/outline"

const mainContent = ref("")

const characterLink = computed(() => {
	const characterId = uuidv4()
	return `/characters/${characterId}`
})

/*
const getIntro = async () => {
	console.log("env apikey", import.meta.env.VITE_PW_APIKEY)
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
			mainContent.value = data.body
		} else if (response.status === 404) {
			console.warn("No content")
		} else {
			throw new Error(`Error: ${response.status} ${response.statusText}`)
		}
	} catch (error) {
		console.error("Error:", error)
	}
}
*/
</script>
