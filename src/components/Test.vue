<template>
  <div>测试接口</div>
  <el-button @click="getFace">调用接口</el-button>
</template>

<script setup>
import {AddFace} from '../utils/api'
const getFace = async() => {
   let res = await AddFace({
        Identity:1,
        FileBase64: 20
      })
      if(res.code === 0) {
        console.log('res',res)
      }else{
        console.log('error',res)
      }
}
</script>

<style scoped>

</style>