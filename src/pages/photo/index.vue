<template>
  <div class="content ">
    <search />
    <div class="content">
      <div class="title">
        喂，拍一下你的垃圾
      </div>
      <div class="actionview">
        <div @click="chooseImg"
             class="content">
          <div class="imgview">
            <image class="chooseimg"
                   src="/static/images/chooseimg.png"></image>
          </div>
          <text class="imgview_text">拍照识别</text>
        </div>
        <div @click="chooseAR"
             class="content">
          <div class="imgview">
            <image class="chooseimg"
                   src="/static/images/ar.png"></image>
          </div>
          <text class="imgview_text">AR识别</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '../../components/search.vue'
import { queryByImgUrl } from '@/utils/urls.js'
export default {
  computed: {
  },
  methods: {
    // 选择图片
    chooseImg () {
      mpvue.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          mpvue.showLoading({
            title: '上传识别中'
          })
          mpvue.uploadFile({
            url: queryByImgUrl,
            filePath: tempFilePaths[0],
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
    chooseAR () {
      mpvue.navigateTo({
        url: '/pages/ar/main'
      })
    }
  },
  components: {
    Search
  }

}
</script>

<style>
.actionview {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 135%;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.imgview {
  height: 160rpx;
  width: 160rpx;
  border-radius: 50%;
  background-color: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
}
.imgview_text {
  font-size: 32rpx;
  color: #999;
}
.chooseimg {
  height: 80rpx;
  width: 80rpx;
}
.title {
  height: 720rpx;
  width: 450rpx;
  font-size: 46rpx;
  color: #999;
  line-height: 720rpx;
  text-align: center;
}
</style>
