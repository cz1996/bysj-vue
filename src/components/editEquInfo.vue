<style>
  .loadingDevice,
  .noDevice{
    padding-top: 100px;
    width: 100%;
    text-align: center;
    font-size: 30px;
    line-height: 30px;
    font-family: 幼圆;
  }
  .yesDevice{
    width: 100%;
    position: relative;
  }
  .deviceListDetailInEdit{
    width: 80%;
    border: 1px;
    float: left;
  }
  .deviceListDetail-title{
    width: 100%;
    text-align: center;
  }
  .describe-item{
    width: 80%;
    margin-left: 10%;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    background-color: #f5f7f9;
  }
  .deviceListDetail-table{
    margin-top: 10px;
    width: 80%;
    margin-left: 10%;
  }
  .deviceListRight{
    float: left;
    width: 20%;
    min-height: 200px;
    position: absolute;
    left: 80%;
    top:50%;
    margin-top:-100px;
  }
</style>

<template>
  <div style="min-height: 510px;">
    <div v-if="haveDevice === 0">
      <div class="loadingDevice">
        正在加载数据......
      </div>
    </div>
    <div v-else-if="haveDevice === -1">
      <div class="noDevice">
        暂无设备数据，请点此去<a v-on:click="changeAddDevicePage()">新建设备</a>
      </div>
    </div>
    <div v-else>
      <hr>
      <div class="yesDevice" v-for="(item,index) in deviceListObj">
        <br>
        <div class="deviceListDetailInEdit">
          <div class="deviceListDetail-title">
            <h2>{{item.equipmentName}}</h2>
          </div>
          <div class="deviceListDetail-describe">
            <div class="describe-item">{{item.equipmentDescribe}}</div>
          </div>
          <div class="deviceListDetail-table">
            <div style="display: none" class="getIndex">{{index}}</div>
            <Table size="large" border :columns="deviceListTableColumn" :data="deviceListData[index]" class="deviceList-table"></Table>
          </div>
          <div style="height: 30px;width: 100%"></div>
        </div>

        <div class="deviceListRight">
          <div style="margin-top: 40px;">
            <div class="currEquIdDiv" style="display: none;">{{index}}</div>
            <Button type="success" v-on:click="changeCurrDeviceInEdit" icon="edit" style="width: 60%;font-size: 20px;" size="large">修改</Button>
          </div>

          <div style="margin-top: 30px;">
            <div style="display: none" class="getCurrEquIdInButton">{{index}}</div>
            <Button type="error" @click="getCurrEquIdAndDelete" icon="trash-a" style="width: 60%;font-size: 20px;" size="large">删除</Button>
          </div>

          <Modal v-model="modalDelete" width="360">
            <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>删除设备</span>
            </p>
            <div style="text-align:center">
              <p>删除后不可撤销操作</p>
              <p>确定要删除吗？</p>
            </div>
            <div slot="footer">
              <Button type="error" size="large" long :loading="false" @click="deleteCurrDeviceInEdit">删除</Button>
            </div>
          </Modal>
        </div>
        <div style="clear: both"></div>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        modalDelete: false,
        haveDevice: 0,
        deviceListObj: null,
        deviceListData:[],
        currDeleteId: '',
        deviceListTableColumn: [
          {
            title: '设备名称',
            key: 'attrName'
          },
          {
            title: '检测间隔',
            key: 'attrTiming'
          },
          {
            title: '正常数据',
            key: 'attrCommon'
          },
          {
            title: '浮动数据',
            key: 'attrFloat'
          }
        ],
      }
    },
    mounted(){
      this.setPageName(),
      this.getSession()
    },
    methods:{
      setPageName(){
        this.$store.dispatch("setPage",["系统首页","修改设备"]);
      },
      // 判断有没有session
      getSession(){
        this.axios({
          method: 'get',
          url: '/session'
        }).then(function (response) {
          var responseData = response.data;
          if(responseData != '0'){
            this.$store.dispatch("setUser",responseData);
            this.getDeviceListInEdit();
          }else{
            this.$store.dispatch("setUser","");
            this.$router.push({name: 'index'});
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },
      //获取设备列表json
      getDeviceListInEdit(){
        this.axios({
          method: 'get',
          url: '/deviceList'
        }).then(function (response) {
          var responseData = response.data;
          if(responseData == "-1"){
            this.haveDevice = -1;
          }else{
            this.haveDevice = 1;
            responseData = responseData.replace(/'/g, '"');
            var responseObj = JSON.parse(responseData);
            this.deviceListObj = responseObj;
            for(var i = 0;i < responseObj.length;i++) {
              var currList = [];
              var currAttr = responseObj[i].equipmentAttribute;
              for (var j = 0; j < currAttr.length;j++) {
                currList.push(currAttr[j]);
              }
              this.deviceListData.push(currList);
            }
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      changeAddDevicePage(){
        this.$router.push({name: 'addEqu'});
      },

      changeCurrDeviceInEdit($event){
        var currInfoObj = event.currentTarget;
        var currUseId = $(currInfoObj).parent().find(".currEquIdDiv").html();
        var currEquId = this.deviceListObj[currUseId].equipmentId;
        this.axios({
          method: 'get',
          url: '/editEquINfoById',
          params: {
            'currEquId': currEquId
          }
        }).then(function (response) {
          var responseData = response.data;
          if(responseData != '0'){
            this.$router.push({name: 'changeEqu'});
          }else{
            this.$Message.warning({
              content:'发生未知错误，请重新操作',
              duration: 5
            });
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      deleteCurrDeviceInEdit(){
        this.axios({
          method: 'get',
          url: '/deleteEquINfoById',
          params: {
            'currEquId': this.currDeleteId
          }
        }).then(function (response) {
          var responseData = response.data;
          if(responseData != '0'){
            this.$Message.success({
              content:'删除成功',
              duration: 5
            });
            this.modalDelete = false;
            window.location.reload();
          }else{
            this.$Message.warning({
              content:'发生未知错误，请重新操作',
              duration: 5
            });
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      getCurrEquIdAndDelete($event){
        var currInfoObj = event.currentTarget;
        var currId = $(currInfoObj).parent().  parent().find(".getCurrEquIdInButton").html();
        // console.log(currId);
        this.currDeleteId = this.deviceListObj[currId].equipmentId;
        this.modalDelete = true;
      }
    }
  }
</script>
