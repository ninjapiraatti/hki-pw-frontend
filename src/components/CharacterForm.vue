<template>
	<div class="m-4">
		<form @submit.prevent="submitForm" class="container-fluid">
			<div class="row g-4">
				<div class="col-12 col-lg-6">
					<div class="angled-corner p-3">
						<div class="mb-4 character-header d-flex justify-content-between align-items-center">
							<div v-if="editMode">
								<label for="name" class="col-sm-2 col-form-label">Name</label>
								<input type="text" class="form-control" id="name" v-model="form.title" required />
							</div>
							<div v-else>
								<h1 class="display-6">{{ form.title || "Unnamed Character" }}</h1>
							</div>
							<button type="button" class="btn--glitch btn" @click="toggleEditMode">
								<span class="btn__content">{{ `${editMode ? 'Done' : 'Edit'}` }}</span>
								<span class="btn__effect"></span>
								<span class="btn__label">
									<PencilIcon class="btn__label__icon" />
								</span>
							</button>
						</div>
			
						<div class="row">
							<div class="col-12 col-md-6">
								<div class="mb-4">
									<img 
										:src="imageUrl" 
										class="mb-3 character-image w-100" 
										:alt="form.name || 'Character portrait'"
										@error="handleImageError"
									/>
									<div v-if="editMode" class="mb-3 w-100 row">
										<label for="image" class="form-label">Picture</label>
										<input class="form-control" type="file" id="image" accept="image/jpeg,image/png,image/gif,image/webp" @change="onImageChange" />
									</div>
								</div>
							</div>
							<div class="col-12 col-md-6">
								<div v-for="(stat, index) in stats" :key="index">
										<div v-if="editMode" class="w-100 row">
										<label :for="stat" class="col-sm-4 col-form-label text-capitalize">{{ stat }}</label>
										<div class="col-sm-8">
											<input
												type="number"
												class="form-control"
												:id="stat"
												v-model.number="form[stat]"
												min="1"
												max="10"
												required
											/>
										</div>
									</div>
									<div v-else class="stat-display row">
										<div class="text-capitalize stat-label col-4 col-lg-6 order-0">{{ stat }}</div>
										<div class="stat-bars col-5 col-lg-12 order-1 order-lg-2 mb-3">
											<div 
												v-for="n in 10" 
												:key="n" 
												class="stat-bar" 
												:class="{ 
													'filled': n <= form[stat], 
													'bonus-filled': n > form[stat] && n <= getModifiedAttributeValue(stat) 
												}"
											></div>
										</div>
										<div class="text-end col-3 col-lg-6 order-2 order-lg-1">

											<span :class="getAttributeBonus(stat) !== 0 ? 'stat-bonus' : 'stat-normal'">
												{{ getModifiedAttributeValue(stat) }}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="mb-4">
							<div v-if="editMode" class="w-100 row">
								<label for="bio" class="col-sm-2 col-form-label">Bio</label>
								<div class="col-sm-10">
									<textarea class="form-control" id="bio" name="bio" v-model="form.body" required />
								</div>
							</div>
							<div v-else>
								<h4 class="text-muted mb-2">Bio</h4>
								<div v-html="parsedBio"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-lg-3">
					<div class="angled-corner p-3">
						<h4 class="text-muted mb-4">Skills</h4>
						<table class="table w-100">
							<thead class="visually-hidden">
								<tr>
									<th>Skill Name</th>
									<th>Value</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(skill, index) in skillsList" :key="index">
									<td>{{ skill.name }}</td>
									<td class="font-weight-bold text-end">
										{{ calculateSkillValue(skill) }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="col-12 col-lg-3">
					<div class="angled-corner p-3">
						<h4 class="text-muted mb-4">Inventory</h4>
						
						<div v-if="editMode" class="mb-3">
							<div class="form-label mb-2">Add Item to Inventory</div>
							<SearchableDropdown
								:items="thingsStore.things"
								:loading="thingsStore.loading"
								placeholder="Search for items..."
								@select="addItemToInventory"
							/>
						</div>
						
						<div v-if="characterInventory.length > 0">
							<div v-for="item in characterInventory" :key="item.id" class="mb-5">
								<div class="row g-2 position-relative">
									<div class="col-3">
										<img 
											:src="itemImageUrl(item.id)"
											class="w-100"
											:alt="item.title"
										/>
										<div v-if="item.damage" class="damage-pill">
											{{ item.damage }}
										</div>
									</div>
									<div class="col-9">
										<h6 class="inventory-title">{{ item.title }}</h6>
										<span v-for="effect in item.attributeEffects" class="attribute-pill">
											{{ effect.target.substring(0, 3).toUpperCase() }} {{ effect.strength > 0 ? '+' : '-' }}{{ effect.strength }}
										</span>
										<span v-for="effect in item.skillEffects" class="skill-pill">
											{{ effect.target }} {{ effect.strength > 0 ? '+' : '-' }}{{ effect.strength }}
										</span>
									</div>
									<button 
										@click="removeItemFromInventory(item.id)" 
										class="btn btn--icon inventory-remove-button"
									>
										<XMarkIcon class="btn--icon__icon" />
									</button>
								</div>
							</div>
						</div>
						<div v-else>
							<p class="text-muted">No items in inventory</p>
						</div>
					</div>
				</div>
			</div>

		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, computed, onMounted } from "vue"
