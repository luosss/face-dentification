<template>
  <div class="wrapper">
    <el-button @click="devicesAuthorization">设备授权</el-button>
    <el-button @click="faceRegisterAndComparison" type="primary"
      >人脸录入和人脸比对</el-button
    >
    <el-button @click="livingDetection" type="info">活体检测</el-button>
    <el-button @click="verifyIdentityFace" type="warning">人脸核身</el-button>
    <el-button @click="realTiemDetection" type="danger">实时检测</el-button>
    <el-button @click="microphoneDecection" type="danger">麦克风检测</el-button>
    <el-button @click="fullScreen" type="danger">防作弊</el-button>
    
  </div>
</template>

<script setup>
import { ref, onMounted,watch } from "vue";
import { useRouter } from "vue-router";

let deviceModel = ref(null);
let audioModels = ref(null);

const router = useRouter();

let canvas = document.createElement("canvas");
canvas.width = 300;
canvas.height = 300;
const ctx = canvas.getContext("2d");
var constraints = { audio: true, video: true };
var mystatus = document.getElementById("status");
let imgUrl = ref(null);

let isFullScreen = ref(false); //是否全屏
let exitFullScreenNum = ref(0); //退出全屏的次数
let isCutScreen = ref(false); //是否切屏
let cutScreenNum = ref(0); //切屏的次数

onMounted(() => {

});

function devicesAuthorization() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      ElMessage("摄像头、麦克风已授权");
    })
    .catch(function (err) {
      errorMessage("摄像头，麦克风未授权");
    });
}

function faceRegisterAndComparison() {
  router.push("/faceRegisterAndComparison");
}
function faceComparison() {
  router.push("/faceComparison");
}
function livingDetection() {
  router.push("/livingDetection");
}
function verifyIdentityFace() {
  router.push("/verifyIdentityFace");
}
function realTiemDetection() {
  router.push("/realTimeDetection");
}
function microphoneDecection() {
  router.push("/microphoneDecection");
}

// navigator.mediaDevices
//   .getUserMedia(constraints)
//   .then(function (stream) {
//     trackDevices();
//     audioDetection();
//     var video = document.querySelector("video");
//     // 旧的浏览器可能没有srcObject
//     if ("srcObject" in video) {
//       video.srcObject = stream;
//     } else {
//       //避免在新的浏览器中使用它，因为它正在被弃用。
//       video.src = window.URL.createObjectURL(stream);
//     }
//     video.onloadedmetadata = function (e) {
//       video.play();
//     };
//     let imgView = document.getElementById("imgView");
//     // 将视频帧渲染到画布上
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     // 将画布内容导出为图片，并输出到控制台
//     const dataURL = saveAsPNG(canvas);
//     imgView.appendChild(convertCanvasToImage(canvas));

//     setTimeout(() => {
//       let imgView = document.getElementById("imgView");
//       // 将视频帧渲染到画布上
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       // 将画布内容导出为图片，并输出到控制台
//       const dataURL = saveAsPNG(canvas);
//       const identityFaceURL = saveAsJpeg(canvas);
//       imgView.appendChild(convertCanvasToImage(canvas));
//       // enterTest('当前环境，符合考试环境,进入考试界面", "温馨提示')
//       // addFace(dataURL);
//       // compareFace(dataURL);
//       // detectLivingFace(dataURL);
//       // // verifyIdentityFace(identityFaceURL);
//       // monitorExamination(dataURL);
//     }, 2000);
//     setInterval(() => {
//       //   let imgView = document.getElementById("imgView");
//       //   // 将视频帧渲染到画布上
//       //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       //   // 将画布内容导出为图片，并输出到控制台
//       //   const dataURL = saveAsPNG(canvas);
//       //   imgView.appendChild(convertCanvasToImage(canvas));
//       //  addFace(dataURL)
//     }, 10000);
//   })
//   .catch(function (err) {
//     errorMessage("获取摄像头或麦克风失败");
//     //  enterTest('当前环境，不符合考试环境", "温馨提示')
//   });

//获取摄像头和麦克风的型号
const trackDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const audios = devices.filter((device) => device.kind === "audioinput");
    const cameraModel =
      cameras.length > 0 ? cameras[0].label : "No camera found";
    const audioModel = audios.length > 0 ? audios[0].label : "No camera found";
    deviceModel.value = cameraModel || "没有"; //摄像头型号
    audioModels.value = audioModel; //麦克风型号
  } catch (err) {
    console.error(err);
    console.log("Failed to get camera model");
  }
};

