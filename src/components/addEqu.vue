<style>
  .addEqu-div{
    text-align: center;
    min-height: 510px;
  }
  .equipmentName-input{
    width: 70%;
    margin-top: 20px;
  }
  .equipmentInfo-input{
    width: 70%;
    margin-top: 20px;
  }
  .addEqu-font{
    padding-top: 10px;
    float: left;
  }
  .addEqu-form{
    width: 70%;
    margin-top: 20px;
    margin-left: 15%;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    overflow: hidden;
  }
  .addEqu-Btn{
    float: right;
    font-size: 14px;
    width: 100px;
  }
  .addEqu-table{
    margin-top: 20px;
  }
  .addEqu-confirmBtn{
    margin-top: 50px;
    font-size: 14px;
    width: 70%;
    background-color: #51abf3;
  }
  .currAddEquName-input,
  .currAddEquTiming-input,
  .currAddEquCommon-input,
  .currAddEquFloat-input{
    margin-bottom: 15px;
  }
</style>
<template>
  <div>
    <div class="addEqu-div">
      <Input v-model="equipmentName" placeholder="请输入设备名称" class="equipmentName-input" size="large"></Input><br/>
      <Input v-model="equipmentInfo" type="textarea" class="equipmentInfo-input" placeholder="请输入设备简介"></Input><br/>
      <div class="addEqu-form">
        <div class="addEqu-font">请添加设备的检测对象</div>
        <Button v-on:click="addModal = true" class="addEqu-Btn">添加</Button>
        <Modal
          v-model="addModal"
          title="请输入设备参数"
          @on-ok="addEquData">
          <Input v-model="currAddEquName" placeholder="设备名称" class="currAddEquName-input"></Input><br/>
          <Input v-model="currAddEquTiming" placeholder="检测间隔(s)" class="currAddEquTiming-input"></Input><br/>
          <Input v-model="currAddEquCommon" placeholder="正常数据(整数或者小数)" class="currAddEquCommon-input"></Input><br/>
          <Input v-model="currAddEquFloat" placeholder="浮动数据(整数或者小数)" class="currAddEquFloat-input"></Input><br/>
          <div style="color: red;">
            <div>*检测间隔默认单位为秒，不可更改。
            </div>
          </div>
        </Modal>
      </div>
      <div style="width: 70%;margin-left: 15%;">
        <Table size="large" border :columns="tableColumns" :data="tableData" class="addEqu-table"></Table>
      </div>
      <Button v-on:click="addEquToServer" class="addEqu-confirmBtn">确认添加</Button>
    </div>

    <Modal
      v-model="changeModal"
      title="修改设备参数"
      @on-ok="changeEquData">
      <Input v-model="currChangeEquName" placeholder="设备名称" class="currAddEquName-input"></Input><br/>
      <Input v-model="currChangeEquTiming" placeholder="检测间隔(s)" class="currAddEquTiming-input"></Input><br/>
      <Input v-model="currChangeEquCommon" placeholder="正常数据(整数或者小数)" class="currAddEquCommon-input"></Input><br/>
      <Input v-model="currChangeEquFloat" placeholder="浮动数据(整数或者小数)" class="currAddEquFloat-input"></Input><br/>
      <div style="color: red;">
        <div>*检测间隔默认单位为秒，不可更改。
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        equipmentName: '',
        equipmentInfo: '',
        currAddEquName: '',
        currAddEquTiming: '',
        currAddEquCommon: '',
        currAddEquFloat: '',
        currChangeEquIndex: '',
        currChangeEquName: '',
        currChangeEquTiming: '',
        currChangeEquCommon: '',
        currChangeEquFloat: '',
        addModal: false,
        changeModal: false,
        tableColumns: [
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
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.currChangeEquIndex = params.index;
                      this.currChangeEquName = this.tableData[params.index].name;
                      this.currChangeEquTiming = this.tableData[params.index].time;
                      this.currChangeEquCommon = this.tableData[params.index].common;
                      this.currChangeEquFloat = this.tableData[params.index].float;
                      this.changeModal = true;
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],

        tableData: []
      }
    },
    mounted(){
      this.setPageName(),
        this.getSession()
    },
    methods:{
      setPageName(){
        this.$store.dispatch("setPage",["系统首页","新建设备"]);
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
            this.$router.push({name: 'index'});
          }
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },

      // 向表格里添加数据
      addEquData(){
        var currEqu = {
          attrName: this.currAddEquName,
          attrTiming: this.currAddEquTiming,
          attrCommon: this.currAddEquCommon,
          attrFloat: this.currAddEquFloat,
        };
        this.tableData.push(currEqu);
        this.currAddEquName = '';
        this.currAddEquTiming = '';
        this.currAddEquCommon = '';
        this.currAddEquFloat = '';
        this.$Message.success({
          content:'添加成功',
          duration: 2
        });
      },

      // 修改表格的数据
      changeEquData(){
        var currChangeEqu = {
          name: this.currChangeEquName,
          time: this.currChangeEquTiming,
          common: this.currChangeEquCommon,
          float: this.currChangeEquFloat,
        };
        this.tableData.splice(this.currChangeEquIndex,1,currChangeEqu);
        this.$Message.success({
          content:'修改成功',
          duration: 2
        });
      },

      // 删除表格的数据
      remove(index) {
        this.tableData.splice(index, 1);
        this.$Message.success({
          content:'删除成功',
          duration: 2
        });
      },

      // 向服务器发送新建设备的数据
      addEquToServer(){
        if(this.equipmentName == '' || this.equipmentInfo == '' || this.tableData == []){
          this.$Message.warning({
            content:'请重新输入完整设备信息',
            duration: 3
          });
        }else{
          var currAddNewEquip = {
            equipmentName: this.equipmentName,
            equipmentDescribe: this.equipmentInfo,
            equipmentAttribute: this.tableData
          };
          this.axios({
            method: 'get',
            url: '/addNewEquipment',
            params: {
              'currAddNewEquip': currAddNewEquip
            }
          }).then(function (response) {
            var responseData = response.data;
            if(responseData == '成功'){
              this.$Message.success({
                content:'添加设备成功',
                duration: 5
              });
              this.equipmentName = '';
              this.equipmentInfo = '';
              this.tableData = [];
            }else{
              this.$Message.warning({
                content: responseData,
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
