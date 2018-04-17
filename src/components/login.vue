<style scoped>
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    line-height: 35px;
    text-align: center;
    color: white;
    cursor: pointer;
  }
  .login-div{
    width: 100%;
    height: 100%;
    margin-top: 10%;
    text-align: center;
  }
  .login-input{
    width: 30%;
    margin: 20px;
  }
  .layout-footer-center{
    position: fixed;
    width: 100%;
    bottom: 0;
    text-align: center;
  }
</style>
<template>
  <div class="login">
    <Header>
      <Menu mode="horizontal" theme="dark" active-name="1">
        <div class="layout-logo"><a v-on:click="goToAllBar()" style="color: white">实时工况系统</a></div>
      </Menu>
    </Header>
    <div class="login-div">
      <Input v-model="loginName" placeholder="请输入用户名" class="login-input" size="large" icon="person-add"></Input><br/>
      <Input v-model="loginPassword" type="password" placeholder="请输入密码" class="login-input" size="large" icon="ios-clock"></Input><br/>
      <Button v-on:click="goToHome" style="width: 30%;margin-top: 20px;font-size: 20px;" size="large">登录</Button>
      <p style="margin-top: 10px;font-size: 15px;">没有账号？马上<a v-on:click="changeRegisterPage()">注册</a></p>
    </div>
    <Footer class="layout-footer-center">2018-cccz1996 &copy; Working Condition System</Footer>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loginName: '',
        loginPassword: '',
        loginTrue: false
      }
    },
    methods:{
      // 用户登录
      goToHome(){
        if(this.loginName != '' && this.loginPassword != ''){
          this.axios({
            method: 'get',
            url: '/login',
            params: {
              'userName': this.loginName,
              'userPassword': this.loginPassword
            }
          }).then(function (response) {
            var responseData = response.data;
            if(responseData.length >= 1 && responseData != [] && responseData != null){
              this.loginTrue = true;
              this.$store.dispatch("setUser",this.loginName);
              // var test = this.$store.commit("getUser");
              console.log(this.$store.state.loginUserName);
            }
            if(this.loginTrue){
              this.$router.push({name: 'allBar'});
            }else{
              this.$Message.warning({
                content:'用户名或密码输入错误，请重新登录',
                duration: 5
              });
            }
          }.bind(this)).catch(function (error) {
            alert(error);
          });
        }else{
          this.$Message.warning({
            content:'用户名或密码为空，请重新输入',
            duration: 5
          });
        }
      },

      // 跳转注册页面
      changeRegisterPage(){
        this.$router.push({name: 'register'});
      },

      // 跳转首页
      goToAllBar(){
        this.$router.push({name: 'allBar'});
      }
    }
  }
</script>
