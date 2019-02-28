<template>
      <div id="page">
              <div id="content">
                     <div class="aside">
                         <div class="button" style="width:100%">
                             <router-link to="/other">其他</router-link>
                         </div>
                     </div>
                     <div class="box">
                           <div class="header">
                                  <!-- 按钮 -->
                                  <div class="select" @click="change">切换</div>
                                  <!-- 选择框架 -->
                                  <div class="change" ref="change">
                                      <div >change_one</div>
                                      <div>change_two</div>
                                      <div>change_three</div>
                                  </div>
                           </div>
                           <div class="main">
                                <router-view></router-view>
                           </div>
                           <div class="footer">
                               <div ref="test" style="color:#fff ">sssss</div>
                           </div>
                     </div>
              </div>
      </div>
</template>
<style lang="less" scoped>
   @import url("./home.less");
</style>
<script src="./home.js"></script>
