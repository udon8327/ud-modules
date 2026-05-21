<template lang="pug">
#camera-demo
  .video-wrapper
    .target
    video#video(autoplay playsinline)
  ud-button.my-2#capture 拍照
  canvas#canvas(style="display:none;")
  img#preview(style="display:none; width:100%; max-width:100%;")
  ud-button.my-2#upload(style="display:none;") 上傳圖片
</template>

<script>
export default {
  name: "CameraDemo",
  components: {},
  data() {
    return {};
  },
  mounted() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("preview");
    const captureButton = document.getElementById("capture");
    const uploadButton = document.getElementById("upload");

    // 1. 開啟相機
    async function openCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 }, // 希望使用 1280px
            height: { ideal: 960 }, // 希望使用 720px
            facingMode: "environment"
          } // 強制使用後置相機
        });
        video.srcObject = stream;
      } catch (error) {
        console.error("無法開啟相機:", error);
        alert("請允許相機權限");
      }
    }

    openCamera();

    // 2. 拍照並顯示預覽
    captureButton.addEventListener("click", () => {
      const ctx = canvas.getContext("2d");
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // 設定擷取區域大小
      const cropSizeX = videoWidth * 0.7; // 擷取 300x300 px
      const cropSizeY = videoHeight * 0.7; // 擷取 300x300 px
      const sx = (videoWidth - cropSizeX) / 2; // 中心點 X
      const sy = (videoHeight - cropSizeY) / 2; // 中心點 Y
      const sw = cropSizeX;
      const sh = cropSizeY;

      // 設定目標畫布大小
      canvas.width = cropSizeX;
      canvas.height = cropSizeY;

      // 裁剪並繪製到 canvas
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cropSizeX, cropSizeY);

      // 轉換為圖片
      preview.src = canvas.toDataURL("image/png");
      preview.style.display = "block";
      uploadButton.style.display = "block";
    });

    // 3. 上傳圖片
    uploadButton.addEventListener("click", () => {
      canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("image", blob, "photo.png");

        fetch("/upload", {
          // 這裡請改成你的後端 API
          method: "POST",
          body: formData
        })
          .then(response => response.json())
          .then(data => alert("圖片上傳成功！"))
          .catch(error => console.error("上傳失敗:", error));
      }, "image/png");
    });
  },
  methods: {}
};
</script>

<style lang="sass" scoped>
.container
  padding: 15px 0%

video, canvas
  width: 100%
  margin: 0 auto
  display: block

.video-wrapper
  position: relative
  .target
    border: 2px solid aqua
    width: 70%
    height: 70%
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%,-50%)

button
  margin: 10px
  padding: 10px
  font-size: 16px
</style>
