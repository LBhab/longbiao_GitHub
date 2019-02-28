<template>
      <div id="page">
             <div>我是父级</div>
             <div>从子级拿到的数据是:{{childData}}</div>
             <son @showChildData = 'getChildData' :sendData='fatherData' style="margin-top:100px"></son>
      </div>
</template>
<script>
import son from "../child/child.vue";
export default {
    name:'father',
    components:{
        son
    },
    data() {
        return {
            childData:'',
            fatherData:['我是父级要传到子级的数据哟']
        }
    },
    methods: {
        getChildData(data){//获取
             this.childData = data;
        }
    },
}
</script>
<style lang="less" scoped>

</style>


