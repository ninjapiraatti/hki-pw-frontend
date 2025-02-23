import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

import router from "./router"

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

/*
router.beforeEach((to, from, next) => {
	const requiresAuth = to.meta.requiresAuth
	const userStore = useUsersStore()
	const isLoggedIn = userStore.isLoggedIn
	console.log("NAV GUARD. isLoggedin:", isLoggedIn)

	if (requiresAuth && !isLoggedIn) {
		next({ name: "Login" })
	} else {
		next()
	}
})
*/
import './scss/main.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
app.mount("#app")