//获取麦克风的声音
function audioDetection() {
  let mystatus = document.getElementById("status");
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let mediaStreamSource = null;
  let scriptProcessor = null;
  let anylyserNode = null;
  let isAlerted = false;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaStreamSource = audioContext.createMediaStreamSource(stream);
        anylyserNode = audioContext.createAnalyser();
        anylyserNode.fftSize = 2048; //设置FFT的大小
        mediaStreamSource.connect(anylyserNode);

        // 设置频率数据的大小
        const frequencyDataLength = anylyserNode.frequencyBinCount;
        const frequencyData = new Uint8Array(frequencyDataLength);

        // 记录最大音量值
        let maxDecibels = -Infinity;
        const intervalId = setInterval(() => {
          anylyserNode.getByteFrequencyData(frequencyData); // 获取音频数据
          const volume = getVolume(frequencyData);
          mystatus.innerHTML = `您的音量值为：${volume.toFixed(2)} dB`;
          if (Number(volume.toFixed(2)) > 30 && !isAlerted) {
            ElNotification({
              title: "友情提示",
              message: "你当前环境音大于考场允许环境",
              type: "warning",
            });
            isAlerted = true;
          } else {
            isAlerted = false;
          }
        }, 5000);

        // 5秒后停止获取音频数据，并输出最大分贝值
        setTimeout(() => {
          anylyserNode.getByteFrequencyData(frequencyData);
          let maxDecibels = getMaximumDecibels(frequencyData);
          console.log("Max Decibels:", maxDecibels);
          audioMax.value = maxDecibels;
        }, 500000);

        scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
        mediaStreamSource.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        // scriptProcessor.onaudioprocess = function (e) {
        //   let buffer = e.inputBuffer.getChannelData(0);
        //   //创建变量并迭代来获取最大的音量值
        //   var maxVal = 0;
        //   for (var i = 0; i < buffer.length; i++) {
        //     if (maxVal < buffer[i]) {
        //       maxVal = buffer[i];
        //     }
        //   }
        //   //显示音量值
        //   mystatus.innerHTML = "您的音量值：" + Math.round(maxVal * 100);
        //   if (maxVal > 10) {
        //     //当音量值大于0.5时，显示“声音太响”字样，并断开音频连接
        //     mystatus.innerHTML = "您的声音太响了!!";
        //     alert("您的声音太响了,请安静点");
        //     // liveSource.disconnect(levelChecker);
        //   }
        // };
      })
      .catch((error) => {
        mystatus.innerHTML = "获取音频时好像出了问题" + error;
      });
  } else {
    mystatus.innerHTML = "不支持获取媒体接口";
  }
}

function fullScreen() {
  router.push('/fullScreen')
}
//错误时的提示
const errorMessage = (text) => {
  ElMessage.error(text);
};

//将canvas转换成图片
const convertCanvasToImage = (canvas) => {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
};

//保存为png
const saveAsPNG = (canvas) => {
  return canvas.toDataURL("image/png");
};
//保存为jpeg
const saveAsJpeg = (canvas) => {
  return canvas.toDataURL("image/jpeg");
};

// 计算音量值的函数
function getVolume(dataArray) {
  const rms = getRMS(dataArray);
  return 20 * Math.log10(rms / 2);
}

// 计算 RMS 值的函数
function getRMS(dataArray) {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i] * dataArray[i];
  }
  const mean = sum / dataArray.length;
  return Math.sqrt(mean);
}

const enterTest = (title) => {
  ElMessageBox.alert('进入全屏考试界面"', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "进入",
    callback: (action) => {
      screenfullClick();
    },
  });
};

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

function exitFullScreen() {
  launchFullscreen(document.documentElement);
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
    // if (cutScreenNum.value === 5) {
    //   ElMessageBox.alert("你已经切屏5次,考试结束", "警告", {
    //     confirmButtonText: "确认",
    //     callback: (action) => {
    //       router.push({
    //         path:'/home'
    //       })
    //     },
    //   });
    // }
    cutScreenNotice();
  }
});

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
</script>
<style scope>
.wrapper {
  display: flex;
  justify-content: center;
  margin-top: 400px;
}
</style>