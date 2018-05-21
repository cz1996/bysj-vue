<style>
  .info-div{
    text-align: center;
    height: 510px;
  }
  .changePsd-input{
    width: 50%;
    margin-top: 30px;
  }
</style>
<template>
  <div>
    <div class="info-div">
      <Input v-model="loginPasswordOld" type="password" placeholder="请输入新密码" class="changePsd-input" size="large" icon="ios-clock"></Input><br/>
      <Input v-model="loginPasswordNew" type="password" placeholder="请确认新密码" class="changePsd-input" size="large" icon="information-circled"></Input><br/>
      <Button v-on:click="changePassword" style="width: 50%;margin-top: 30px;font-size: 20px;" size="large">修改密码</Button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        loginPasswordOld: '',
        loginPasswordNew: ''
      }
    },
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
            this.$router.push({name: 'index'});
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      // 修改密码
      changePassword(){
        if(this.loginPasswordOld != this.loginPasswordNew){
          this.$Message.warning({
            content:'两次输入密码不一致，请重新输入',
            duration: 5
          });
        }
        else if(this.loginPasswordOld == ''){
          this.$Message.warning({
            content:'密码不能为空，请重新输入',
            duration: 5
          });
        }
        else{
          this.axios({
            method: 'get',
            url: '/changePsd',
            params: {
              'userPasswordNew': this.loginPasswordNew
            }
          }).then(function (response) {
            var responseData = response.data;
            if(responseData == '1'){
              this.$Message.success({
                content:'密码修改成功',
                duration: 5
              });
              this.loginPasswordOld = '';
              this.loginPasswordNew = '';
            }else{
              this.$Message.warning({
                content:'密码修改失败',
                duration: 5
              });
            }
          }.bind(this)).catch(function (error) {
            alert(error);
          });
        }
      }
    }
  }
</script>
