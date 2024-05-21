<template>
  <div>
     <div id="status">预备开始</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";


var mystatus = document.getElementById("status");

onMounted(() => {
  audioDetection()
})

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
        }, 1000);

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

</script>