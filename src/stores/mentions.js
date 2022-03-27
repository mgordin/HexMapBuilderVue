import { defineStore } from 'pinia'

export const useMentionStore = defineStore({
  id: 'mentions',
  state: () => ({
    people: ['Elder', 'King', 'Juggler'],
    places: ['Ruin', 'Town', 'Village']
  }),
  getters: {
    
  },
  actions: {
  }
})