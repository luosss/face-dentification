<template>
  <div>123213213123</div>
  <button @click="goPage">跳转页面</button>
</template>


<script setup>
import { ref, onMounted,onUnmounted } from "vue";
import { useRouter } from "vue-router";

let isFullScreen = true;

const router = useRouter();

function requestFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function fullScrrenPop() {
  ElMessageBox.alert('This is a message', 'Title', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',
    callback: (action) => {
      requestFullscreen(document.documentElement);
    },
  })
}

window.onfocus = function () {
     console.log('切屏一次')
  };

document.addEventListener("fullscreenchange", function (event) {
  if (document.fullscreenElement) {
    console.log(1111111111)
    if(isFullScreen) {
      console.log(222222222)
      isFullScreen = false;
      console.log(isFullScreen)
    }else{
      console.log('切屏一次')
    }
   
  }else{
    fullScrrenPop()
  }
});
function goPage() {
  router.push('test3')
}

onMounted(() => {
  fullScrrenPop();
})
onUnmounted(() => {
  if(document.fullscreenElement) {
    document.exitFullscreen();
  }
}) 


</script>

<style scoped>

</style>