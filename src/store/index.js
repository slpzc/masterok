import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    readyTickets: [],
    apiURL: 'http://localhost:3000'
  },
  mutations: {
    setUser(state, payload){
    state.user = payload
      localStorage.setItem('user', JSON.stringify(payload))
    },
    authorization (state, payload){
      // ss
      const data = { login: payload.user.login, password: payload.user.password}
      axios.post(`${state.apiURL}/login`, data).then((res) =>{
        console.log(res)
        state.user = res.data
      })
    },
    deleteTicket (state, payload) {
      console.log(payload)
      const position = state.user.tickets.findIndex(ticket => ticket.uid === payload)
      state.user.tickets.splice(position, position)
      state.user.tickets = state.user.tickets.filter(ticket => ticket.uid !== payload)
    },
    addTicket (state,payload){
      console.log(payload)
      state.user.tickets.push(payload)
    },
    setTicketCategory(state,payload){
      const position = state.user.tickets.findIndex(ticket => ticket.uid === payload.ticket)
      state.user.tickets[position].category = payload.category
    },
    setTicketStatus (state, payload){
      const position = state.user.tickets.findIndex(ticket => ticket.uid === payload.ticket)
      state.user.tickets[position].status = payload.status
    },
    setAllTickets (state, payload){
      state.readyTickets = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
