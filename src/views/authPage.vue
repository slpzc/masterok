<template>
  <div class="authorization">
      <div class="global-wrapper">
        <div v-if="frame === 0" class="authorization-panel login">
          <b class="authorization-panel_title">Авторизация</b>
          <p class="authorization-panel_description">Войдите в аккаунт, чтобы  иметь больше преимуществ</p>
          <div class="authorization-panel_form">
            <div class="input">
              <input type="text" placeholder="Введите логин" v-model="login">
            </div>
            <div class="input">
              <input type="text" placeholder="Введите пароль" v-model="password">
            </div>
          </div>
          <button @click="loginMethod()">Войти</button>
          <p class="change-frame" @click="frame = 1">регистрация</p>
        </div>
        <div v-if="frame === 1" class="authorization-panel">
          <b class="authorization-panel_title">Регистрация</b>
          <p class="authorization-panel_description">Войдите в аккаунт, чтобы  иметь больше преимуществ</p>
          <div class="authorization-panel_form">
            <div class="input" :class="{ error: errors.fullname }">
              <input type="text" placeholder="Введите ваше ФИО" v-model="fullName">
              <p v-if="errors.fullname">{{ errors.fullname }}</p>
            </div>
            <div class="input" :class="{ error: errors.login }">
              <input type="text" placeholder="Придумайте логин" v-model="login">
              <p v-if="errors.login">{{ errors.login }}</p>
            </div>
            <div class="input" :class="{ error: errors.email }">
              <input type="text" placeholder="Введите вашу почту" v-model="email">
              <p v-if="errors.email">{{ errors.email }}</p>
            </div>
            <div class="input" :class="{ error: errors.password }">
              <input type="text" placeholder="Придумайте пароль" v-model="password">
              <p v-if="errors.password">{{ errors.password }}</p>
            </div>
            <div class="input" :class="{ error: errors.rePassword }">
              <input type="text" placeholder="Повторите пароль" v-model="rePassword">
              <p v-if="errors.rePassword">{{ errors.rePassword }}</p>
            </div>
          </div>
          <div class="checkbox">
            <input type="checkbox" name="box" id="box" v-model="checkbox" @click="checkbox = !checkbox">
            <p>Даю согласие на обработку персональных данных</p>
          </div>
          <button :disabled="!checkbox"  @click="registerMethod()">Регистрация</button>
          <p class="change-frame" @click="frame = 0">авторизация</p>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "authPage",
  data() {
    return {
      checkbox: true,
      login: '',
      email: '',
      fullName: '',
      password: '',
      rePassword: '',
      frame: 0,
      errors: {
        email: false,
        fullname: false,
        login: false,
        password: false,
        rePassword: false
      }
    }
  },
  mounted() {
    if(this.user) this.$router.push('/profile');
  },
  methods: {
    loginMethod() {
      console.log('a')
      const data = { login: this.login, password: this.password }
      this.axios.post(`${this.$store.state.apiURL}/login`, data).then((res) =>{
        console.log(res)
        this.$store.commit('setUser', res.data)
        this.$router.push('/profile')

      })
          .catch(err =>{
            console.log(err)
          })
    },
    registerMethod() {
      const data = { fullName: this.fullName, login: this.login, password: this.password, email: this.email }

      // validate
      const regexpWord = /^[a-z\s]+$/i
      if(this.fullName.length < 1 || regexpWord.test(this.fullName) || this.fullName.indexOf('-') !== -1) {
        this.errors.fullname = 'Поле обязательно и должно быть только на кириллице'
        return setTimeout(()=> { this.errors.fullname = false }, 4000)
      }
      const fullname = this.fullName.split(' ')
      if(fullname[0].length < 3 && fullname[1].length < 3 && fullname[2].length < 3) {
        this.errors.fullname = 'ФИО введено неверно'
        return setTimeout(()=> { this.errors.fullname = false }, 4000)
      }

      const regexpLogin = /[а-яё]/i;
      if(this.login.length < 3 || regexpLogin.test(this.login)) {
        this.errors.login = 'Логин введен неверно'
        return setTimeout(()=> { this.errors.login = false }, 4000)
      }


      const emailRegex = /^\S+@\S+\.\S+$/
      if(!emailRegex.test(this.email)) {
        this.errors.email = 'Почта введена неверно'
        return setTimeout(()=> { this.errors.email = false }, 4000)
      }

      if(this.password.length < 6) {
        this.errors.password = 'Пароль должен быть не менее 6 символов'
        return setTimeout(()=> { this.errors.password = false }, 4000)
      }

      if(this.password !== this.rePassword){
        this.errors.password = 'Пароль должен совпадать'
        this.errors.rePassword = 'Пароль должен совпадать'
        return setTimeout(()=> {
          this.errors.password = false
          this.errors.rePassword = false
        }, 4000)
      }

      this.axios.post(`${this.$store.state.apiURL}/register`, data).then((res) =>{
        if(res.status === 200){
          this.$store.commit('setUser', res.data)
          this.$router.push('/profile')
        }
      })
          .catch(err =>{
            console.log(err)
          })
    }
  },
}
</script>

<style scoped lang="scss">
.authorization{
  width: 100%;
  height: calc(100vh - 110px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  //background-color: #FBFBFB;
  .global-wrapper{
    justify-content: center;
  }
  &-panel{
    box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.02);
    max-width: 584px;
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 2px;
    padding: 49px 71px 58px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &_title{
      font-weight: 600;
      font-size: 24px;
      line-height: 33px;
      color: #000000;
    }
    &_description{
      font-weight: 400;
      font-size: 16px;
      line-height: 22px;
      color: #000000;
      padding-top: 2px;
      opacity: .8;
    }
    &_form{
      padding-top: 54px;
      width: 100%;
      display: flex;
      flex-direction: column;
      .input{
        width: 100%;
        height: 90px;
        p{
          color: #ff5317;
          font-size: 12px;
        }

        input {
          width: 100%;
          background-color: #F6F6F6;
          border-radius: 2px;
          padding-left: 24px;
          height: 66px;
          outline: none;
          transition: all .2s ease;
          border: 1px solid transparent;
          font-weight: bold;

          &::placeholder {
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            color: rgba(0, 0, 0, 0.4);
          }
        }
      }
      .error{
        input{
          border: 1px solid #ff5317;
        }
      }
    }
    button{
      cursor: pointer;
      margin-top: 40px;
      width: 100%;
      background-color: #FCEC41;
      padding: 21px 0;
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
      color: #000000;
      transition: background-color .2s ease;
      &:disabled{
        background-color: #787878;
        color: #8c8c8c;
        &:hover{
          background-color: #787878;
          color: #8c8c8c;
        }
      }
      &:hover{
        background-color: #FBE303;
      }
    }
  }
  .change-frame{
    padding-top: 10px;
    cursor: pointer;
    color: #0077ff;
    border-bottom: 1px solid transparent;
    transition: border-bottom .2s ease;
    &:hover{
      border-bottom: 1px solid #07f;
    }
  }
  .checkbox{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    p{
      font-size: 14px;
      padding-left: 10px;
    }
  }
}
</style>