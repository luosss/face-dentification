<template>
  <div class="register-box">
    <div>
      <el-row>
        <el-col :span="24">
          <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
            >Identity</span
          >
          <el-input
            v-model="ids"
            class="w-50 m-2"
            placeholder="请输入identity"
          />
        </el-col>
        <el-col :span="24">
          <spn>第一张照片</spn>
          <el-input
            v-model="base64Img1"
            class="w-50 m-2"
            placeholder="请拍一张照片"
          />
        </el-col>
        <el-col :span="24">
          <spn>第二张照片</spn>
          <el-input
            v-model="base64Img2"
            class="w-50 m-2"
            placeholder="请拍第二张照片"
          />
        </el-col>
      </el-row>
      <div class="btn">
        <el-button @click="openCamera">打开摄像头</el-button>
        <el-button @click="cameraing(1)" :disabled="isOpenCamera">拍照</el-button>
        <el-button @click="registerFace" :disabled="isOpenCamera">登记人脸</el-button>
        <el-button @click="cameraing(2)" :disabled="isOpenCamera">再次拍照</el-button>
        <el-button @click="faceComparison" :disabled="isOpenCamera">两次照片比对</el-button>
        <el-button @click="clearPhoto">清空所有照片</el-button>
      </div>
    </div>
    <div>
      <div class="box video_wrapper">
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
        <div id="imgView" class="img-view"></div>
      </div>
      <canvas id="screen" width="300" height="300"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AddFace, CompareFace } from "../utils/api";

let ids = ref(null);
let base64Img1 = ref(null);
let base64Img2 = ref(null);
let isOpenCamera = ref(true);


let canvas = document.createElement("canvas");
canvas.width = 300;
canvas.height = 300;
const ctx = canvas.getContext("2d");

var constraints = { audio: true, video: true };

function openCamera() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      isOpenCamera.value = false;
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
    })
    .catch(function (err) {});
}

function cameraing(nums) {
  let imgView = document.getElementById("imgView");
  //  let childs = document.querySelectorAll('img')
  //   for (var i = 0; i < childs.length; i++) {
  //     imgView.removeChild(childs[i]);
  //   }
  // 将视频帧渲染到画布上
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // 将画布内容导出为图片，并输出到控制台
  const dataURL = saveAsPNG(canvas);
  const identityFaceURL = saveAsJpeg(canvas);
  if (nums === 1) {
    let childs = document.querySelectorAll("img");
    for (var i = 0; i < childs.length; i++) {
      imgView.removeChild(childs[i]);
    }
    base64Img1.value = dataURL;
  } else if (nums === 2) {
    let childs = document.querySelectorAll("img");
    for (var i = 0; i < childs.length; i++) {
      if(i == 1) {
        imgView.removeChild(childs[i]);
      }
      
    }
    base64Img2.value = dataURL;
  }

  imgView.appendChild(convertCanvasToImage(canvas));

  sessionStorage.setItem("base64Img1", base64Img1.value);
}

async function registerFace() {
  let res = await AddFace({
    Identity: ids.value,
    FileBase64: base64Img1.value.substr(22),
  });
  if (res.success == true) {
    ElMessage({
      message: "人脸信息录入成功",
      type: "success",
    });
  } else {
    ElMessage.error("人脸信息录入失败," + res.error);
  }
}

async function faceComparison() {
  let res = await CompareFace({
    Identity: ids.value,
    FileBase64: base64Img2.value.substr(22),
  });
  if (res.success == true) {
    ElMessage({
      message: "人脸信息比对通过," + res.error,
      type: "success",
    });
  } else {
    ElMessage.error("人脸信息比对失败," + res.error);
  }
}

function clearPhoto() {
  isOpenCamera.value = true;
  let imgView = document.getElementById("imgView");
   let childs = document.querySelectorAll('img')
    for (var i = 0; i < childs.length; i++) {
      imgView.removeChild(childs[i]);
    }
}

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

//错误时的提示
const errorMessage = (text) => {
  ElMessage.error(text);
};
</script>
<style>
.register-box {
  display: flex;
  margin-left: 100px;
  width: 500px;
}
.register-box > div {
  height: 500px;
  width: 250px;
}
.btn {
  display: flex;
  flex-direction: column;
  width: 120px;
  margin-top: 20px;
}
.btn .el-button {
  width: 120px;
  margin-bottom: 10px;
  margin-left: 0;
}
.img-view {
  display: flex;
  margin-left: 10px;
}
.img-view img {
  margin-left: 20px;
}
#video,
#imgView {
  margin-left: 400px;
}
.video_wrapper {
  position: absolute;
  left: 100px;
  top: 50px;
}
</style>