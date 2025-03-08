import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    jwt: localStorage.getItem('jwt'),
  }),
  actions: {
    setToken(token: string) {
      this.jwt = token
      localStorage.setItem('jwt', token)
    },
    getToken() {
      if (!this.jwt) {
        this.jwt = localStorage.getItem('jwt')
      }
      return this.jwt
    },
    clearToken() {
      this.jwt = null
      localStorage.removeItem('jwt')
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return !!state.jwt
    },
  },
});