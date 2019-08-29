<template>
  <div class="content">
    <search />
    <div class="content">
      <div @click="navigateToDetail"
           class="title">
        {{currentText?currentText:'喂，说一下你的垃圾'}}
        <text>{{typeName}}</text>
        <div class="translateText"
             v-if="translateText">英语: {{translateText}}</div>
      </div>
      <div @touchstart="streamRecord"
           @touchend="endStreamRecord"
           class="content">
        <div class="imgview">
          <image class="chooseimg"
                 src="/static/images/yuyin.png"></image>
        </div>
        <text class="imgview_text">按住说话</text>
        <div v-if="isRecording"
             class="record-wave">
          <image src="https://resource.aijiatui.com/ai-img/mini-program/wave.gif?t=1"></image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '../../components/search.vue'
import { get } from '@/utils/request'
import { queryGarbagUrl } from '@/utils/urls'
import {setHistory} from '@/utils/storage'
let plugin = requirePlugin('WechatSI')
let manager = plugin.getRecordRecognitionManager()

export default {

  data () {
    return {
      currentText: '', // 语音输入的内容
      translateText: '', // 翻译的内容
      typeName: '',
      isRecording: false // 是否在录音
    }
  },
  computed: {
  },
  components: {
    Search
  },
  onLoad () {
    this.initRecord()
  },

  methods: {
    // 初始化录音功能
    initRecord () {
      manager.onRecognize = (res) => {
        const text = res.result
        this.currentText = text
      }
      manager.onStop = (res) => {
        const text = res.result
        if (text === '') return
        this.currentText = text
        this.translateTextAction()
      }
    },
    // 录音开始
    streamRecord () {
      manager.start({
        lang: 'zh_CN'
      })
      mpvue.vibrateShort()
      this.isRecording = true
    },
    // 录音结束
    endStreamRecord () {
      mpvue.vibrateShort()
      manager.stop()
      this.isRecording = false
    },
    // 翻译操作
    translateTextAction () {
      this.getData()
      this.textToSpeech()
      this.translate()
    },
    // 查询数据
    getData () {
      const name = this.currentText.slice(0, -1)
      setHistory(name)
      get({
        url: queryGarbagUrl,
        params: {
          name
        }
      }).then(res => {
        if (res.data && res.data.length !== 0) {
          const index = res.data.findIndex((item) => {
            return item.name === name
          })
          const type = res.data[index].type
          wx.hideLoading()
          this.setType(type)
        } else {
          mpvue.showToast({
            title: '识别失败，请重试'
          })
        }
      })
    },
    // 确定类型
    setType (type) {
      let typeName = ''
      switch (type) {
        case 1:
          typeName = '是可回收垃圾!'
          break
        case 2:
          typeName = '是有害垃圾!'
          break
        case 4:
          typeName = '是湿垃圾!'
          break
        case 8:
          typeName = '是干垃圾!'
          break
        case 16:
          typeName = '是大件垃圾!'
          break
      }
      this.typeName = typeName
    },
    textToSpeech () {
      plugin.textToSpeech({
        lang: 'zh_CN',
        tts: true,
        content: this.currentText,
        success (res) {
          console.log('succ tts', res.filename)
          mpvue.playBackgroundAudio({
            dataUrl: res.filename,
            title: ''
          })
        },
        fail (res) {
          console.log('fail tts', res)
        }
      })
    },
    // 翻译
    translate () {
      let lfrom = 'zh_CN'
      let lto = 'en_US'
      plugin.translate({
        lfrom: lfrom,
        lto: lto,
        content: this.currentText,
        tts: false,
        success: (resTrans) => {
          this.translateText = resTrans.result
        }
      })
    },
    // 跳转去详情
    navigateToDetail () {
      const name = this.currentText.slice(0, -1)
      if (name) {
        mpvue.navigateTo({url: `/pages/detail/main?key=${name}`})
      }
    }

  }
}
</script>

<style>
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

.translateText {
  font-size: 20rpx;
  color: #aaa;
  position: fixed;
  bottom: 240rpx;
  right: 40rpx;
}

.record-wave {
  height: 60rpx;
  padding: 20rpx 20rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 0 0 8rpx 8rpx;
}

.record-wave image {
  height: 60rpx;
  margin: 0 40rpx;
}
</style>
