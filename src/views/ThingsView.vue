<template>
  <div class="container-fluid p-5">
    <h1 class="mb-3">Weapons, items, and all such things</h1>
    <ThingListing
      baseUrl="things"
      :items="things"
      :ssr-columns="4"
      :column-width="180"
      :gap="48"
    />
  </div>
</template>

<script setup lang="ts">
import { Listable } from "@/types"
import { useThingsStore } from "@/stores/things"
import { ref, onMounted, computed } from "vue"
import ThingListing from "@/components/ThingListing.vue"

const thingsStore = useThingsStore()
const localThings = ref<Listable[]>([])
const isLocalEnvironment = computed(() => import.meta.env.DEV)

// Combine store things with local dummy items for development
const things = computed(() => [...thingsStore.things, ...localThings.value])

const createDummyItems = () => {
  for (let i = 0; i < 12; i++) {
    localThings.value.push({
      id: `dummy-${i}`,
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
	await thingsStore.fetchThings()
  if (isLocalEnvironment.value) {
    createDummyItems()
  }
})
</script>
