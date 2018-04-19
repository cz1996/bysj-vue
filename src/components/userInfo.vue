<template>
  <div>
    name
  </div>
</template>

<script>
  export default {
    mounted(){
      this.setPageName(),
        this.getSession()
    },
    methods:{
      setPageName(){
        this.$store.dispatch("setPage",["系统首页","个人信息"]);
      },
      // 判断有没有session
      getSession(){
        this.axios({
          method: 'get',
          url: '/session'
        }).then(function (response) {
          var responseData = response.data;
          // console.log(responseData);
          if(responseData != '0'){
            this.$store.dispatch("setUser",responseData);
            // console.log(this.loginOrNot);
          }else{
            this.$store.dispatch("setUser","");
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },
    }
  }
</script>
