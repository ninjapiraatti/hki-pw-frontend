<template>
  <masonry-wall :items="items" :ssr-columns="ssrColumns" :column-width="columnWidth" :gap="gap">
    <template #default="{ item, index }">
      <div class="card bg-dark-subtle p-2">
        <img
          v-if="item.images && (Object.keys(item.images).length > 0)"
          class="card-img-top w-100" :src="`${Object.values(item.images)[0]}`"
          alt="thing.title"
        />
        <img v-else class="card-img-top w-100" :src="`../app/src/assets/square${index + 1 < 6 ? index + 1 : 4}.jpg`" alt="thing.title" />
        <div class="card-body">
          <h5 class="card-title">
            <router-link class="hover-swipe card-title" :to="`/${baseUrl}/${item.id}`">{{ item.title }}</router-link>
          </h5>
          <p class="small">{{ item.ingress }}</p>
          <div v-if="item.attributeEffects?.length" class="mb-2">
            <span class="badge bg-secondary me-2 p-1 small" v-for="(effect, i) in item.attributeEffects" :key="i">
              {{ getAttributeAbbreviaton(effect.target) }} {{ effect.strength}}
            </span>
          </div>
          <div v-if="item.skillEffects?.length">
            <span class="badge bg-secondary small p-1" v-for="(effect, i) in item.skillEffects" :key="i">
              {{ effect.target }} {{ effect.strength}}
            </span>
          </div>
          <div v-if="item.damage" class="mt-2">
            <p class="card-text">Damage: {{ item.damage }}</p>
          </div>
        </div>
      </div>
    </template>
  </masonry-wall>
</template>

<script setup lang="ts">
import { Thing } from "@/types"

defineProps<{
  baseUrl: string;
  items: Thing[];
  ssrColumns: number;
  columnWidth: number;
  gap: number;
}>();

const getAttributeAbbreviaton = (attribute: string): string => {
  const abbreviations: Record<string, string> = {
    Strength: "STR",
    Perception: "PER",
    Endurance: "END",
    Charisma: "CHA",
    Intelligence: "INT",
    Agility: "AGI",
    Luck: "LCK",
  };
  return abbreviations[attribute] || attribute;
};

</script>