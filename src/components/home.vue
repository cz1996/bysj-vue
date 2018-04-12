<template>
  <div>
    <div class="home text-center">{{home}}</div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data () {
      return {
        home: '别看了这里啥也没有'
      }
    },
    components: {}
  }
</script>

<style>
  .home {
    margin-top: 10%;
    font-size: 2.4em;
    font-weight: bold;
  }
</style>
