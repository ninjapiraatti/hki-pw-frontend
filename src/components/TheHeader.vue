<template>
	<nav class="navbar navbar-expand-lg bg-black">
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
			<div class="collapse navbar-collapse" id="navbarSupportedContent" :class="!menuOpen ? 'collapse' : ''">
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
				</ul>
				<div class="dropdown">
					<button
						class="btn user-dropdown-btn"
						type="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						<UserIcon class="icon-small" />
					</button>
					<ul class="dropdown-menu dropdown-menu-end">
						<li v-if="!userStore.isAuthenticated">
							<router-link class="dropdown-item" to="/login" @click="menuOpen = false">Login</router-link>
						</li>
						<li v-if="userStore.isAuthenticated">
							<button class="dropdown-item" @click="logout">Logout</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { UserIcon } from "@heroicons/vue/24/outline"
import { useUserStore } from "@/stores/user"

const router = useRouter()
const userStore = useUserStore()
const menuOpen = ref(false)

const logout = () => {
	userStore.clearToken()
	menuOpen.value = false
	router.push("/login")
}
</script>

<style scoped lang="scss">
.user-dropdown-btn {
	background: transparent;
	border: none;
	padding: 0.5rem;

	&:hover, &:focus {
		background: rgba(255, 255, 255, 0.1);
	}
}

.dropdown-menu {
	background: #1a1a1a;
	border: 1px solid rgba(255, 255, 255, 0.1);

	.dropdown-item {
		color: #fff;

		&:hover, &:focus {
			background: rgba(255, 255, 255, 0.1);
			color: #fff;
		}
	}
}
</style>
