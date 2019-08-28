<template>
    <div class="searchview">
      <div class="search">
      <icon class='icon-class'
            size="12px"
            type="search"></icon>
      <input class="input"
             :placeholder='inputHint'
             @confirm='inputConfirm'
             style='padding-left:12rpx;'
             @input='inputListener'
             :value='inputValue'
             :type='inputType'
             :password='isPassword'
             :confirm-type='confirmType' />
      <icon size="16px"
            @click='clearTap'
            :class="isClearShow?'clearImgShow':'clearImgHide'"
            type="clear"></icon>
    </div>
    <!--  搜索结果 -->
    <scroll-view class='resultview'
                 scroll-y
                 v-if="resultList.length!=0">
      <view v-for="(item,index) in resultList"
            :key='index'
            @click="bindNavigate(item.name)"
            class="resultitem">
        <icon class='icon-class'
              size="12px"
              type="search"></icon>
        {{item.name}}
      </view>
    </scroll-view>

  </div>
</template>

<script>
import { get } from '@/utils/request'
import { queryGarbagUrl } from '@/utils/urls'

export default {
  props: {
    inputHint: {
      type: String,
      default: '请输入垃圾名称'
    },
    inputType: {
      type: String,
      default: 'text'
    },
    isPassword: {
      type: Boolean,
      default: false
    },
    confirmType: {
      type: String,
      default: 'done'
    }
  },
  data () {
    return {
      isClearShow: false, // 显示删除按钮
      inputValue: '', // 输入框的内容
      resultList: [] // 搜索数据
    }
  },
  methods: {
    // 输入框事件
    inputListener (e) {
      const { value } = e.mp.detail
      this.inputValue = value
      if (value === null || value === undefined || value.length === 0) {
        this.isClearShow = false
      } else {
        this.isClearShow = true
      }
    },
    // 输入框确认事件
    inputConfirm (e) {
      const { value } = e.mp.detail
      this.inputValue = value
      if (value) {
        this.isChinese(value, this.getResultList)
      }
    },
    // 获取数据
    getResultList (name) {
      get({
        url: queryGarbagUrl,
        params: {
          name
        }
      }).then(res => {
        console.log(res)
        if (res.data) {
          this.resultList = res.data
        }
      })
    },
    // 跳转到详情
    bindNavigate (e) {
      this.isChinese(e, this.navigateToDetail)
    },
    navigateToDetail (key) {
      this.clearTap()
      mpvue.navigateTo({url: `/pages/detail/main?key=${key}`})
    },
    // 清除输入框
    clearTap () {
      this.isClearShow = false
      this.inputValue = ''
      this.resultList = []
    },
    // 判断是否是中文
    isChinese (key, func) {
      let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/
      let isChinese = reg.test(key)
      if (isChinese) {
        // eslint-disable-next-line no-unused-expressions
        func(key)
      } else {
        mpvue.showModal({
          content: '请输入中文',
          showCancel: false
        })
      }
    }

  }
}
</script>

<style>
page {
  background-color: #fafafa;
  box-sizing: border-box;
}
.searchview{
 background-color: white;
  position: absolute;
  top: 0;
  width: 92%;
  margin-top: 20rpx;
  display: flex;
  flex-direction: column
}
.search {
  display: flex;
  align-items: center;
  padding: 10rpx 30rpx;
  font-size: 26rpx;
  border-radius: 10rpx;
  border: 1rpx solid #eee;
  box-sizing: border-box;
}

.input {
  width: 85%;
  margin-right: 20rpx;
}

.searchImg {
  width: 35rpx;
  height: 35rpx;
  vertical-align: center;
}

.clearImgShow {
  width: 35rpx;
  height: 35rpx;
  vertical-align: center;
}

.clearImgHide {
  display: none;
}
.resultview {
  position: absolute;
  background-color: white;
  top: 90rpx;
  z-index: 2;
  width: 100%;
  height: 350rpx;
  padding: 10rpx 60rpx;
  box-sizing: border-box;
  animation: pulldown 200ms linear;
}
@keyframes pulldown {
  0% {
    transform: translateY(-40rpx);
  }
  25% {
    transform: translateY(-30rpx);
  }
  50% {
    transform: translateY(-20rpx);
  }
  75% {
    transform: translateY(-10rpx);
  }
  100% {
    transform: translateY(0rpx);
  }
}

.resultitem {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: left;
  border-bottom: 1rpx #eeeeee solid;
  color: #666;
  font-size: 26rpx;
}
.resultitem icon {
  margin-right: 12rpx;
  text-align: center;
  height: 24rpx;
  line-height: 24rpx;
}
</style>
