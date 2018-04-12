<template>
  <div>
    <h2 class="text-center">{{title}}</h2>
    <ul class="text-center spacing" style="padding: 0">
      <li v-for="item in links"><a @click="$goRoute(item.route)">{{item.text}}</a></li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'page01',
  data () {
    return {
      title: '这里是第一个页面',
      links: [
        {
          text: '圆白菜',
          route: '/page01/page01-a'
        },
        {
          text: '长白菜',
          route: '/page01/page01-b'
        }
      ]
    }
  }
}
</script>
