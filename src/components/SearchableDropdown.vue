<template>
  <div class="searchable-dropdown" ref="dropdownRef">
    <div class="dropdown-input-container">
      <input
        type="text"
        v-model="searchQuery"
        @focus="isOpen = true"
        @input="filterItems"
        :placeholder="placeholder"
        class="form-control dropdown-input"
        autocomplete="off"
      />
      <button
        type="button"
        @click="toggleDropdown"
        class="btn btn-outline-secondary dropdown-toggle-btn"
        :class="{ 'rotated': isOpen }"
      >
        ▼
      </button>
    </div>
    
    <div v-if="isOpen" class="dropdown-menu show">
      <div v-if="loading" class="dropdown-item-text">
        Loading...
      </div>
      <div v-else-if="filteredItems.length === 0" class="dropdown-item-text">
        No items found
      </div>
      <template v-else>
        <button
          v-for="item in filteredItems"
          :key="item.id"
          type="button"
          class="dropdown-item"
          @click="selectItem(item)"
        >
          <div class="item-title">{{ item.title }}</div>
          <div v-if="item.body" class="item-description">{{ truncateText(item.body, 50) }}</div>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Listable } from '@/types'

interface Props {
  items: Listable[]
  loading?: boolean
  placeholder?: string
  modelValue?: Listable | null
}

interface Emits {
  (e: 'update:modelValue', value: Listable | null): void
  (e: 'select', value: Listable): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  placeholder: 'Search items...',
  modelValue: null
})

const emit = defineEmits<Emits>()

const dropdownRef = ref<HTMLElement>()
const searchQuery = ref('')
const isOpen = ref(false)

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.items.slice(0, 10) // Show first 10 items when no search
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.items.filter(item => 
    item.title.toLowerCase().includes(query) ||
    (item.body && item.body.toLowerCase().includes(query))
  ).slice(0, 10) // Limit to 10 results
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectItem = (item: Listable) => {
  searchQuery.value = item.title
  isOpen.value = false
  emit('update:modelValue', item)
  emit('select', item)
}

const filterItems = () => {
  isOpen.value = true
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for external changes to modelValue
computed(() => {
  if (props.modelValue) {
    searchQuery.value = props.modelValue.title
  } else {
    searchQuery.value = ''
  }
})
</script>

<style scoped>
.searchable-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-input-container {
  display: flex;
  align-items: center;
}

.dropdown-input {
  flex: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.dropdown-toggle-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;
  padding: 0.375rem 0.75rem;
  transition: transform 0.2s ease;
}

.dropdown-toggle-btn.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1050;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  text-decoration: none;
}

.dropdown-item:hover,
.dropdown-item:focus {
  color: #1e2125;
  background-color: #e9ecef;
}

.dropdown-item-text {
  display: block;
  padding: 0.5rem 1rem;
  color: #6c757d;
  white-space: nowrap;
}

.item-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-description {
  font-size: 0.875rem;
  color: #6c757d;
  white-space: normal;
}
</style>
