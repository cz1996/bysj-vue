<template>
  <div class="app">
  <Input v-model="loginName" placeholder="登录名" style="width: 300px"></Input>
  <Input v-model="loginPassword" placeholder="登录密码" style="width: 300px"></Input>
  <Button v-on:click="goToHome">点击登录</Button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loginName: '',
        loginPassword: ''
      }
    },
    methods:{
      goToHome(){
        this.axios({
          method: 'get',
          url: '/list/users',
          data: {
            name: this.loginName,
            psd: this.loginPassword
          }
        }).then(function (response) {
          console.log(response);
          this.$router.push({name: 'allBar'});
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      }
    }
  }
</script>
