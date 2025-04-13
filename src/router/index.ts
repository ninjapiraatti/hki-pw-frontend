import ArticlesView from "@/views/ArticlesView.vue"
import ArticleView from "@/views/ArticleView.vue"
import ThingsView from "@/views/ThingsView.vue"
import ThingView from "@/views/ThingView.vue"
import CharactersView from "@/views/CharactersView.vue"
import CharacterView from "@/views/CharacterView.vue"
import HomeView from "@/views/HomeView.vue"
import LoginView from "@/views/LoginView.vue"
import NotFoundView404 from "@/views/404View.vue"

import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/login",
			name: "Login",
			component: LoginView,
		},
		{
			path: "/articles",
			name: "Articles",
			component: ArticlesView,
		},
		{
			path: "/articles/:id",
			name: "Article",
			component: ArticleView,
		},
		{
			path: "/things",
			name: "Things",
			component: ThingsView,
		},
		{
			path: "/things/:id",
			name: "Thing",
			component: ThingView,
		},
		{
			path: "/characters",
			name: "Characters",
			component: CharactersView,
		},
		{
			path: "/characters/:id",
			name: "Character",
			component: CharacterView,
		},
    /*
		{
			path: "/projects/:id",
			component: ArticleView,
		},
		{
			path: "/profile",
			name: "Profile",
			component: ProfileView,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/slides",
			name: "slides",
			meta: { hideHeader: true },
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import("../views/SlideDeckView.vue"),
		},
    */
		{
			path: "/:catchAll(.*)",
			name: "NotFound",
			component: NotFoundView404,
		},
	],
})

export default router