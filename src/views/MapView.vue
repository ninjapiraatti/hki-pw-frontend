<template>
	<div class="map-view">
		<InteractiveMap />
	</div>
</template>

<script setup lang="ts">
import InteractiveMap from "@/components/InteractiveMap.vue"
</script>

<style scoped lang="scss">
.map-view {
	position: fixed;
	top: 56px; // Height of navbar
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
}
</style>
