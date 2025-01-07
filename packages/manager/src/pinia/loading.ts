import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    count: 0,
  }),

  getters: {
    isLoading: (state) => state.count > 0,
  },

  actions: {
    show() {
      this.count++
    },
    hide() {
      if (this.count > 0) {
        this.count--
      }
    },
  },
})
