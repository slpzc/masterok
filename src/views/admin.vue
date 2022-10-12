<template>
  <div class="profile">
    <div class="overlay delete" v-if="deleteQuestion || addTicket || changeStatus || changeCategory">
      <div class="delete" v-if="deleteQuestion">
        <b>Вы точно хотите удалить заявку?</b>
        <div class="buttons">
          <button @click="deleteTicket()">Удалить</button>
          <button @click="deleteQuestion = false">Отмена</button>
        </div>
      </div>
      <div class="delete category" v-if="changeCategory">
        <b>Смена категории заявки</b>
        <p>Выберите новую категорию</p>
        <div class="buttons">
          <button v-for="(cat, key) in categories" :key="key" @click="changeCategoryMethod(cat)">{{cat}}</button>
        </div>
        <b>Создать новую категорию</b>
        <input type="text" placeholder="Название категории" v-model="newCategory">
        <button class="new-category" @click="createNewCategory()">Создать категорию</button>
      </div>
      <div class="delete" v-if="changeStatus">
        <b>Смена статуса заявки</b>
        <p>Выберите новый статус</p>
        <div class="buttons">
          <button @click="changeStatusMethod('Новая')">Новая</button>
          <button @click="changeStatusMethod('Ремонтируется')">Ремонтируется</button>
          <button @click="changeStatusMethod('Отремонтировано')">Отремонтировано</button>
        </div>
      </div>
      <div v-if="addTicket" class="addTicket">
        <b class="addTicket-title">Создание заявки</b>
        <div class="addTicket-form">
          <input type="text" placeholder="Адрес помещения" v-model="newTicketInfo.adress">
          <input type="text" placeholder="Описание" v-model="newTicketInfo.description">
          <div class="category">
            <b>Категория заявки</b>
            <p @click="newTicketInfo.category = cat" :class="{ selected: newTicketInfo.category === cat }" v-for="(cat, key) in categories" :key="key">{{ cat }}</p>
          </div>
          <input type="text" placeholder="Максимальная цена" v-model="newTicketInfo.maxPrice">
          <input type="text" placeholder="Ссылки на фото, через запятую" v-model="newTicketInfo.photo">
        </div>
        <button class="create-button" @click="createTicket()">Создать заявку</button>
      </div>
    </div>
    <div class="global-wrapper">
      <div class="profile-panel">
        <div class="profile-panel_menu">
          <div class="profile-info">
            <b>Здравствуйте, {{ user.fullName }}</b>
            <p>Панель администрирования заявок</p>
          </div>
          <div class="filter">
            <b>Фильтры</b>
            <div class="filter-box">
              <p class="filter-box_actually" @click="showFilter = !showFilter">{{ choicedFilter ? choicedFilter : filterChoice[0] }}</p>
              <div class="list" :class="{ show: showFilter }">
                <p v-for="(choice, key) in filterChoice" :key="key" @click="choicedFilter = choice; showFilter = false"> {{ choice }} </p>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-panel_orders">
          <div class="order" v-for="(order, key) in filteredChoices" :key="key" :class="{ active: selectedOrder == order }" >
            <div @click="selectedOrder == order ? selectedOrder = null : selectedOrder = order" class="order-inner">
              <div class="order-inner_info">
                <b>{{ order.adress }} <span>{{ order.status }}</span></b>
                <p>{{ order.time }}</p>
              </div>
              <b class="order-inner_price">{{ Number(order.maxPrice).toLocaleString('ru') }}₽</b>
            </div>
            <div class="buttons">
              <button @click="deleteQuestion = true">Удалить заявку</button>
              <button @click="changeStatus = true">Изменить статус заявки</button>
              <button @click="changeCategory = true">Изменить категорию заявки</button>
            </div>
          </div>
          <div class="error" v-if="filteredChoices.length < 1">
            <b>{{ tickets.length > 0 ? `Кажется, у вас ещё нет заявок с таким статусом` : 'Вы ещё не создавали заявки на ремонт' }}</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "admin",
  data() {
    return {
      changeStatus: false,
      changeCategory: false,
      showFilter: false,
      selectedOrder: null,
      filterChoice: ['Сначала новые', 'Отремонтированные', 'Ремонтируется'],
      choicedFilter: null,
      deleteQuestion: false,
      addTicket: false,
      selectedCategory: null,
      newCategory: '',
      newTicketInfo: {
        adress: '',
        description: '',
        category: '',
        maxPrice: '',
        photo: ''
      }
    }
  },
  computed: {
    categories (){
      return this.$store.state.user.categories
    },
    user() {
      return this.$store.state.user.user
    },
    tickets (){
      return this.$store.state.user.tickets
    },
    // eslint-disable-next-line vue/return-in-computed-property
    filteredChoices () {
      if(this.choicedFilter){
        if(this.choicedFilter === 'Сначала новые'){
          return this.tickets.filter(el => el.status === 'Новая')
        }else if (this.choicedFilter === 'Отремонтированные'){
          return this.tickets.filter(el => el.status === 'Отремонтировано')
        }else if (this.choicedFilter === 'Ремонтируется'){
          return this.tickets.filter(el => el.status === 'Ремонтируется')
        }
      } else {
        return this.tickets
      }
    },

  },
  methods: {
    createNewCategory (){
    this.axios.post(`${this.$store.state.apiURL}/createCategory`, { category: this.newCategory })
      this.changeCategory = false
    },
    changeStatusMethod (status) {
      this.axios.post(`${this.$store.state.apiURL}/changeTicketStatus`, { uid: this.selectedOrder.uid, status }).then(res=>{
        console.log(res)
        this.$store.commit('setTicketCategory', { status, ticket: this.selectedOrder.uid })

      })
      this.changeStatus = false
    },
    changeCategoryMethod (category) {
      this.axios.post(`${this.$store.state.apiURL}/changeTicketCategory`, { uid: this.selectedOrder.uid, category }).then(res=>{
        console.log(res)
        this.$store.commit('setTicketCategory', { category, ticket: this.selectedOrder.uid })

      })
      this.changeCategory = false
    },
    createTicket(){
      const data = {
        author: this.user.login,
        ...this.newTicketInfo
      }
      this.axios.post(`${this.$store.state.apiURL}/createTicket`, data).then(res =>{
        console.log(res)
        this.$store.commit('addTicket', res.data)
        this.addTicket = false
      })
    },
    deleteTicket() {
      console.log('s')
      console.log(this.selectedOrder)
      const ticket = this.selectedOrder
      this.axios.post(`${this.$store.state.apiURL}/deleteTicket`, { uid: ticket.uid }).then(res =>{
        console.log(res)
        this.$store.commit('deleteTicket', ticket.uid)
        this.deleteQuestion = false
      })
    }
  },
  mounted() {
    if(!this.user) this.$router.push('/authorization');
  }
}
</script>

