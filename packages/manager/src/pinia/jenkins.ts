import { defineStore } from 'pinia'

export const useJenkinsStore = defineStore('jenkins', {
  state: () => ({
    buildStatus: 'SUCCESS',
  }),

  getters: {
    isRunning: (state) => state.buildStatus === 'RUNNING',
  },

  actions: {
    changeStatus(status: string) {
      this.buildStatus = status
    },
  },
})
