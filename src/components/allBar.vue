<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
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
  .layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
  .layout-footer-center{
    text-align: center;
  }
  .layout-nav{
    text-align: right;
  }
  .ivu-dropdown-menu{
    text-align: center;
  }
</style>
<template>
  <div class="allBar">
    <Back-top></Back-top>
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"><a v-on:click="goToAllBar()" style="color: white">实时工况系统</a></div>
          <div v-if="pageState.loginUserName != ''" class="layout-nav">
            <!--<Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />-->
            <Avatar style="background-color: rgb(214, 194, 188);" icon="person" />
            <Dropdown>
              <a href="javascript:void(0)">
                {{pageState.loginUserName}}
                <Icon type="arrow-down-b"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem><Button v-on:click="goToUserInfo()">个人信息</Button></DropdownItem>
                <DropdownItem><Button @click="modal2 = true">退出系统</Button></DropdownItem>
              </DropdownMenu>

              <Modal v-model="modal2" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                  <Icon type="information-circled"></Icon>
                  <span>退出系统</span>
                </p>
                <div style="text-align:center">
                  <p>退出后将以游客身份登录</p>
                  <p>确定要退出吗？</p>
                </div>
                <div slot="footer">
                  <Button type="error" size="large" long :loading="modal_loading" @click="del">退出</Button>
                </div>
              </Modal>
            </Dropdown>
          </div>
          <div v-else class="layout-nav">
            <a v-on:click="changeLoginPage()">前往登录</a>
          </div>
        </Menu>
      </Header>
      <Layout :style="{padding: '0 50px'}">
        <Breadcrumb :style="{margin: '16px 0'}">
          <BreadcrumbItem v-for="(page,index) in pageState.pageName" :key="index">{{page}}</BreadcrumbItem>
          <!--<BreadcrumbItem>Components</BreadcrumbItem>-->
          <!--<BreadcrumbItem>Layout</BreadcrumbItem>-->
        </Breadcrumb>
        <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
          <Layout>
            <Sider hide-trigger :style="{background: '#fff'}">
              <Menu ref="leftMenu" v-if="pageState.loginUserName != ''" :open-names="openMenu" :active-name="activeName" theme="light" width="auto" @on-select="goToDeviceListItem">
                <MenuItem name="index">
                  <Icon type="ios-navigate"></Icon>
                  系统首页
                </MenuItem>
                <Submenu name="2">
                  <template slot="title">
                    <Icon type="ios-keypad"></Icon>
                    我的设备
                  </template>
                  <MenuItem name="deviceList">设备列表</MenuItem>
                </Submenu>
                <Submenu name="3">
                  <template slot="title">
                    <Icon type="ios-analytics"></Icon>
                    设备操作
                  </template>
                  <MenuItem name="addEqu">新建设备</MenuItem>
                  <MenuItem name="editEquInfo">修改设备</MenuItem>
                </Submenu>
              </Menu>

              <Menu v-else active-name="index" theme="light" width="auto" @on-select="goToDeviceListItem">
                <MenuItem name="index">
                  <Icon type="ios-navigate"></Icon>
                  系统首页
                </MenuItem>
              </Menu>
            </Sider>
            <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
              <router-view></router-view>
            </Content>
          </Layout>
        </Content>
      </Layout>
      <Footer class="layout-footer-center">2018-cccz1996 &copy; Working Condition System</Footer>
    </Layout>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        modal2: false,
        modal_loading: false,
        modal3: false,
        modal4: false,
        modal5: false,
        pageState: this.$store.state,
        openMenu: [],
        activeName: "index"

      }
    },
    watch:{
      // $route(to,from){
      //   switch (to.name){
      //     case 'index':
      //       this.activeName = 'index';
      //       break;
      //     case 'deviceList':
      //       this.activeName = 'deviceList';
      //       break;
      //     case 'addEqu':
      //       this.activeName = 'addEqu';
      //       break;
      //   }
      //   this.$nextTick(function() {
      //     this.$refs.leftMenu.updateActiveName();
      //   });
      // }
    },
    mounted(){
      this.getSession()
    },
    methods: {
      // getRoundColor(){
      //   this.personBackColor = '#' +
      //     (function(color){
      //       return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
      //       && (color.length == 6) ?  color : arguments.callee(color);
      //     })('');
      // },
      // 判断有没有session
      getSession(){
        this.axios({
          method: 'get',
          url: '/session'
        }).then(function (response) {
          var responseData = response.data;
          if(responseData != '0'){
            this.$store.dispatch("setUser",responseData);
          }else{
            this.$store.dispatch("setUser","");
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },
      // 退出登录
      del () {
        this.axios({
          method: 'get',
          url: '/loginOut'
        }).then(function (response) {
          var responseData = response.data;
          if(responseData=='1'){
            this.$store.dispatch("setUser","");
            this.modal2 = false;
            this.$router.push({name: 'index'});
            this.$Message.success('退出成功');
          }else{
            this.modal2 = false;
            this.$Message.warning('退出失败');
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },
      // 跳转个人信息页面
      goToUserInfo(){
        this.$router.push({name: 'userInfo'});
      },
      // header部分跳转首页a标签
      goToAllBar(){
        this.$router.push({name: 'index'});
      },
      // 跳转登录页面
      changeLoginPage(){
        this.$router.push({name: 'login'});
      },
      // 跳转设备页面
      goToDeviceListItem(name){
        this.$router.push({name: name});
      }
    }
  }
</script>
