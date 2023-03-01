<template>
  <div>

    <canvas id="screen" width="300" height="300"></canvas>
  </div>
  <div class="box">
    <video
      id="video"
      width="500"
      height="500"
      autoplay
      playsinline
      webkit-playsinline="true"
    ></video>
    <!-- <h1>检测到您的摄像头为：{{ deviceModel }}</h1>
    <h1>检测到您的麦克风为：{{ audioModels }}</h1> -->
    <!-- <h1>麦克风最大的阈值为：{{ audioMax }}</h1> -->
    <div id="imgView"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {useRouter} from 'vue-router'

const router = useRouter();

let isFullScreen = ref(false); //是否全屏
let exitFullScreenNum = ref(0); //退出全屏的次数
let isCutScreen = ref(false); //是否切屏
let cutScreenNum = ref(0); //切屏的次数
let imgUrl = ref(null);

onMounted(() => {
  focusOrblue();
  enterTest(); //进入全屏
  judegIsFullScreen();

});
// 实现全屏
function screenfullClick() {
  launchFullscreen(document.documentElement);
  notice(); //友情提示
}
function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
}
//页面是否失去焦点
function focusOrblue() {
  window.onblur = function () {
    console.log("失去焦点");
    isCutScreen.value = true;
  };
  window.onfocus = function () {
    console.log("得到焦点");
    isCutScreen.value = false;
  };

  document.addEventListener("visibilitychange", function (e) {
    console.log(document.visibilityState);
    let state = document.visibilityState;
    if (state == "hidden") {
      console.log(document.visibilityState, "用户离开了");
      isCutScreen.value = true;
    }
    if (state == "visible") {
      console.log(document.visibilityState, "回来了");
      isCutScreen.value = false;
    }
  });
}


const enterTest = () => {
  ElMessageBox.alert("考试已开启全屏模式", "进入全屏模式", {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "进入",
    callback: (action) => {
      screenfullClick();
    },
  });
};

//进入全屏的提示
const notice = () => {
  ElNotification({
    title: "友情提示",
    message: "你已经进入全屏考试模式，请不要退出全屏考试模式",
    type: "warning",
  });
};
//退出全屏的提示
const exitNotice = () => {
  ElNotification({
    title: "友情提示",
    message: `你已经退出全屏考试模式${exitFullScreenNum.value}次，请不要退出全屏考试模式`,
    type: "warning",
  });
};
//切屏的提示
const cutScreenNotice = () => {
  ElNotification({
    title: "友情提示",
    message: `你已经切屏作弊${cutScreenNum.value}次，请不要再切屏`,
    type: "warning",
  });
};

const judegIsFullScreen = () => {
  window.onresize = () => {
    // 可视区域的高度
    const clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    // screen是window的属性方法，window.screen可省略window，指的是窗口
    isFullScreen.value = screen.height == clientHeight;
  };
};

//监听是否退出了全屏
watch(isFullScreen, async (newQuestion, oldQuestion) => {
  if (newQuestion == false) {
    exitFullScreenNum.value++;
    exitNotice();
  }
});

//监听是否退出了全屏
watch(isCutScreen, async (newQuestion, oldQuestion) => {
  if (newQuestion == true) {
    cutScreenNum.value++;
    if (cutScreenNum.value === 5) {
      ElMessageBox.alert("你已经切屏5次,考试结束", "警告", {
        confirmButtonText: "确认",
        callback: (action) => {
          router.push({
            path:'/home'
          })
        },
      });
    }
    cutScreenNotice();
  }
});


//错误时的提示
const errorMessage = (text) => {
  ElMessage.error(text);
};
</script>


<style>
.el-notification .el-notification__closeBtn {
  top: 2px;
}
</style>