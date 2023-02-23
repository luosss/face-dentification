<script setup>
import { reactive,ref} from "@vue/reactivity"
import { computed, onMounted, watch } from "@vue/runtime-core"
import BlogPost from '@/components/BlogPost.vue'
defineProps({

})


const awesome = ref(false)
const list = reactive([1,2,3,4])
const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
function add () {
  console.log(11111)
  question.value = '1111'
}
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})

const largeFont = (a) => {
  console.log(3333,a)
}


</script>

<template>
  <div class="greetings">
    <h1 v-if="awesome">vue is awesome</h1>
    <h1 v-else>oh no</h1>
    <button @click="add">提交</button>
    <h3>{{answer}}</h3>
    <br>
    <BlogPost title="3333" @largeFont="largeFont">222</BlogPost>
  </div>
</template>

<style scoped>
/* h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
} */
</style>
