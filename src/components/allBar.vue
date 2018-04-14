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
  a{
    color: white;
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
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">实时工况系统</div>
          <div class="layout-nav">
            <!--<Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />-->
            <Avatar icon="person" />
            <Dropdown>
              <a href="javascript:void(0)">
                程正
                <Icon type="arrow-down-b"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem><Button v-on:click="changePage()">个人信息</Button></DropdownItem>
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
        </Menu>
      </Header>
      <Layout :style="{padding: '0 50px'}">
        <Breadcrumb :style="{margin: '16px 0'}">
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Components</BreadcrumbItem>
          <BreadcrumbItem>Layout</BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
          <Layout>
            <Sider hide-trigger :style="{background: '#fff'}">
              <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                <MenuItem name="1">
                  <Icon type="ios-navigate"></Icon>
                  系统首页
                </MenuItem>
                <Submenu name="2">
                  <template slot="title">
                    <Icon type="ios-keypad"></Icon>
                    我的设备
                  </template>
                  <MenuItem name="2-1">设备测试</MenuItem>
                  <MenuItem name="2-2">设备列表</MenuItem>
                </Submenu>
                <Submenu name="3">
                  <template slot="title">
                    <Icon type="ios-analytics"></Icon>
                    新建设备
                  </template>
                  <MenuItem name="3-1">新建测试设备</MenuItem>
                  <MenuItem name="3-2">新建已有设备</MenuItem>
                </Submenu>
              </Menu>
            </Sider>
            <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
              Content
            </Content>
          </Layout>
        </Content>
      </Layout>
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
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
        modal5: false
      }
    },
    methods: {
      del () {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;
          this.modal2 = false;
          this.$Message.success('Successfully delete');
        }, 2000);
      },
      changePage(){
        this.$router.push({name: 'login'});
      }
    }
  }
</script>
