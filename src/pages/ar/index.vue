<template>
  <div>
    <camera v-if="showCamera"
            device-position="back"
            flash="off"
            binderror="error"
            style="width:100vw; height:100vh;">
      <cover-view class='bottom-block'>
        <cover-image class='takePhoto'
                     src='/static/images/ar.png'
                     @click='takeAndPredict'>
        </cover-image>
      </cover-view>
    </camera>
    <canvas v-if="showCanvas"
            canvas-id="canvas"
            class="canvas"
            style="width:300px; height:300px;">
    </canvas>
  </div>
</template>
<script>
import { queryByImgUrl } from '@/utils/urls.js'
export default {
  data () {
    return {
      photoWidth: 0,
      photoHeight: 0,
      showCamera: true, // 照相机显示
      showCanvas: false // 图片显示
    }
  },

  components: {

  },
  onShow () {
    this.showCamera = true
    this.showCanvas = false
  },

  methods: {
    // 截取照片
    takeAndPredict () {
      const ctx = mpvue.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          this.showCamera = false
          this.showCanvas = true
          this.drawImage(res.tempImagePath)
          mpvue.showLoading({
            title: '上传识别中'
          })
          mpvue.uploadFile({
            url: queryByImgUrl, // 仅为示例，非真实的接口地址
            filePath: res.tempImagePath,
            name: 'file',
            header: {
              'content-type': 'multipart/form-data'// 记得设置
            },
            formData: {
              'user': 'test'
            },
            success (res) {
              mpvue.hideLoading()
              const data = res.data
              console.log('data', data)
              if (data) {
                mpvue.setStorageSync('garlist', data) // 因为返回来的可能是多数据的，所以保存起来，不过不作为历史查询
                mpvue.navigateTo({
                  url: `/pages/detail/main`
                })
              }
            }
          })
        }
      })
    },
    drawImage (imagePath) {
      const cv = mpvue.createCanvasContext('canvas', this)
      const drawFunc = () => {
        cv.drawImage(imagePath, 0, 0, this.photoWidth, this.photoWidth, 0, 0, 300, 300)
        cv.draw()
      }
      if (this.photoWidth === 0) {
        mpvue.getImageInfo({
          src: imagePath,
          success: (res) => {
            this.photoWidth = res.width
            this.photoHeight = res.height
            drawFunc()
          }
        })
      } else {
        drawFunc()
      }
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style>
.bottom-block {
  bottom: 0px;
  height: 200rpx;
  width: 100%;
  position: absolute;

  display: flex;
  justify-content: space-around;
  align-items: center;
}

.takePhoto {
  width: 132rpx;
  height: 132rpx;
}
.canvas{
  margin:60rpx auto
}
</style>
