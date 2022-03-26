import { defineStore } from 'pinia'

export const useMentionsStore = defineStore({
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