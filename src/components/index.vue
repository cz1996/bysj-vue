<style>
  .fontheader{
    font-size: 30px;
    background-color: #d6c2bc;
    color: white;
    text-align: center;
  }
  .chartBig{
    width: 100%;
    overflow: auto;
  }
  .chartLessOne{
    width: 60%;
    text-align: center;
    float: left;
  }
  .chartLessTwo{
    width: 40%;
    text-align: center;
    background-color: #fbe3dc;
    color: black;
    float: left;
    padding: 20px;
    margin-top: 55px;
  }
  .myChart{
    margin-left: calc(50% - 250px);
    width: 500px;
    height: 300px;
  }
  .equName{
    overflow: auto;
    border-bottom: 1px solid white;
  }
  .equLabel{
    float: left;
    width: 40%;
    text-align: right;
  }
  .equData{
    float: left;
    width: 60%;
    text-align: left;
    padding-left: 10px;
  }
  .bigCar{
    width: 100%;
  }
  .demo-carousel{
    max-width: 1170px;
    height: 200px;
    line-height: 200px;
    color: black;
    text-align: center;
    background-color: #fbe3dc;
    font-size: 20px;
  }
</style>
<template>
  <div>
    <div style="width: 100%;">
      <Carousel class="bigCar">
        <Carousel-item>
          <div class="demo-carousel">工况设备实时数据检测系统</div>
        </Carousel-item>
        <Carousel-item>
          <div class="demo-carousel">个人网站：<a target="_blank" href="http://www.cz1996.cn">www.cz1996.cn</a></div>
        </Carousel-item>
      </Carousel>
    </div>
    <div style="padding-top: 24px;">
      <div class="fontheader">
        {{indexEquipment.equipmentName}}
      </div>

      <div style="width: 100%;text-align: center;font-size: 20px;">
        <p style="font-family: 黑体">{{indexEquipment.equipmentDescribe}}</p>
        <div v-for="item in indexEquipment.equipmentAttribute">
          <hr/>
          <div class="chartBig">
            <div class="chartLessOne">
              <div name="myChart" class="myChart"></div>
            </div>
            <div class="chartLessTwo">
              <div class="equName" style="border-top: 1px solid white;">
                <div class="equLabel">设备名称：</div>
                <div class="equData">{{item.attrName}}</div>
              </div>
              <div class="equName">
                <div class="equLabel">检测间隔：</div>
                <div class="equData">{{item.attrTiming}} s</div>
              </div>
              <div class="equName">
                <div class="equLabel">正常数据：</div>
                <div class="equData">{{item.attrCommon}} 立方米</div>
              </div>
              <div class="equName">
                <div class="equLabel">浮动数据：</div>
                <div class="equData">{{item.attrFloat}} 立方米</div>
              </div>
              <div class="equName">
                <div class="equLabel">实时数据：</div>
                <div class="equData" style="color: #18b566">{{item.attrCurrent}} 立方米</div>
              </div>
            </div>
          </div>
        </div>
        <hr/>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        currWebsocketNumber: '',
        currEquName: '1',
        indexEquipment: {
          equipmentName: "案例展示",
          equipmentDescribe: "污水处理设备实时进水量和排水量检测",
          equipmentAttribute: [{
            attrName: "进水量",
            attrCommon: 100,
            attrFloat: 2.0,
            attrTiming: 2,
            attrCurrent: 100
          },
            {
              attrName: "排水量",
              attrCommon: 50,
              attrFloat: 1.0,
              attrTiming: 5,
              attrCurrent: 50
            }]
        },
        indexChartNUmber: [["100"],["50"]],
        indexChartTime: [[],[]]
      }
    },
    mounted(){
      this.drawCharts(0),
      this.drawCharts(1),
      this.setPageName(),
      this.getSession()
    },
    methods:{
      setPageName(){
        this.$store.dispatch("setPage",["系统首页"]);
        let currData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
        this.indexChartTime[0].push(currData);
        this.indexChartTime[1].push(currData);
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
          }else{
            this.$store.dispatch("setUser","");
          }
          this.connectWebSocket();
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      connectWebSocket(){
        var url = "ws://localhost:8081/websocket/"+Math.random();
        var ws = new WebSocket(url);
        var _this = this;
        ws.onopen = function(e) {
          var curr = JSON.stringify(_this.indexEquipment);
          ws.send(curr);
        };
        ws.onmessage = function(e) {
          _this.currWebsocketNumber = e.data;
          var currData = e.data.split("|");
          _this.indexEquipment.equipmentAttribute[currData[0]].attrCurrent = currData[1];
          if(_this.indexChartNUmber[currData[0]].length == 10){
            _this.indexChartNUmber[currData[0]].splice(0,1);
            _this.indexChartTime[currData[0]].splice(0,1);
          }
          _this.indexChartNUmber[currData[0]].push(currData[1]);
          _this.indexChartTime[currData[0]].push((new Date()).toLocaleTimeString().replace(/^\D*/,''));
          _this.drawCharts(currData[0]);

          var currDataa = parseFloat(currData[1]);
          var nowCommon = _this.indexEquipment.equipmentAttribute[currData[0]].attrCommon;
          var nowFloat = _this.indexEquipment.equipmentAttribute[currData[0]].attrFloat;
          if(currDataa > (parseFloat(nowCommon)+nowFloat/2) || currDataa < (parseFloat(nowCommon)-nowFloat/2)){
            let currDate = new Date().toLocaleString();
            let currStr = "在"+currDate+"有非正常数据出现，请检查或者";
            let currWarningSensorId = '首页测试';
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

      drawCharts(index){
        let myChart = this.$echarts.init(document.getElementsByName('myChart')[index]);

        let currCom = this.indexEquipment.equipmentAttribute[index].attrCommon;
        let currFlo = this.indexEquipment.equipmentAttribute[index].attrFloat;
        currCom = Math.round(currCom);
        currFlo = Math.round(currFlo);
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
          color:['#81b22f','#f3d71c','#f4b9a9'],
          xAxis: {
            type: 'category',
            data: this.indexChartTime[index]
          },
          yAxis: {
            type: 'value',
            min: ymin,
            max: ymax
          },
          series:[
            {
              data: this.indexChartNUmber[index],
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
