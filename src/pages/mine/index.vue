<template>
  <div>
    <div class="head">
      <div class="userinfo">
        <open-data class="useravata"
                   type="userAvatarUrl"></open-data>
      </div>
      <open-data class="nickname"
                 default-text="小天使"
                 type="userNickName"></open-data>
    </div>

    <div class='history-text'> 历史记录 </div>
      <div v-if="historyList.length!=0" class='history'>
        <div @click="navigatorTodetail(item)"
             @longpress="deleteItem(index)"
             class='item'
             v-for="(item,index) in historyList"
             :key="index">
          {{item}}
        </div>
      </div>
      <div v-else  @click="naviagteToRecode"
           class='nohistory'>暂无历史记录,去查一下吧!</div>

    <button class="concatBtn"
            open-type="contact">联系我</button>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {

  },
  data () {
    return {
      historyList: [1, 23, 4] // 历史搜索记录
    }
  },
  onShow () {
    let history = mpvue.getStorageSync('history') || []
    history = Array.from(new Set(history))
    this.historyList = history.slice(0, 12)
  },
  methods: {
    deleteItem (e) {
      const list = [...this.historyList]
      list.splice(e, 1)
      this.historyList = list
    },
    navigatorTodetail (e) {
      console.log(e)
      mpvue.navigateTo({url: `../detail/main?key=${e}`})
    },
    // 跳转到语音界面
    naviagteToRecode () {
      const url = '../record/main'
      if (mpvuePlatform === 'wx') {
        mpvue.switchTab({ url })
      } else {
        mpvue.navigateTo({ url })
      }
    }
  }
}
</script>

<style>
.head {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #f1f1f1;
  padding: 20rpx 40rpx;
  box-sizing: border-box;
  font-size: 32rpx;
  color: #333;
  margin-bottom: 40rpx;
}
.nickname {
  margin-left: 30rpx;
}
.userinfo {
  height: 100rpx;
  width: 100rpx;
  border-radius: 50%;
  overflow: hidden;
}
.concatBtn {
  color: white;
  font-size: 32rpx;
  position: fixed;
  bottom: 60rpx;
  right: 30rpx;
  background-color: green;
}
.history-text {
  margin-left: 40rpx;
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}

.history {
  display: flex;
  flex-wrap: wrap;
  margin-left: 40rpx;
  margin-right: 20rpx;
}

.item {
  font-size: 34rpx;
  border: 1rpx solid #eee;
  padding: 6rpx 12rpx;
  margin-right: 20rpx;
  margin-top: 20rpx;
  border-radius: 10rpx;
  color: #666;
}

.nohistory {
  height: 500rpx;
  width: 100%;
  line-height: 500rpx;
  text-align: center;
  color: #666;
}
</style>
