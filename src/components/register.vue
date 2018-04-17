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
      <Input v-model="registerName" placeholder="请输入用户名" class="login-input" size="large" icon="person-add"></Input><br/>
      <Input v-model="registerPasswordOne" type="password" placeholder="请输入密码" class="login-input" size="large" icon="ios-clock"></Input><br/>
      <Input v-model="registerPasswordTwo" type="password" placeholder="请确认密码" class="login-input" size="large" icon="information-circled"></Input><br/>
      <Button v-on:click="registerSuccess" style="width: 30%;margin-top: 20px;font-size: 20px;" size="large">立即注册</Button>
      <p style="margin-top: 10px;font-size: 15px;">已有账号？马上<a v-on:click="changeLoginPage()">登录</a></p>
    </div>
    <Footer class="layout-footer-center">2018-cccz1996 &copy; Working Condition System</Footer>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        registerName: '',
        registerPasswordOne: '',
        registerPasswordTwo: ''
      }
    },
    methods:{
      // 用户注册
      registerSuccess(){
        if(this.registerName != '' && this.registerPasswordOne != '' && this.registerPasswordTwo != ''){
          if(this.registerPasswordOne != this.registerPasswordTwo){
            this.$Message.warning({
              content:'两次输入密码不相同，请重新输入密码',
              duration: 5
            });
            this.registerPasswordOne = '';
            this.registerPasswordTwo = '';
          }else{
            this.axios({
              method: 'get',
              url: '/register',
              params: {
                'userName': this.registerName,
                'userPassword': this.registerPasswordTwo
              }
            }).then(function (response) {
              var registerUser = response.data;
              if(registerUser == '1'){
                this.$Message.success({
                  content:'注册成功，请前往登录',
                  duration: 5
                });
                this.registerName = '';
                this.registerPasswordTwo = '';
                this.registerPasswordOne = '';
              }else if(registerUser == '0'){
                this.$Message.warning({
                  content:'注册失败，请重新注册',
                  duration: 5
                });
              }else{
                this.$Message.warning({
                  content:'已存在相同用户名和密码的用户，请换个用户名或密码重新注册',
                  duration: 5
                });
              }
            }.bind(this)).catch(function (error) {
              alert(error);
            });
          }
        }
        else {
          this.$Message.warning({
            content:'用户名或密码为空，请重新输入',
            duration: 5
          });
        }
      },

      // 跳转登录页面
      changeLoginPage(){
        this.$router.push({name: 'login'});
      },

      // 跳转首页
      goToAllBar(){
        this.$router.push({name: 'allBar'});
      }
    }
  }
</script>
