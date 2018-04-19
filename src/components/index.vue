<template>
  <div>
    <!--{{indexChartNUmber}}-->
    <Back-top></Back-top>
    <Collapse v-model="currEquName">
      <Panel name="1" style="font-size: 30px;">
        {{indexEquipment.equipmentName}}
        <div slot="content" style="width: 100%;text-align: center;font-size: 20px;">
          <p>{{indexEquipment.equipmentDescribe}}</p>
          <div v-for="(index,item) in indexEquipment.equipmentAttribute">
            {{index}}
            <!--<IEcharts :option="optionData"/>-->
          </div>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/full.js';
  export default {
    components: {
      IEcharts
    },
    data(){
      return {
        currWebsocketNumber: '',
        currEquName: '1',
        indexEquipment: {
          equipmentName: "案例-污水处理设备",
          equipmentDescribe: "杰出案例展示-污水处理设备实时进水量和排水量检测",
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
        currTime: '',
        indexChartTime: [this.currTime],
        optionData: {
          title: {text: '实时进水量和排水量'},
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {}
            }
          },
          xAxis:{
            data:this.indexChartTime
          },
          series: [{
            data: ["11","22"],
            type: 'line'
          }]
        }

      }
    },
    mounted(){
      this.setPageName(),
      this.getSession()
    },
    methods:{
      setPageName(){
        this.$store.dispatch("setPage",["系统首页"]);
      },
      // 判断有没有session
      getSession(){
        this.axios({
          method: 'get',
          url: '/session'
        }).then(function (response) {
          var responseData = response.data;
          console.log(this.indexChartNUmber[0]);
          if(responseData != '0'){
            this.$store.dispatch("setUser",responseData);
            // console.log(this.loginOrNot);
          }else{
            this.$store.dispatch("setUser","");
          }
          var myDate = new Date();
          this.currTime = myDate.getSeconds();
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
          // console.log("open");
        };
        ws.onmessage = function(e) {
          // console.log(e);
          _this.currWebsocketNumber = e.data;
          var currData = e.data.split("|");
          _this.indexEquipment.equipmentAttribute[currData[0]].attrCurrent = currData[1];
          var currArray = _this.indexChartNUmber[currData[0]];
          var myDate1 = new Date();
          if(currArray.length == 10){
            currArray.splice(0,1);
            currArray.push(currData[1]);
            _this.indexChartTime.splice(0,1);
            _this.indexChartTime.push(myDate1.getSeconds());
          }else{
            currArray.push(currData[1]);
            _this.indexChartTime.push(myDate1.getSeconds());
          }
        };
        ws.onerror = function(e) {
          alert("error");
        };
        ws.onclose = function(e) {
          // console.log("close");
        };
      }
    },
    stompClient:{
      monitorIntervalTime: 100,
      timeout(orgCmd){
        console.log("timeOut");
      }
    }
  }
</script>