import { Character, Thing, Listable } from "@/types"
import { PencilIcon } from "@heroicons/vue/24/outline"
import { XMarkIcon } from "@heroicons/vue/24/solid"
import { useUserStore } from "@/stores/user"
import { useThingsStore } from "@/stores/things"
import SearchableDropdown from "@/components/SearchableDropdown.vue"
import { marked } from 'marked'

const emit = defineEmits(["onSubmit"])
const props = defineProps<{
	character?: Character | null
	inventoryItems?: Thing[]
}>()

const userStore = useUserStore()
const thingsStore = useThingsStore()

// Inventory-related computed properties
const characterInventory = computed(() => {
  if (!form.value?.inventory) return []
  return thingsStore.getThingsByIds(form.value.inventory)
})

// Markdown parsing for bio display (never fed back to form)
const parsedBio = computed(() => {
  if (!form.value?.body) return 'No bio available'
  return marked(form.value.body)
})

// Inventory functions
const addItemToInventory = (item: Listable) => {
	if (!form.value) return
	
	if (!form.value.inventory) {
		form.value.inventory = []
	}
	
	if (!form.value.inventory.includes(item.id)) {
		form.value.inventory.push(item.id)
	}
}

const removeItemFromInventory = (itemId: string) => {
	if (!form.value?.inventory) return
	
	const index = form.value.inventory.indexOf(itemId)
	if (index > -1) {
		form.value.inventory.splice(index, 1)
	}
}

const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text
	return text.substring(0, maxLength) + '...'
}

const stats = ["strength", "perception", "endurance", "charisma", "intelligence", "agility", "luck"] as const
type Stat = typeof stats[number]

interface Skill {
	name: string;
	formula: [Stat, Stat];
}

const skillsList: Skill[] = [
	{ name: "Brute Force", formula: ["strength", "strength"] },
	{ name: "Wrestle", formula: ["strength", "endurance"] },
	{ name: "Melee", formula: ["strength", "agility"] },
	{ name: "Drunken Fight", formula: ["strength", "luck"] },
	{ name: "Firearms", formula: ["perception", "agility"] },
	{ name: "Lockpicking", formula: ["perception", "perception"] },
	{ name: "Outdoorsmanship", formula: ["perception", "endurance"] },
	{ name: "Medical", formula: ["perception", "intelligence"] },
	{ name: "Investigation", formula: ["perception", "intelligence"] },
	{ name: "Mechanics", formula: ["perception", "agility"] },
	{ name: "Health", formula: ["endurance", "endurance"] },
	{ name: "Stealth", formula: ["endurance", "agility"] },
	{ name: "Sustained strength", formula: ["endurance", "strength"] },
	{ name: "Sex", formula: ["endurance", "charisma"] },
	{ name: "Persuasion", formula: ["charisma", "charisma"] },
	{ name: "Bartering", formula: ["charisma", "intelligence"] },
	{ name: "Street smarts", formula: ["charisma", "intelligence"] },
	{ name: "Distraction", formula: ["charisma", "luck"] },
	{ name: "Performance", formula: ["charisma", "luck"] },
	{ name: "Hacking", formula: ["intelligence", "intelligence"] },
	{ name: "Stealing", formula: ["agility", "agility"] },
	{ name: "Initiative", formula: ["agility", "luck"] },
	{ name: "Critical hits", formula: ["luck", "luck"] },
	{ name: "Gambling", formula: ["luck", "intelligence"] },
]

const calculateSkillValue = (skill: Skill): number => {
	const baseAttr1 = form.value[skill.formula[0]] || 1
	const baseAttr2 = form.value[skill.formula[1]] || 1
	
	const attr1Bonus = getAttributeBonus(skill.formula[0])
	const attr2Bonus = getAttributeBonus(skill.formula[1])
	
	const skillBonus = getSkillBonus(skill.name)
	
	return (baseAttr1 + attr1Bonus + baseAttr2 + attr2Bonus) * 3 + skillBonus
}

