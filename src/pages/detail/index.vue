<!-- 搜索的结果
垃圾类型：1-可回收垃圾，2-有害垃圾，4-湿垃圾，8-干垃圾，16-大件垃圾-->
<template>
  <div>
    <block v-if="result.length!=0 && !isLoading">
      <scroll-view style="height: 150px;  display: flex;justify-content: center;align-items: center;"
                   scroll-y>
        <div @click="chooseType(item.type)"
             v-for="(item,index) in result"
             :key="index"
             class='result'
             :style="{color:contentList[swiperCurrent].color}">
          <text class='name'>{{item.name}}:</text>
          <text v-if="item.type === 1">可回收垃圾</text>
          <text v-if="item.type === 2">有害垃圾</text>
          <text v-if="item.type === 4">湿垃圾</text>
          <text v-if="item.type === 8">干垃圾</text>
          <text v-if="item.type === 16">大件垃圾</text>
        </div>
      </scroll-view>

      <swiper :current="swiperCurrent"
              class='swiper'>
        <block :key="index"
               v-for="(item,index) in contentList">
          <swiper-item class="item">
            <image :src='item.image'></image>
            <div class='title mt_20'
                 :style="{color:item.color}">{{item.title}}是指{{item.definition}}</div>
            <div class='title mt_20'
                 :style="{color:item.color}">主要包括:{{item.include}}</div>
            <div :style="{backgroundColor:item.color}"
                 class='title include mt_20'>{{item.title}}投放要求</div>
            <div class='title mt_20 demand'
                 :style="{color:item.color}"
                 v-for="(demandItem,demandIndex) in item.demandList"
                 :key="demandIndex">{{demandIndex+1}}、 {{demandItem}}</div>
          </swiper-item>
        </block>
      </swiper>
    </block>
    <block v-else>
      <div v-if="!isLoading && result.length === 0"
           class='noresult'>
        <div> 哎呀，没有找到这个垃圾分类呢！</div>
        <image src='/static/images/lajitong.png'></image>
      </div>
    </block>
  </div>
</template>

<script type="text/ecmascript-6">
import { queryGarbagUrl } from '@/utils/urls'
import { get } from '@/utils/request'
import {setHistory} from '@/utils/storage'
const contentList = [{
  title: '可回收物',
  image: '/static/images/recyclable.png',
  definition: '适宜回收利用和资源化 利用的，如：玻、金、 塑、纸、衣',
  include: '酱油瓶、玻璃杯、平板玻璃、易拉罐、饮料瓶、洗发水瓶、塑料玩具、书本、报纸、广告单、纸板箱、衣服、床上用品等',
  demandList: ['轻投轻放', '清洁干燥，避免污染', '废纸尽量平整', '立体包装物请清空内容物，清洁后压扁投放', '有尖锐边角的，应包裹后投放'],
  color: 'rgb(0, 0, 102)'
},
{
  title: '有害垃圾',
  image: '/static/images/hazardous.png',
  definition: '对人体健康或者自然环 境造成直接或潜在危害 的废弃物',
  include: '废电池、油漆桶、荧光灯管、废药品及其包装物等',
  demandList: ['投放时请注意轻放', '易破损的请连带包装或包裹后轻放', '如易挥发，请密封后投放'],
  color: 'rgb(229, 52, 34)'
},
{
  title: '湿垃圾',
  image: '/static/images/household.png',
  definition: '日常生活垃圾产生的容 易腐烂的生物质废弃物',
  include: '剩菜剩饭、瓜皮果核、花卉绿植、过期食品等',
  demandList: ['纯流质的食物垃圾，如牛奶等，应直接倒进下水口', '有包装物的湿垃圾应将包装物去除', '后分类投放，包装物请投放到对应的可回收物或干垃圾容器'],
  color: 'rgb(100, 64, 50)'
},
{
  title: '干垃圾',
  image: '/static/images/residual.png',
  definition: '除有害垃圾、可回收 物、湿垃圾以外的其他 生活废弃物',
  include: '餐盒、餐巾纸、湿纸巾、卫生间用纸、塑料袋、 食品包装袋、污染严重的纸、烟蒂、纸尿裤、 一次性杯子、大骨头、贝壳、花盆、陶瓷等',
  demandList: ['尽量沥干水分', '难以辨识类别的生活垃圾投入干垃圾容器内'],
  color: 'rgb(44, 43, 41)'
}
]
export default {
  components: {

  },
  onLoad (options) {
    console.log(options.key)
    const {
      key
    } = options
    if (key) {
      setHistory(key)
      this.getDetail(key)
    } else {
      const garlist = wx.getStorageSync('garlist')
      if (JSON.parse(garlist).data) {
        this.setSwiperCurrent(JSON.parse(garlist).data[0].type)
        this.result = JSON.parse(garlist).data
        this.isLoading = false
      }
    }
  },
  data () {
    return {
      contentList: contentList,
      result: [],
      isLoading: true,
      swiperCurrent: 0
    }
  },
  methods: {
    getDetail (name) {
      mpvue.showLoading({
        title: '识别中'
      })
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
          this.setSwiperCurrent(type)
          this.result = res.data
          this.isLoading = false
        } else {
          mpvue.showToast({
            title: '识别失败，请重试'
          })
        }
      })
    },
    // 设置滑块的位置
    setSwiperCurrent (type) {
      let index = 0
      switch (type) {
        case 2:
          index = 1
          break
        case 4:
          index = 2
          break
        case 8:
          index = 3
          break
      }
      this.swiperCurrent = index
    },
    // 选择每一个item
    chooseType (e) {
      this.setSwiperCurrent(e)
    }
  }
}
</script>

<style>

.result {
  padding: 10rpx 40rpx;
  font-size: 32rpx;
  color: #644032;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.result .name {
  margin-right: 20rpx;
}

.result image {
  margin-top: 50rpx;
  height: 300rpx;
  width: 300rpx;
}

.noresult {
  height: 800rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 42rpx;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.noresult image {
  margin-top: 40rpx;
  height: 150rpx;
  width: 150rpx;
}
.swiper {
  height: 900rpx;
  width: 100%;
  border-top: 1rpx solid rgb(221, 221, 221);
  margin: 20rpx 0;
}

.swiper .item {
  display: flex;
  margin-top: 40rpx;
  flex-direction: column;
  align-items: center;
  font-size: 30rpx;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.swiper .item image {
  height: 200rpx;
  width: 200rpx;
}

.swiper .item .title {
  padding: 0 40rpx;
  font-size: 30rpx;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.swiper .item .include {
  border-radius: 10rpx;
  padding: 0 40rpx;
  width: 600rpx;
  height: 80rpx;
  line-height: 80rpx;
  color: white;
  text-align: center;
  font-size: 36rpx;
}

.swiper .item .demand {
  width: 90%;
}

.mt_20 {
  margin-top: 20rpx;
}
</style>
