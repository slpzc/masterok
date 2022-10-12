<template>
  <main class="home">
    <section class="main">
      <div class="global-wrapper">
        <b>Ремонт и устройство вашей квартиры</b>
        <p>берём на себя ответственность за вашу квартиру</p>
        <button>Подробнее</button>
      </div>
    </section>
    <section class="statistic">
      <div class="global-wrapper">
        <div class="statistic-card" v-for="({title, description}, key) in statistic" :key="key">
          <b>{{ title }}</b>
          <p> {{ description }} </p>
        </div>
      </div>
    </section>
    <section class="last-projects">
      <div class="global-wrapper">
        <b>Наши последние проекты</b>
        <p>проекты, собранные специально нашей редакцией для ваших глаз</p>
        <div class="cards">
          <div @mouseenter="activeCard = card" @mouseleave="activeCard = null" class="card" v-for="(card, key) in cards" :key="key">
            <b>{{ activeCard == card ? 'После' : 'До' }}</b>
            <img :src="activeCard === card ? card.after : card.before ">
          </div>
        </div>
      </div>
    </section>
<!--    <section class="features">-->
<!--      <div class="global-wrapper">-->
<!--        <b>Почему именно мы</b>-->
<!--        <p>удобства работы с нами - самое главное для нас</p>-->
<!--      </div>-->
<!--    </section>-->
  </main>
</template>

<script>
// import projectsCarousel from "@/components/projectsCarousel";
export default {
  name: 'Home',
  // components: {projectsCarousel},
  data() {
    return {
      activeCard: null,
      cards: [
        {
          before: 'https://s0.rbk.ru/v6_top_pics/media/img/5/00/756281448063005.jpg',
          after: 'https://s0.rbk.ru/v6_top_pics/media/img/5/60/756281458904605.jpg'
        },
        {
          before: 'https://marin-dom.ru/media/k2/items/cache/84ac056b57dd032fcf18a346d4a81feb_L.jpg',
          after: 'https://evmaster.net/wp-content/uploads/2020/05/2.jpg'
        },
        {
          before: 'https://idei.club/uploads/posts/2021-10/1633446410_28-idei-club-p-odnokomnatnaya-kvartira-obichnaya-interer-28.jpg',
          after: 'https://erimid.site/wp-content/uploads/2020/05/dfc6d787d79c2a7066df544771af8bd7.jpg'
        },
        {
          before: 'https://d1gc6ba1r4599p.cloudfront.net/uploads/project_image/file/9944/version_1920_fit_zal2.jpg',
          after: 'https://idei.club/uploads/posts/2021-10/1633398770_2-idei-club-p-belaya-kvartira-v-stile-minimalizm-interer-2.jpg'
        },
        {
          before: 'https://mykaleidoscope.ru/uploads/posts/2021-03/1615569032_50-p-interer-kvartiri-v-belikh-tonakh-52.jpg',
          after: 'https://idei.club/uploads/posts/2021-04/1618820539_39-idei_club-p-sero-belie-tona-v-dizaine-komnat-40.jpg'
        },
        {
          before: 'https://artyhomes.ru/wp-content/uploads/2022/02/1617601775_48-p-serii-interer-gostinoi-48.jpg',
          after: 'https://pr-flat.ru/upload/medialibrary/306/306d8b91f396e2b02d6bbbf7b8445a4a.jpg'
        },
        {
          before: 'https://www.only-remontkvartir.ru/upload/iblock/29a/29a4d01f9562c66633757f0a921b56c2.jpg',
          after: 'https://www.only-remontkvartir.ru/upload/iblock/29a/29a4d01f9562c66633757f0a921b56c2.jpg'
        },
        {
          before: 'https://exporealty.ru/upload/iblock/580/qiktucw85t4zl376ohcn99ev94iklgay/4.jpg',
          after: 'https://zhiznsovkusom.ru/images/wp-content/uploads/2018/01/Dizajn-odnokomnatnoj-kvartiry.jpg'
        }
      ]
    }
  },
  mounted() {
    this.axios.get(`${this.$store.state.apiURL}/getTickets`).then(res => {
      this.$store.commit('setAllTickets', res.data)
    })
  },
  computed: {
    tickets() {
      return this.$store.state.readyTickets
    },
    statistic () {
      return [{
        title: '150',
        description: 'капитальных ремонтов на нашем счету'
      },
        {
          title: this.tickets.length,
          description: 'уже в статусе отремонтированных'
        },
        {
          title: '47',
          description: 'готовых сотрудников для работы с вами'
        }]
    }
  },
}
</script>
<style scoped lang="scss">
.cards{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  .card{
    position: relative;
    max-width: 250px;
    cursor: pointer;
    &::before{
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      width: 100%;
      height: 156px;
      background-color: rgba(0, 0, 0, 0.49);
      z-index: 1;
    }
    img{
      width: 250px;
      height: 156px;
    }
    b{
      z-index: 2;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white !important;
    }

  }
}
.home{
  padding-top: 88px;
  .main{
    .global-wrapper{
      flex-direction: column;
      align-items: flex-start;
      padding: 40px 0 40px 100px;
      background-image: url('https://i.imgur.com/uES35Bg.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
    b{
      text-align: left;
      max-width: 570px;
      font-weight: 600;
      font-size: 48px;
      line-height: 120%;
      color: #171B24;
    }
    p{
      padding-top: 13px;
      font-weight: 400;
      font-size: 20px;
      line-height: 140%;
      color: #454950;
    }
    button{
      cursor: pointer;
      margin-top: 79px;
      font-weight: 500;
      font-size: 18px;
      line-height: 136%;
      color: #171B24;
      padding: 12px 24px;
      background-color: #FCEC41;
    }
  }
  .statistic{
    padding-top: 157px;
    .global-wrapper{
      justify-content: space-between
    }
    &-card{
      max-width: 420px;
      width: 100%;
      display: flex;
      align-items: center;
      b{
        font-weight: 600;
        font-size: 40px;
        line-height: 55px;
        color: #171B24;
        padding-right: 16px;
      }
      p{
        text-align: left;
        font-weight: 500;
        font-size: 24px;
        line-height: 33px;
        color: #2F323A;
      }
    }
  }
  .last-projects{
    padding-top: 145px;
    .global-wrapper{
      flex-direction: column;
      align-items: flex-start
    }
    b{
      font-weight: 600;
      font-size: 40px;
      line-height: 55px;
      color: #171B24;
    }
    p{
      padding-top: 2px;
      font-weight: 400;
      font-size: 24px;
      line-height: 33px;
      letter-spacing: 0.06em;
      color: rgba(23, 27, 36, 0.7);
      padding-bottom: 45px;
    }
  }
  .features{
    padding-top: 130px;
    .global-wrapper{
      flex-direction: column;
      align-items: flex-start;
    }
    b{
      font-weight: 600;
      font-size: 40px;
      line-height: 55px;
      color: #171B24;
    }
    p{
      padding-top: 2px;
      font-weight: 400;
      font-size: 24px;
      line-height: 33px;
      letter-spacing: 0.06em;
      color: rgba(23, 27, 36, 0.7);
    }
  }
}
</style>
