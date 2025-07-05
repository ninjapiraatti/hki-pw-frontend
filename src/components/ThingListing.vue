<template>
  <masonry-wall :items="items" :ssr-columns="ssrColumns" :column-width="columnWidth" :gap="gap">
    <template #default="{ item, index }">
      <div class="card bg-dark-subtle p-2 position-relative">
        <img
          v-if="item.images && (Object.keys(item.images).length > 0)"
          class="card-img-top w-100" :src="`${Object.values(item.images)[0]}`"
          alt="thing.title"
        />
        <img v-else class="card-img-top w-100" :src="`../app/src/assets/square${index + 1 < 6 ? index + 1 : 4}.jpg`" alt="thing.title" />
        <div v-if="item.damage" class="damage-pill damage-pill--listing">
          {{ item.damage }}
        </div>
        <div class="card-body">
          <h5 class="card-title">
            <router-link class="hover-swipe card-title" :to="`/${baseUrl}/${item.id}`">{{ item.title }}</router-link>
          </h5>
          <p class="small">{{ item.ingress }}</p>
          <span v-for="effect in item.attributeEffects" class="attribute-pill">
            {{ effect.target.substring(0, 3).toUpperCase() }} {{ effect.strength > 0 ? '+' : '-' }}{{ effect.strength }}
          </span>
          <span v-for="effect in item.skillEffects" class="skill-pill">
            {{ effect.target }} {{ effect.strength > 0 ? '+' : '-' }}{{ effect.strength }}
          </span>
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

</script>