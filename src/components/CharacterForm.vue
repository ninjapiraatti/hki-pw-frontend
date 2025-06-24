<template>
	<div class="container character-sheet mt-4">
		inv: {{ inventoryItems }}
		<form @submit.prevent="submitForm">
			<div class="angled-corner p-3">
				<div class="mb-4 character-header d-flex justify-content-between align-items-center">
					<div v-if="editMode">
						<label for="name" class="col-sm-2 col-form-label">Name</label>
						<input type="text" class="form-control" id="name" v-model="form.name" required />
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
							<div v-if="imageUrl.length">
								<img :src="imageUrl" class="mb-3 character-image" :alt="form.name || 'Character portrait'" />
							</div>
							<div v-if="editMode" class="mb-3 w-100 row">
								<label for="image" class="form-label">Picture</label>
								<input class="form-control" type="file" id="image" @change="onImageChange" />
							</div>
						</div>
					</div>
					<div class="col-12 col-md-6">
						<h4 class="text-muted mb-4">Character Stats</h4>
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
							<div v-else class="stat-display">
								<div class="d-flex justify-content-between align-items-center">
									<span class="text-capitalize stat-label">{{ stat }}</span>
									<div class="stat-bars">
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
									<span class="stat-value">
										{{ form[stat] }}
										<span v-if="getAttributeBonus(stat) !== 0" class="stat-bonus">
											({{ getModifiedAttributeValue(stat) }})
										</span>
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
						<p>{{ form.body || "No bio available" }}</p>
					</div>
				</div>
			</div>

			<div class="skills-section angled-corner p-4 mb-4">
				<h4 class="text-muted mb-4">Skills</h4>
				<table class="table">
					<thead>
						<tr>
							<th>Skill</th>
							<th>Formula</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(skill, index) in skillsList" :key="index">
							<td>{{ skill.name }}</td>
							<td class="text-muted">{{ getSkillFormulaDisplay(skill) }}</td>
							<td class="font-weight-bold">{{ calculateSkillValue(skill) }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="inventory-section angled-corner p-4 mb-4">
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
					<h5 class="text-muted mb-3">Current Items</h5>
					<div class="row">
						<div v-for="item in characterInventory" :key="item.id" class="col-md-6 col-lg-4 mb-3">
							<div class="card bg-dark-subtle">
								<div class="card-body">
									<h6 class="card-title">{{ item.title }}</h6>
									<p class="card-text small">{{ item.body ? truncateText(item.body, 80) : 'No description' }}</p>
									<button 
										v-if="editMode"
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

			<div v-if="editMode" class="text-center">
				<button type="submit" @click="submitForm" class="btn btn-primary">
					{{ character ? "Update Character" : "Create Character" }}
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, computed, onMounted } from "vue"
import { Character, Thing, Listable } from "@/types"
import { PencilIcon } from "@heroicons/vue/24/outline"
import { useUserStore } from "@/stores/user"
import { useThingsStore } from "@/stores/things"
import SearchableDropdown from "@/components/SearchableDropdown.vue"

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
	editMode.value = !editMode.value
}

const onImageChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (target.files && target.files.length > 0) {
		form.value.image = target.files[0]
	}
}

const imageUrl = computed(() => {
	const baseUrl = "http://localhost:8888"
	return props.character?.image ? `${baseUrl}${props.character.image}` : ""
})

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

<style scoped>
.character-sheet {
	max-width: 800px;
	margin: 0 auto;
}

.character-header {
	margin-bottom: 1rem;
}

.character-image {
	max-width: 100%;
	border-radius: 5px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.stat-display {
	padding: 0.5rem;
	border-radius: 4px;
}

.stat-label {
	font-weight: bold;
	width: 120px;
}

.stat-bars {
	display: flex;
	flex-grow: 1;
	margin: 0 1rem;
	gap: 3px;
}

.stat-bar {
	height: 20px;
	width: 100%;
	background-color: rgba(255, 255, 255, 0.1);
	transition: background-color 0.3s ease;
}

.stat-bar.filled {
	background-color: var(--magenta-color, #ff147f);
}

.stat-bar.bonus-filled {
	background-color: var(--cyan-color, #00f0ff);
}

.stat-value {
	width: 80px;
	text-align: right;
}

.stat-bonus {
	color: var(--cyan-color, #00f0ff);
	font-weight: bold;
	margin-left: 0.25rem;
}

.skills-section {
	margin-top: 2rem;
}

.skill-formula {
	font-size: 0.85rem;
	width: 80px;
	text-align: center;
}

.skill-value {
	width: 50px;
	text-align: right;
	font-weight: bold;
}

.inventory-section {
	margin-top: 2rem;
}

.card {
	cursor: pointer;
	transition: transform 0.2s;
}

.card:hover {
	transform: translateY(-2px);
}
</style>
