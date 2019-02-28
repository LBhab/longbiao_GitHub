<template>
    <div id="app">
        <div>我是子组件</div>
        <div>从父级传过来的数据是:{{sendData}}</div>
        <button @click="addData('我是子级要传到父级的数据哟')">点我给父级传数据</button>
    </div>
</template>
<script>
export default {
    name:'child',
    props:['sendData'],//接受父级传过来的数据 tips:sendData 是定义在父级标签上的一个属性（可以数组，对象，等等）
    methods: {
        addData(str){
              this.$emit('showChildData',str);//子级传父级使用this.$emit('定义在父级接收子级参数的函数名',参数)
        }
    },
}
</script>

<style lang="less" scoped>

</style>