<style scoped lang="scss">
.category{
  input{
    background-color: #F6F6F6;
    border-radius: 2px;
    height: 66px;
    padding-left: 24px;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.8);
    &::placeholder{
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.4);
    }
  }
  .new-category{
    margin-top: 20px;
    padding: 10px 20px;
    cursor: pointer;
    background-color: #FCEC41;
  }
}
.option{
  margin-top: 40px;
}
.overlay{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  .delete{
    max-width: 900px;
    width: 100%;
    background-color: white;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding: 20px 0;
    border-radius: 2px;
    b{
      font-weight: 600;
      font-size: 20px;
      line-height: 33px;
      color: #171B24;
    }
    .buttons{
      display: flex;
      align-items: center;
      gap: 10px;
      button{
        padding: 10px 20px;
        font-weight: 600;
        font-size: 16px;
        line-height: 33px;
        color: #171B24;
        cursor: pointer;
        transition: all .2s ease;
        &:hover{
          background-color: #e5e5e5;
        }
      }
    }
  }
  .addTicket{
    max-width: 1200px;
    width: 100%;
    background-color: white;
    padding: 20px 50px;
    &-title{
      font-weight: 600;
      font-size: 24px;
      line-height: 33px;
      color: #171B24;
    }
    &-form{
      padding-top: 40px;
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 20px;
      input{
        background-color: #F6F6F6;
        border-radius: 2px;
        height: 66px;
        padding-left: 24px;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.8);
        &::placeholder{
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    .category{
      display: flex;
      align-items: center;
      gap: 20px;
      b{
        font-weight: 600;
        font-size: 15px;
        line-height: 33px;
        color: rgba(0, 0, 0, 0.5);
      }
      p{
        cursor: pointer;
        background-color: transparent;
        color: #7e7e7e;
        border: 1px solid;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 14px;
      }
      p.selected{
        background-color: black;
        color: white;
      }
    }
    .create-button{
      margin-top: 20px;
      padding: 10px 20px;
      cursor: pointer;
      background-color: #FCEC41;
    }
  }
}
.profile{
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 80px);
  .global-wrapper{
    justify-content: center;
  }
  &-panel{
    padding: 96px 126px;
    flex-direction: column;
    display: flex;
    max-width: 1400px;
    width: 100%;
    box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.02);
    border-radius: 2px;
    &_menu{
      width: 100%;
      justify-content: space-between;
      display: flex;
      align-items: center;
      .profile-info{
        display: flex;
        flex-direction: column;
        b{
          font-weight: 600;
          font-size: 24px;
          line-height: 33px;
          color: #171B24;
        }
        p{
          padding-top: 9px;
          font-weight: 400;
          font-size: 20px;
          line-height: 28px;
          color: #171B24;
        }
      }
      .filter{
        max-width: 170px;
        width: 100%;
        b{
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          color: #171B24;
        }

        &-box{
          position: relative;
          &_actually{
            cursor: pointer;
            background-color: #E8E9EA;
            font-weight: 400;
            font-size: 14px;
            line-height: 16px;
            padding: 5px 10px;
            color: rgba(0, 0, 0, 0.8);
          }
          .list{
            z-index: 1;
            height: 0;
            overflow: hidden;
            transition: all .2s ease;
            position: absolute;
            top: 40px;
            left: 0;
            background-color: white;
            box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            border-radius: 2px;
            p{
              cursor: pointer;
              padding: 5px 35px;
              font-size: 13px;
              &:hover{
                background-color: #E8E9EA;
              }
            }
          }
          .show{
            height:97px;
          }
        }
      }
      button{
        background-color: #FBE303;
        padding: 15px 38px;
        font-weight: 400;
        font-size: 14px;
        line-height: 19px;
        color: #000000;
        cursor: pointer;
      }
    }
    &_orders{
      padding-top: 43px;
      width:100%;
      .error{
        width: 100%;
        background-color: #FBFBFB;
        height: 122px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        opacity: .5;
      }
      .order{
        overflow: hidden;
        cursor: pointer;
        padding: 34px 51px;
        background-color: #FBFBFB;
        transition: all .1s ease;
        border-radius: 2px;
        width: 100%;
        height: 122px;
        .order-inner{
          display: flex;
          justify-content: space-between;
          &_info{
            b{
              font-weight: 600;
              font-size: 20px;
              line-height: 28px;
              color: #171B24;
              span{
                margin-left: 18px;
                background-color: #171B24;
                padding: 5px 22px;
                font-weight: 500;
                font-size: 12px;
                line-height: 16px;
                color: #FFFFFF;
              }
            }
            p{
              padding-top: 6px;
              font-weight: 400;
              font-size: 14px;
              line-height: 19px;
              color: rgba(0, 0, 0, 0.6);
            }
          }
          &_price{
            font-weight: 600;
            font-size: 20px;
            line-height: 28px;
            color: #171B24;
          }
        }
        .buttons{
          margin-top: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        button{
          cursor: pointer;
          font-weight: 500;
          color: white;
          background-color: #afaeae;
          padding: 9px 20px;
          font-size: 14px;
        }
        &:hover{
          background-color: #f5f5f5;
        }
      }
      .order.active{
        height: 180px;
      }
    }
  }
}

</style>