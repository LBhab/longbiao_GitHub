<template>
      <div id="page">
            <div class="aside" >
                <div class="slect" command='1' @click="changeColor(1)">皮肤1</div>
                <div class="slect" command='2' @click="changeColor(2)">皮肤2</div>
                <div class="slect" command='3' @click="changeColor(3)">皮肤3</div>
            </div>
            <div class="content">
                  <div class="header">top</div>
                  <div class="main">middle</div>
            </div>
      </div>
</template>
<script>
export default {
      name:"bgcolor",
      components:{},
      data(){
            return{}
      },
      watch:{},
      computed:{},
      methods:{
           changeColor(data){
                 console.log(data);
                 //把className theme1，theme2，theme3挂载在app.vue的<div id="app"></div>上
                 document.getElementById('app').className = 'theme'+data
                 this.localStorage();
           }, 
           //存储localStoarge，用于进入系统时，记住用户上一次的选择，自动加载用户上一次选择的主题主题，记得在mounted()里面调用
           localStorage(){
                 localStorage.setItem('app',document.getElementById('app').className)
           }
      },
      mounted(){
            this.localStorage();
      }
}
</script>
<style lang="less" scoped>

</style>