const getAttributeBonus = (attributeName: Stat): number => {
	return characterInventory.value.reduce((total, item) => {
		if (!item.attributeEffects) return total
		
		const effect = item.attributeEffects.find(
			effect => effect.target.toLowerCase() === attributeName.toLowerCase()
		)
		
		return total + (effect?.strength || 0)
	}, 0)
}

const getSkillBonus = (skillName: string): number => {
	return characterInventory.value.reduce((total, item) => {
		if (!item.skillEffects) return total
		
		const effect = item.skillEffects.find(
			effect => effect.target.toLowerCase() === skillName.toLowerCase()
		)
		
		return total + (effect?.strength || 0)
	}, 0)
}

const getModifiedAttributeValue = (attributeName: Stat): number => {
	const baseValue = form.value[attributeName] || 1
	const bonus = getAttributeBonus(attributeName)
	return baseValue + bonus
}

const getSkillFormulaDisplay = (skill: Skill): string => {
	const attr1 = skill.formula[0].substring(0, 3).toUpperCase()
	const attr2 = skill.formula[1].substring(0, 3).toUpperCase()
	return `${attr1} + ${attr2}`
}

const editMode = ref(props.character === null)
const toggleEditMode = () => {
	if (editMode.value) {
		// If we're currently in edit mode and clicking "Done", submit the form
		submitForm()
	} else {
		// If we're not in edit mode and clicking "Edit", enter edit mode
		editMode.value = true
	}
}

const portraitPreview = ref<string | null>(null)

const onImageChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (target.files && target.files.length > 0) {
		const file = target.files[0]
		form.value.image = file

		// Convert to base64 for API submission
		const reader = new FileReader()
		reader.onload = (e) => {
			const result = e.target?.result as string
			form.value.uploadImage = result
			portraitPreview.value = result
		}
		reader.readAsDataURL(file)
	}
}

const imageUrl = computed(() => {
	// Show preview of newly selected file first
	if (portraitPreview.value) {
		return portraitPreview.value
	}
	// Show existing image from server (first image in the Record)
	if (props.character?.images) {
		const firstImage = Object.values(props.character.images)[0]
		if (firstImage) return firstImage
	}
	return new URL('../assets/placeholder.jpg', import.meta.url).href
})

const itemImageUrl = (itemId: string) => {
	const baseUrl = "http://localhost:8888"
	return new URL('../assets/square5.jpg', import.meta.url).href
}

const handleImageError = (event: Event) => {
	const target = event.target as HTMLImageElement
	target.src = new URL('../assets/placeholder.jpg', import.meta.url).href
}

const form = ref<Character>({
	id: props.character?.id || "",
	title: "",
	body: "",
	created: new Date().toISOString(),
	updated: new Date().toISOString(),
	name: "",
	bio: "",
	image: null,
	strength: 1,
	perception: 1,
	endurance: 1,
	charisma: 1,
	intelligence: 1,
	agility: 1,
	luck: 1,
	deutscheMarks: 0,
	inventory: [],
})

watch(
	() => props.character,
	(newCharacter) => {
		if (newCharacter) {
			form.value = { ...newCharacter }
			editMode.value = false
			portraitPreview.value = null
		}
	}
)

const submitForm = () => {
	console.log("submitting")
	emit("onSubmit", form.value)
	editMode.value = false
}

onMounted(() => {
	thingsStore.fetchThings()
})
</script>

<style scoped lang="scss">

.stat-bars {
	display: flex;
	flex-grow: 1;
	gap: 3px;
}

.stat-bar {
	height: 20px;
	width: 100%;
	background-color: rgba(255, 255, 255, 0.1);
	transition: background-color 0.3s ease;
}

.stat-bar.filled {
	background-color: $magenta;
}

.stat-bar.bonus-filled {
	background-color: $cyan;
}

.stat-bonus, .stat-normal {
	font-weight: bold;
	margin-left: 0.25rem;
}

.stat-bonus {
	color: $cyan;
}

.stat-normal {
	color: $magenta;
}

.inventory-title {
	font-size: 0.8rem;
	font-weight: 700;
	margin-bottom: 0.25rem;
}

.inventory-description {
	font-size: 0.75rem;
}

.inventory-remove-button {
	position: absolute;
	top: 0.5rem;
	right: 0.1rem;
	z-index: 2;
}
</style>
