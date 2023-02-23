<template>
  <div class="box">
    <video
      id="video"
      width="500"
      height="500"
      autoplay
      playsinline
      webkit-playsinline="true"
    ></video>
    <h1>检测到您的摄像头为：{{ deviceModel }}</h1>
    <h1>检测到您的麦克风为：{{ audioModels }}</h1>
    <div id="imgView"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

let deviceModel = ref(null);
let audioModels = ref(null);

let canvas = document.createElement("canvas");
canvas.width = 300;
canvas.height = 300;
const ctx = canvas.getContext("2d");

var constraints = { audio: true, video: true };

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(function (stream) {
    trackDevices();
    var video = document.querySelector("video");
    // 旧的浏览器可能没有srcObject
    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      //避免在新的浏览器中使用它，因为它正在被弃用。
      video.src = window.URL.createObjectURL(stream);
    }
    video.onloadedmetadata = function (e) {
      video.play();
    };
    setInterval(() => {
      let imgView = document.getElementById("imgView");
      // 将视频帧渲染到画布上
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // 将画布内容导出为图片，并输出到控制台
      const dataURL = saveAsPNG(canvas)
      imgView.appendChild(convertCanvasToImage(canvas));
    }, 50000);
  })
  .catch(function (err) {
    console.log(err.name + ": " + err.message);
  });

const convertCanvasToImage = (canvas) => {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
};

const saveAsPNG = (canvas) => {
  return canvas.toDataURL("image/png");
}

//获取摄像头和麦克风的型号
const trackDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const audios = devices.filter((device) => device.kind === "audioinput");
    const cameraModel =
      cameras.length > 0 ? cameras[0].label : "No camera found";
    const audioModel = audios.length > 0 ? audios[0].label : "No camera found";
    deviceModel.value = cameraModel; //摄像头型号
    audioModels.value = audioModel; //麦克风型号
  } catch (err) {
    console.error(err);
    console.log("Failed to get camera model");
  }
};
</script>

<style scoped>
.box {
  width: 800px;
}
.box .imgView {
  width: 300px;
}
</style>