<template>
	<div class="container character-sheet">
		<div class="d-flex justify-content-end mb-3">
			<button @click="toggleEditMode" class="btn" :class="{'btn-primary': editMode, 'btn-outline-primary': !editMode}">
				<template v-if="editMode">Done</template>
				<template v-else>Edit</template>
			</button>
		</div>
		
		<form @submit.prevent="submitForm">
			<div class="mb-4 character-header">
				<div v-if="editMode" class="w-100 row">
					<label for="name" class="col-sm-2 col-form-label">Name</label>
					<div class="col-sm-10">
						<input type="text" class="form-control" id="name" v-model="form.name" required />
					</div>
				</div>
				<div v-else class="angled-corner p-3">
					<h1 class="display-4">{{ form.name || "Unnamed Character" }}</h1>
				</div>
			</div>

			<div class="mb-4">
				<div v-if="editMode" class="w-100 row">
					<label for="bio" class="col-sm-2 col-form-label">Bio</label>
					<div class="col-sm-10">
						<textarea class="form-control" id="bio" name="bio" v-model="form.body" required />
					</div>
				</div>
				<div v-else class="angled-corner p-3">
					<h4 class="text-muted mb-2">Bio</h4>
					<p>{{ form.body || "No bio available" }}</p>
				</div>
			</div>

			<div class="mb-4">
				<div v-if="imageUrl.length">
					<img :src="imageUrl" class="mb-3 character-image" />
				</div>
				<div v-if="editMode" class="mb-3 w-100 row">
					<label for="image" class="form-label">Picture</label>
					<input class="form-control" type="file" id="image" @change="onImageChange" />
				</div>
			</div>

			<div class="stats-section angled-corner p-4 mb-4">
				<h4 class="text-muted mb-4">Character Stats</h4>
				<div class="row">
					<div v-for="(stat, index) in stats" :key="index" class="col-md-6 mb-3">
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
										:class="{ 'filled': n <= form[stat] }"
									></div>
								</div>
								<span class="stat-value">{{ form[stat] }}/10</span>
							</div>
						</div>
					</div>
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
import { ref, watch, defineProps, computed } from "vue"
import { Character } from "@/types"

const emit = defineEmits(["onSubmit"])
const props = defineProps<{
	character?: Character | null
}>()

const stats = ["strength", "perception", "endurance", "charisma", "intelligence", "agility", "luck"] as const
type Stat = typeof stats[number]

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

.stat-value {
	width: 50px;
	text-align: right;
}
</style>
