<template>
	<div class="character-view">
		<CharacterForm :character="character" :inventory-items="characterInventory" @onSubmit="postCharacter" />
		
		<div class="container character-sheet mt-4" v-if="character">
			<div class="angled-corner p-4 mb-4">
				<h4 class="text-muted mb-4">Inventory</h4>
				
				<div class="mb-3">
					<div class="form-label mb-2">Add Item to Inventory</div>
					<SearchableDropdown
						:items="things"
						:loading="thingsLoading"
						placeholder="Search for items..."
						@select="addItemToInventory"
					/>
				</div>
				
				<div v-if="characterInventory.length > 0">
					<h5 class="text-muted mb-3">Current Items</h5>
					<div class="row">
						<div v-for="item in characterInventory" :key="item.id" class="col-md-6 col-lg-4 mb-3">
							<div class="card bg-dark-subtle">
								<div class="card-body">
									<h6 class="card-title">{{ item.title }}</h6>
									<p class="card-text small">{{ item.body ? truncateText(item.body, 80) : 'No description' }}</p>
									<button 
										@click="removeItemFromInventory(item.id)" 
										class="btn btn-sm btn-outline-danger"
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else>
					<p class="text-muted">No items in inventory</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Character, Listable, Thing } from "@/types"
import { useUserStore } from "@/stores/user"
import { onMounted, ref, computed } from "vue"
import { useRoute } from "vue-router"
import CharacterForm from "@/components/CharacterForm.vue"
import SearchableDropdown from "@/components/SearchableDropdown.vue"

const route = useRoute()
const userStore = useUserStore()
const character = ref<Character | null>(null)
const loading = ref(false)

const characterId = computed(() => {
	return route.params.id
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

const postCharacter = async (newCharacter: Character) => {
	if (loading.value === true) return
	loading.value = true
	const formData = new FormData()

	formData.append("name", newCharacter.name)
	formData.append("id", String(characterId.value))
	formData.append("bio", newCharacter.bio)
	if (newCharacter.image) {
		formData.append("image", newCharacter.image)
	}
	formData.append("strength", String(newCharacter.strength))
	formData.append("perception", String(newCharacter.perception))
	formData.append("endurance", String(newCharacter.endurance))
	formData.append("charisma", String(newCharacter.charisma))
	formData.append("intelligence", String(newCharacter.intelligence))
	formData.append("agility", String(newCharacter.agility))
	formData.append("luck", String(newCharacter.luck))

	try {
		let url = ""
		if (character.value) {
			url = `http://localhost:8888/hki-pw/characters/${characterId.value}/`
		} else {
			url = `http://localhost:8888/hki-pw/characters/`
		}
		const response = await fetch(url, {
			method: "POST",
			body: formData,
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

const things = ref<Thing[]>([])
const thingsLoading = ref(false)
const selectedInventoryItems = ref<string[]>([])

const characterInventory = computed(() => {
  if (!character.value?.inventory) return []
  return things.value.filter(thing => character.value!.inventory.includes(thing.id))
})

const getThings = async () => {
	thingsLoading.value = true
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
			console.warn("No things found")
		} else {
			throw new Error(`Error: ${response.status} ${response.statusText}`)
		}
	} catch (error) {
		console.error("Error fetching things:", error)
	} finally {
		thingsLoading.value = false
	}
}

const addItemToInventory = (item: Listable) => {
	if (!character.value) return
	
	if (!character.value.inventory) {
		character.value.inventory = []
	}
	
	if (!character.value.inventory.includes(item.id)) {
		character.value.inventory.push(item.id)
		updateCharacterInventory()
	}
}

const removeItemFromInventory = (itemId: string) => {
	if (!character.value?.inventory) return
	
	const index = character.value.inventory.indexOf(itemId)
	if (index > -1) {
		character.value.inventory.splice(index, 1)
		updateCharacterInventory()
	}
}

const updateCharacterInventory = async () => {
	if (!character.value || loading.value) return
	
	const formData = new FormData()
	formData.append("name", character.value.name)
	formData.append("id", String(characterId.value))
	formData.append("bio", character.value.bio)
	formData.append("inventory", JSON.stringify(character.value.inventory))
	
	if (character.value.image) {
		formData.append("image", character.value.image)
	}
	
	// Add all the stats
	formData.append("strength", String(character.value.strength))
	formData.append("perception", String(character.value.perception))
	formData.append("endurance", String(character.value.endurance))
	formData.append("charisma", String(character.value.charisma))
	formData.append("intelligence", String(character.value.intelligence))
	formData.append("agility", String(character.value.agility))
	formData.append("luck", String(character.value.luck))

	try {
		const url = `http://localhost:8888/hki-pw/characters/${characterId.value}/`
		const response = await fetch(url, {
			method: "POST",
			body: formData,
		})
		if (!response.ok) {
			throw new Error("Failed to update character inventory")
		}
	} catch (error) {
		console.error("Error updating inventory:", error)
	}
}

const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text
	return text.substring(0, maxLength) + '...'
}

onMounted(() => {
	if (typeof characterId.value === 'string') {
		getCharacter(characterId.value)
	}
	getThings()
})
</script>

<style scoped>
.character-sheet {
	max-width: 800px;
	margin: 0 auto;
}
</style>
