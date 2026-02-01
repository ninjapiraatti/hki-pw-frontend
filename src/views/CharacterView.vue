<template>
	<div class="character-view">
		<CharacterForm :character="character" :inventory-items="characterInventory" @onSubmit="postCharacter" />
	</div>
</template>

<script setup lang="ts">
import { Character } from "@/types"
import { useUserStore } from "@/stores/user"
import { useThingsStore } from "@/stores/things"
import { onMounted, ref, computed } from "vue"
import { useRoute } from "vue-router"
import CharacterForm from "@/components/CharacterForm.vue"

const route = useRoute()
const userStore = useUserStore()
const thingsStore = useThingsStore()
const character = ref<Character | null>(null)
const loading = ref(false)

const characterId = computed(() => {
	return route.params.id
})

const characterInventory = computed(() => {
	console.log("inv", character.value?.inventory)
  if (!character.value?.inventory) return []
  return thingsStore.getThingsByIds(character.value.inventory.map(String))
})

const getCharacter = async (characterId: string) => {
	try {
		const response = await fetch(`https://hki2050.com/api/characters/${characterId}/`, {
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
			character.value = data as Character
		} else if (response.status === 404) {
			console.warn("Character not found, assigning null.")
			character.value = null
		} else {
			throw new Error(`Error: ${response.status} ${response.statusText}`)
		}
	} catch (error) {
		console.error("Error:", error)
		character.value = null
	}
}

const postCharacter = async (characterPosted: Character) => {
	if (loading.value === true) return
	loading.value = true

	const sanitizedName = characterPosted.title
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')

	const payload = {
		name: sanitizedName,
		id: String(characterId.value),
		title: characterPosted.title,
		body: characterPosted.body,
		strength: characterPosted.strength,
		perception: characterPosted.perception,
		endurance: characterPosted.endurance,
		charisma: characterPosted.charisma,
		intelligence: characterPosted.intelligence,
		agility: characterPosted.agility,
		luck: characterPosted.luck,
		inventory: characterPosted.inventory,
		deutscheMarks: characterPosted.deutscheMarks,
		...(characterPosted.image && { image: characterPosted.image })
	}

	try {
		const isUpdate = character.value !== null
		const url = isUpdate 
			? `https://hki2050.com/api/characters/${characterId.value}/`
			: `https://hki2050.com/api/characters/`
		const method = isUpdate ? "PUT" : "POST"
		
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": import
					.meta
					.env
					.VITE_PW_APIKEY as string,
				"authorization": 'Bearer ' + userStore.jwt,
			},
			body: JSON.stringify(payload),
		})
		if (!response.ok) {
			throw new Error("Network response was not ok")
		}
		const data = await response.json()
		character.value = data as Character
	} catch (error) {
		console.error("Error:", error)
	}
	loading.value = false
}

onMounted(() => {
	if (typeof characterId.value === 'string') {
		getCharacter(characterId.value)
	}
	thingsStore.fetchThings()
})
</script>

<style scoped>
.character-sheet {
	max-width: 800px;
	margin: 0 auto;
}
</style>
