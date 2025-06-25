import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Thing } from '@/types'
import { useUserStore } from '@/stores/user'

export const useThingsStore = defineStore('things', () => {
  const things = ref<Thing[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<Date | null>(null)
  
  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000

  const fetchThings = async (forceRefresh = false) => {
    const userStore = useUserStore()
    
    // Check if we have cached data and it's still fresh
    if (!forceRefresh && things.value.length > 0 && lastFetched.value) {
      const timeSinceLastFetch = Date.now() - lastFetched.value.getTime()
      if (timeSinceLastFetch < CACHE_DURATION) {
        return things.value
      }
    }

    loading.value = true
    error.value = null

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
        lastFetched.value = new Date()
      } else if (response.status === 404) {
        console.warn("No things found")
        things.value = []
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch things'
      console.error("Error fetching things:", err)
    } finally {
      loading.value = false
    }

    return things.value
  }

  const getThingById = (id: string) => {
    return things.value.find(thing => thing.id === id)
  }

  const getThingsByIds = (ids: string[]) => {
    return things.value.filter(thing => ids.includes(String(thing.id)))
  }

  const clearCache = () => {
    things.value = []
    lastFetched.value = null
    error.value = null
  }

  return {
    // State
    things,
    loading,
    error,
    lastFetched,
    
    // Actions
    fetchThings,
    getThingById,
    getThingsByIds,
    clearCache
  }
})
