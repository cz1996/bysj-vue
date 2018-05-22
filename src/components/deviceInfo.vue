<style>
  .chartBig1{
    width: 100%;
    overflow: auto;
    min-height: 510px;
    font-size: 20px;
  }
  .chartLessOne1{
    width: 60%;
    text-align: center;
    float: left;
  }
  .chartLessTwo1{
    width: 40%;
    text-align: center;
    background-color: #fbe3dc;
    color: black;
    float: left;
    padding: 20px;
    margin-top: 55px;
  }
  .myChart1{
    margin-left: calc(50% - 250px);
    width: 500px;
    height: 300px;
  }
  .equName1{
    overflow: auto;
    border-bottom: 1px solid white;
  }
  .equLabel1{
    float: left;
    width: 40%;
    text-align: right;
  }
  .equData1{
    float: left;
    width: 60%;
    text-align: left;
    padding-left: 10px;
  }
</style>

<template>
  <div>
    <!--<div v-if="currDeviceInfo !== null">-->
      <div class="chartBig1">
        <div class="chartLessOne1">
          <div name="myDeviceInfoChart" class="myChart1"></div>
        </div>
        <div v-if="currDeviceInfo !== null">
          <div class="chartLessTwo1">
            <div class="equName1" style="border-top: 1px solid white;">
              <div class="equLabel1">设备名称：</div>
              <div class="equData1">{{currDeviceInfo.attrName}}</div>
            </div>
            <div class="equName1">
              <div class="equLabel1">检测间隔：</div>
              <div class="equData1">{{currDeviceInfo.attrTiming}}</div>
            </div>
            <div class="equName1">
              <div class="equLabel1">正常数据：</div>
              <div class="equData1">{{currDeviceInfo.attrCommon}}</div>
            </div>
            <div class="equName1">
              <div class="equLabel1">浮动数据：</div>
              <div class="equData1">{{currDeviceInfo.attrFloat}}</div>
            </div>
            <div class="equName1">
              <div class="equLabel1">实时数据：</div>
              <div class="equData1" style="color: #18b566">{{currWebsocketDeviceData}}</div>
            </div>
          </div>
        </div>

        <div>
          <div style="clear:both"></div>
          <div style="width: 100%;height: 80px;"></div>
          <div style="width: 100%;float: left;text-align: center;padding-right: 20px;">
            <Button v-on:click="backToLastPage" shape="circle" icon="arrow-left-a" style="width: 60%;font-size: 20px;" size="large">返回设备列表</Button>
          </div>
          <!--<div style="width: 50%;float: left;padding-left: 20px;">-->
            <!--<Button v-on:click="changeCurrDevice" shape="circle" icon="edit" style="width: 60%;font-size: 20px;" size="large">修改当前设备</Button>-->
          <!--</div>-->
        </div>
      </div>
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    data(){
      return{
        currDeviceInfo: null,
        currWebsocketDeviceData: '',
        deviceInfoXTime:[],
        deviceInfoYData:[]
      }
    },
    mounted(){
      this.setPageName(),
      this.getSession()
    },
    watch:{
      deviceInfoXTime(){
        this.drawDeviceInfoCharts();
      }
    },
    methods: {
      setPageName() {
        this.$store.dispatch("setPage", ["系统首页", "设备列表","设备详情"]);
      },

      // 判断有没有session
      getSession() {
        this.axios({
          method: 'get',
          url: '/session'
        }).then(function (response) {
          var responseData = response.data;
          if (responseData != '0') {
            this.$store.dispatch("setUser", responseData);
            this.getCurrDeviceInfoById();
          } else {
            this.$store.dispatch("setUser", "");
            this.$router.push({name: 'index'});
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      // 通过id获取当前选中设备信息
      getCurrDeviceInfoById() {
        this.axios({
          method: 'get',
          url: '/getCurrDeviceInfoById'
        }).then(function (response) {
          var responseData = response.data;
          if (responseData != '0') {
            responseData = responseData.replace(/'/g, '"');
            var currDeviceDataObj = JSON.parse(responseData);
            // console.log(currDeviceDataObj);
            this.currDeviceInfo = currDeviceDataObj;
            this.currWebsocketDeviceData = currDeviceDataObj.attrCommon;
            this.connectDeviceInfoWebSocket();
          } else {
            this.$Message.warning({
              content:'发生未知错误，请重新操作',
              duration: 5
            });
            this.$router.push({name: 'deviceList'});
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      connectDeviceInfoWebSocket(){
        var url = "ws://localhost:8081/deviceInfoWebsocket/"+Math.random();
        var ws = new WebSocket(url);
        var _this = this;
        var currFirstTime = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
        this.deviceInfoXTime.push(currFirstTime);
        this.deviceInfoYData.push(this.currWebsocketDeviceData);
        this.drawDeviceInfoCharts();
        ws.onopen = function(e) {
          var curr = JSON.stringify(_this.currDeviceInfo);
          ws.send(curr);
        };
        ws.onmessage = function(e) {
          _this.currWebsocketDeviceData = e.data;
          var currTime = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
          if(_this.deviceInfoXTime.length == 20){
            _this.deviceInfoXTime.splice(0,1);
            _this.deviceInfoYData.splice(0,1);
          }
          _this.deviceInfoXTime.push(currTime);
          _this.deviceInfoYData.push(e.data);

          var currData = parseFloat(e.data);
          var nowCommon = _this.currDeviceInfo.attrCommon;
          var nowFloat = _this.currDeviceInfo.attrFloat;
          if(currData > (parseFloat(nowCommon)+nowFloat/2) || currData < (parseFloat(nowCommon)-nowFloat/2)){
            let currDate = new Date().toLocaleString();
            let currStr = "在"+currDate+"有非正常数据出现，请检查或者";
            let currWarningSensorId = _this.currDeviceInfo.attrId;
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
          // _this.drawDeviceInfoCharts();
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

      backToLastPage(){
        this.$router.push({name: 'deviceList'});
      },

      // changeCurrDevice(){
      //
      // },

      drawDeviceInfoCharts() {
        var chartDiv = document.getElementsByName('myDeviceInfoChart');
        if (chartDiv != null && chartDiv.length > 0) {
          let myChart = this.$echarts.init(document.getElementsByName('myDeviceInfoChart')[0]);
          let currCom = Math.round(this.currDeviceInfo.attrCommon);
          let currFlo = Math.round(this.currDeviceInfo.attrFloat);
          let ymin = currCom - currFlo;
          let ymax = currCom + currFlo;
          let yCommonMin = currCom - currFlo/2;
          let yCommonMax = currCom + currFlo/2;

          myChart.setOption({
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data:['正常范围内数据','非正常范围内数据'],
              selected: {
                '正常范围内数据' :true,
                '非正常范围内数据' :true,
              }
            },
            xAxis: {
              type: 'category',
              data: this.deviceInfoXTime
            },
            color:['#81b22f','#f3d71c','#f4b9a9'],
            yAxis: {
              type : 'value',
              min: ymin,
              max: ymax
            },

            series:[
              {
                data: this.deviceInfoYData,
                type: 'line'
              },
              {
                name:'正常范围内数据',
                type:'line',
                animation: false,
                areaStyle: {
                  normal: {}
                },
                lineStyle: {
                  normal: {
                    width: 1
                  }
                },
                markArea: {
                  data: [[{
                    yAxis: yCommonMin
                  }, {
                    yAxis: yCommonMax
                  }]]
                },

              },
              {
                name:'非正常范围内数据',
                type:'line',
                animation: false,
                areaStyle: {
                  normal: {}
                },
                lineStyle: {
                  normal: {
                    width: 1
                  }
                },
                markArea: {
                  data: [[{
                    yAxis: ymin
                  }, {
                    yAxis: yCommonMin
                  }],[{
                    yAxis: yCommonMax
                  }, {
                    yAxis: ymax
                  }]]
                }

              }
            ]
          });
        }
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
