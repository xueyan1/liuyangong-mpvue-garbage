<template>
  <div class="content ">
    <search />
    <div class="content">
      <div class="title">
        喂，拍一下你的垃圾
      </div>
      <div class="actionview">
        <div bindtap="chooseImg"
             class="content">
          <div class="imgview">
            <image class="chooseimg"
                   src="/static/images/chooseimg.png"></image>
          </div>
          <text class="imgview_text">拍照识别</text>
        </div>
        <div bindtap="chooseAR"
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
export default {
  computed: {
  },
  methods: {

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
  width: 80%;
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
