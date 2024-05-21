<template>
  <div class="camera_box">
    <div class="box_wrapper">
      <div class="title">摄像头检测</div>
      <div class="camera_select">
        <div>选择摄像头</div>
        <el-select v-model="cameraValue" class="select_box" placeholder="请选择摄像头">
          <el-option v-for="item in cameraOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <video id="video" class="video_box" width="500" height="300" autoplay playsinline webkit-playsinline="true"
        v-if="isCamera"></video>
      <video id="video" class="video_box" width="500" height="300" autoplay playsinline webkit-playsinline="true"
        style="background:#000;" v-else></video>
      <div class="title" v-if="isCamera">摄像头检测成功</div>
      <div class="title" v-else>摄像头检测失败</div>
      <div class="audio_wrapper">
        <div class="audio_title">麦克风检测</div>
        <div>音量检测结果：{{ isAudio ? audioValue : '' }}</div>
        <div v-if="isAudio" class="audio">麦克风检测成功</div>
        <div v-else class="audio">麦克风检测失败</div>
        <el-button type="primary" class="btn" @click="enterTest">进入考试</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { MonitorExamination, MonitorExaminationByChatTool } from "../utils/api";
import html2canvas from "html2canvas";
import { ElMessage, ElMessageBox,ElNotification } from 'element-plus'
import type { Action } from 'element-plus'
import router from "../router";

let cameraValue:any = ref(1); //摄像头值
let cameraOptions:any = reactive([]);  //摄像头下拉框 
let isCamera:any = ref(true); //是否检测到摄像头
let isAudio:any = ref(true);  //是否检测到麦克风
let audioModels:any = ref(null); //是否存在麦克风设备
let audioValue:any = ref(0); //麦克风音量值
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
    .then(function (stream:any) {
      var video:any = document.querySelector("video");
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
    .catch(function (err) {
      console.log('没有检测到')
      isCamera.value = false; 
      isAudio.value = false; 
      ElMessageBox.alert('无法检测到摄像头或麦克风，可能无法进行考试，请检查设备', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        callback: (action) => {
        },
      })
    });
}



async function cutScreen() {
  html2canvas(document.body).then(function (canvas) {
    let img = canvas.toDataURL("image/png");
    const dataURL = saveAsPNG(canvas);
    document.body.appendChild(convertCanvasToImage(canvas));
    monitorExaminationByChatTool(dataURL);
  });
}

async function monitorExaminationByChatTool(dataURL) {
  let res = await MonitorExaminationByChatTool({
    FileBase64: dataURL.substr(22),
  });
  if (res.success == true) {
    ElMessage({
      message: "截图发送后台成功" + res.error,
      type: "success",
    });
  } else {
    ElMessage.error("截图发送后台失败," + res.error);
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

//获取摄像头和麦克风的型号
const trackDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const audios = devices.filter((device) => device.kind === "audioinput");
    const cameraModel =
      cameras.length > 0 ? cameras[0].label : "No camera found";
    const audioModel = audios.length > 0 ? audios[0].label : "No camera found";
    if (audioModel) {
      cameraOptions.push({
        value: cameraModel,
        label: cameraModel
      })
    }
    cameraValue.value = cameraModel || "没有检测到摄像头"; //摄像头型号
    audioModels.value = audioModel; //麦克风型号
    if (audioModel) {
      // console.log('麦克风检测成功')
      isAudio.value = true;
    } else {
      isAudio.value = false;
    }
  } catch (err) {
    // console.error(err);
    // console.log("Failed to get camera model");
    isAudio.value = false;
  }
};


//获取麦克风的声音
function audioDetection() {
  // let mystatus = document.getElementById("status");
  let audioContext = new (window.AudioContext || window.AudioContext)();
  let mediaStreamSource:any = null;
  let scriptProcessor:any = null;
  let anylyserNode:any = null;
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
        const intervalId = setTimeout(() => {
          anylyserNode.getByteFrequencyData(frequencyData); // 获取音频数据
          const volume = getVolume(frequencyData);
          console.log('volume', volume)
          audioValue.value = `${volume.toFixed(2)} dB`;
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
        // setTimeout(() => {
        //   anylyserNode.getByteFrequencyData(frequencyData);
        //   let maxDecibels = getMaximumDecibels(frequencyData);
        //   console.log("Max Decibels:", maxDecibels);
        //   audioMax.value = maxDecibels;
        // }, 5000);

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
        //   if (maxVal > 10) {
        //     //当音量值大于0.5时，显示“声音太响”字样，并断开音频连接
        //     alert("您的声音太响了,请安静点");
        //     // liveSource.disconnect(levelChecker);
        //   }
        // };
      })
      .catch((error) => {
        // mystatus.innerHTML = "获取音频时好像出了问题" + error;
      });
  } else {
    // mystatus.innerHTML = "不支持获取媒体接口";
  }
}

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
function enterTest() {
  router.push('/Test')
}
onMounted(() => {
  openCamera();
  trackDevices();
  audioDetection();
})

</script>
<style lang="scss">
.camera_box {
  width: 800px;
  padding: 20px;
  background: #ccc;
  margin: 0 auto;

  .box_wrapper {
    .title {
      text-align: center;
      font-weight: bolder;
    }

    .camera_select {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;

      .select_box {
        width: 250px;
      }
    }

    .audio_wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 50px;
      .audio_title {
        font-size: 20px;
        font-weight: bolder;
      }
      .audio{
        margin-top: 20px;
      }

      .btn {
        width: 250px;
      }
    }
  }
}

.video_box {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
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
  width: 1000px;
}

.img-view img {
  display: inline-block;
  margin-right: 5px;
}
</style>