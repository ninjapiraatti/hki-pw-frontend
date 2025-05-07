<template>
	<nav class="navbar navbar-expand-lg bg-dark-subtle">
		<div class="container-fluid">
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent" :class="!menuOpen?'collapse':''">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<router-link class="nav-link" to="/">
							<img class="logo-icon" src="../assets/hki2050.svg" alt="HKI2050 logo" />
						</router-link>
					</li>
					<li class="nav-item">
						<router-link class="nav-link" to="/characters" @click="menuOpen = !menuOpen">Characters</router-link>
					</li>
					<li class="nav-item">
						<router-link class="nav-link" to="/articles" @click="menuOpen = !menuOpen">Articles</router-link>
					</li>
					<li class="nav-item">
						<router-link class="nav-link" to="/things" @click="menuOpen = !menuOpen">Items</router-link>
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							Dropdown
						</a>
						<ul class="dropdown-menu">
							<li><a class="dropdown-item" href="#">Action</a></li>
							<li><a class="dropdown-item" href="#">Another action</a></li>
							<li><hr class="dropdown-divider" /></li>
							<li><a class="dropdown-item" href="#">Something else here</a></li>
						</ul>
					</li>
				</ul>
				<a class="navbar-brand" href="#">
					<UserIcon class="icon-small" />
				</a>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { UserIcon } from "@heroicons/vue/24/outline"

const menuOpen = ref(false)
</script>
