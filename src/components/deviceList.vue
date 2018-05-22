<style>
  .deviceList-div{
    min-height: 510px;
  }
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
  }
  .deviceListDetail{
    width: 100%;
    border: 1px;
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
  .deviceList-table{

  }
  .ivu-table td.table-info-column-attrCurrent{
    color: rgb(24, 181, 102);
  }
</style>
<template>
  <div class="deviceList-div">
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
        <div class="deviceListDetail">
          <div class="deviceListDetail-title">
            <h2>{{item.equipmentName}}</h2>
          </div>
          <div class="deviceListDetail-describe">
            <div class="describe-item">{{item.equipmentDescribe}}</div>
          </div>
        </div>
        <div class="deviceListDetail-table">
          <div style="display: none" class="getIndex">{{index}}</div>
          <Table size="large" border :columns="deviceListTableColumn" :data="currDeviceListData[index]" class="deviceList-table"></Table>
        </div>
        <div style="height: 30px;width: 100%"></div>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        haveDevice: 0,
        deviceListObj: null,
        deviceListData:[],
        currDeviceListData:[],
        sendToDeviceListData:[],
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
            title: '浮动数据',
            key: 'attrFloat'
          },
          {
            title: '正常数据',
            key: 'attrCommon'
          },
          {
            title: '实时数据',
            key: 'attrCurrent',
            className: 'table-info-column-attrCurrent'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: ($event) => {
                      var currInfoObj = event.currentTarget;
                      var curr = $(currInfoObj).parent().parent().parent().parent().parent().parent();
                      var currNext = $(curr).parent().parent().parent().parent().parent();
                      var index = $(currNext).find(".getIndex").html();
                      var currIndex = params.index;
                      var currInfo = this.deviceListData[index][currIndex];
                      this.$store.dispatch("setCurrDevice",currInfo);
                      var currDeviceId = currInfo.attrId;

                      this.axios({
                        method: 'get',
                        url: '/viewDeviceInfoById',
                        params: {
                          'currDeviceId': currDeviceId
                        }
                      }).then(function (response) {
                        var responseData = response.data;
                        if(responseData != '0'){
                          this.$router.push({name: 'deviceInfo'});
                        }else{
                          this.$Message.warning({
                            content:'发生未知错误，请重新操作',
                            duration: 5
                          });
                        }
                      }.bind(this)).catch(function (error) {
                        alert(error);
                      });

                    }
                  }
                }, '查看')
              ]);
            }
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
        this.$store.dispatch("setPage",["系统首页","设备列表"]);
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
            this.getDeviceList();
          }else{
            this.$store.dispatch("setUser","");
            this.$router.push({name: 'index'});
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      //获取设备列表json
      getDeviceList(){
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
              var currNextList = [];
              var currAttr = responseObj[i].equipmentAttribute;
              for (var j = 0; j < currAttr.length;j++) {
                currList.push(currAttr[j]);
                var currList2 = JSON.parse(JSON.stringify(currAttr[j]));
                currList2.attrCurrent = currAttr[j].attrCommon;
                currNextList.push(currList2);
                this.sendToDeviceListData.push(currAttr[j]);
              }
              this.deviceListData.push(currList);
              this.currDeviceListData.push(currNextList);
              this.connectDeviceListWebSocket();
            }
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      connectDeviceListWebSocket(){
        var url = "ws://localhost:8081/deviceListWebSocket/"+Math.random();
        var ws = new WebSocket(url);
        var _this = this;
        ws.onopen = function(e) {
          var curr = JSON.stringify(_this.sendToDeviceListData);
          ws.send(curr);
        };
        ws.onmessage = function(e) {
          var currData = e.data.split("|");
          // console.log(currData);
          var curr = 0;
          for(var i = 0;i < _this.currDeviceListData.length;i++){
            var currTableLIst = _this.currDeviceListData[i];
            for(var j = 0;j < currTableLIst.length;j++){
              if(curr == currData[0]){
                _this.currDeviceListData[i][j].attrCurrent = currData[1];
                var nowCommon = _this.currDeviceListData[i][j].attrCommon;
                var nowFloat = _this.currDeviceListData[i][j].attrFloat;
                if(currData[1] > (parseFloat(nowCommon)+nowFloat/2) || currData[1] < (parseFloat(nowCommon)-nowFloat/2)){
                  let currDate = new Date().toLocaleString();
                  let currStr = "在"+currDate+"有非正常数据出现，请检查或者";
                  let currWarningSensorId = _this.currDeviceListData[i][j].attrId;
                  _this.$Notice.warning({
                    title: '提示',
                    duration: 0,
                    desc: currStr,
                    render: h => {
                      return h('span', [
                        currStr,
                        h('a',{on: {
                            click: function () {
                              _this.warningSendToServer(currWarningSensorId);
                            }
                          }},'重置数据')
                      ]);
                    }
                  });
                }
              }
              curr++;
            }
          }

        };
        ws.onerror = function(e) {
          alert("error");
        };
        ws.onclose = function(e) {
          // console.log("close");
        };
        // 路由跳转时结束websocket链接
        this.$router.afterEach(function () {
          ws.close()
        })
      },

      changeAddDevicePage(){
        this.$router.push({name: 'addEqu'});
      },

      warningSendToServer(currWarningSensorId){
        this.axios({
          method: 'get',
          url: '/warningSensorId',
          params: {
            'currWarningSensorId': currWarningSensorId
          }
        }).then(function (response) {
          var responseData = response.data;
          if(responseData != '0'){
            this.$Message.success({
              content:'重置成功',
              duration: 5
            });
          }else{
            this.$Message.warning({
              content:'重置失败',
              duration: 5
            });
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      }


    }
  }
</script>
