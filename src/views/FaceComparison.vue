<template>
  <div>人脸注册</div>
  <el-input v-model="ids"></el-input>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

let ids = ref(null);;
let base64Img1 = ref(null);

</script>