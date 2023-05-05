<template>
  <view class="ws-table">
    <!--表格头部区域-->
    <view class="table-header header-bg" :style="{'top': headerTop}">
      <view class="left">
        <view class="item index-view"
              :style="{height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}">
          <span>#</span>
        </view>
        <view class="col" v-for="(item, index) in fixedKey" :key="index" @touchstart="touchmove($event, item)">
          <view class="item"
                :style="{width:setUpxToPx(item.width), height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}">
            <span>{{ item.label }}</span>
          </view>
          <view class="item"
                v-if="showTableFilter"
                :style="{width:setUpxToPx(item.width), height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}">
            <view class="op-view" v-if="item.filter&&(!item.filter.component||item.filter.component==='input')">
              <input
                  class="input"
                  :value="getQueryKey(item)"
                  @input="onKeyInput($event, item.filter.key?item.filter.key:item.key)"
                  @confirm="inputConfirm"
                  @focus="focus"
                  @blur="blur"
                  :placeholder="item.filter.placeholder?item.filter.placeholder: '请输入' + (item.filter.label?item.filter.label:item.label)"
              />
              <view class="iconfont icon-close" v-if="getQueryKey(item)"
                    @click="clearValue(item.filter.key?item.filter.key:item.key)"></view>
            </view>
            <view class="op-view" v-if="item.filter&&item.filter.component==='select'">
              <picker class="input" :class="getQueryKey(item) ? 'have-value': 'no-value'"
                      @change="bindPickerChange($event, item)" :value="0" :range="item.filter.options"
                      range-key="label">
                {{ getQueryKey(item) ? getDictText(item) : '请选择' }}
              </picker>
              <view class="iconfont icon-xia" v-if="!getQueryKey(item)"></view>
              <view class="iconfont icon-close" v-if="getQueryKey(item)"
                    @click="clearValue(item.filter.key?item.filter.key:item.key)"></view>
            </view>
          </view>
        </view>
      </view>
      <scroll-view class="scroll-view" :enable-flex="true" scroll-x="true" :scroll-left="scrollLeft">
        <view class="row">
          <view class="col" v-for="(item, index) in noFixedKey" :key="index" @touchstart="touchmove($event, item)">
            <view class="item"
                  :style="{width:setUpxToPx(item.width), height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}">
              <span>{{ item.label }}</span>
            </view>
            <view class="item"
                  v-if="showTableFilter"
                  :style="{width:setUpxToPx(item.width), height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}">
              <view class="op-view" v-if="item.filter&&(!item.filter.component||item.filter.component==='input')">
                <input
                    class="input"
                    :value="getQueryKey(item)"
                    @input="onKeyInput($event, item.filter.key?item.filter.key:item.key)"
                    @confirm="inputConfirm"
                    @focus="focus"
                    @blur="blur"
                    :placeholder="item.filter.placeholder?item.filter.placeholder: '请输入' + (item.filter.label?item.filter.label:item.label)"
                />
                <view class="iconfont icon-close" v-if="getQueryKey(item)"
                      @click="clearValue(item.filter.key?item.filter.key:item.key)"></view>
              </view>
              <view class="op-view" v-if="item.filter&&item.filter.component==='select'">
                <picker class="input" :class="getQueryKey(item) ? 'have-value': 'no-value'"
                        @change="bindPickerChange($event, item)" :value="0" :range="item.filter.options"
                        range-key="label">
                  {{ getQueryKey(item) ? getDictText(item) : '请选择' }}
                </picker>
                <view class="iconfont icon-xia" v-if="!getQueryKey(item)"></view>
                <view class="iconfont icon-close" v-if="getQueryKey(item)"
                      @click="clearValue(item.filter.key?item.filter.key:item.key)"></view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!--表格内容区域-->
    <scroll-view class="table-content"
                 :style="{marginTop: setUpxToPx(showTableFilter?itemHeight*2:itemHeight), marginBottom: setUpxToPx(itemHeight*2)}"
                 scroll-y
                 @scrolltolower="loadMore"
                 @refresherrefresh="refresh">
      <view class="content">
        <view class="left">
          <view class="row" v-for="(item, index) in tableData" :key="index">
            <view class="item index-view header-bg"
                  :style="{height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}">
              <span>{{ index + 1 }}</span>
            </view>
            <view class="item header-bg"
                  :style="{width:setUpxToPx(v.width), height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}"
                  v-for="(v, index2) in fixedKey"
                  :key="index2">
              <span>{{ item[v.key] ? item[v.key] : '-' }}</span>
            </view>
          </view>
        </view>
        <scroll-view class="scroll-view" scroll-x="true" @scroll="scrollXFunc" @scrolltoupper="scrollToLeft">
          <view class="row" v-for="(item, index) in tableData" :key="index">
            <view class="item bgWhite"
                  :style="{width:setUpxToPx(v.width), height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight), backgroundColor: v.bgColor}"
                  v-for="(v, index2) in noFixedKey"
                  :key="index2">
						<span
                v-if="v.isTag"
                :class="getTagClass(item[v.key]) + '_bg'"
                class="tag-view">
							{{ showDictText(v.filter.options, item[v.key]) }}
						</span>
              <span v-else>{{ item[v.key] ? item[v.key] : '-' }}</span>
            </view>
          </view>
        </scroll-view>
      </view>
    </scroll-view>

    <!--表格合计区域-->
    <view class="footer-header header-bg" v-if="showSummary">
      <view class="left">
        <view class="item index-view"
              :style="{height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}">
          <span>合计</span>
        </view>
        <view class="col" v-for="(item, index) in fixedKey" :key="index">
          <view class="item"
                :style="{width:setUpxToPx(item.width), height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}">
            <text>
              {{ sumRow[item.key] ? sumRow[item.key] : '-' }}
            </text>
          </view>
        </view>
      </view>
      <scroll-view class="scroll-view" scroll-x="true" :scroll-left="scrollLeft">
        <view class="item"
              v-for="(item, index) in noFixedKey" :key="index"
              :style="{width:setUpxToPx(item.width), height: setUpxToPx(itemHeight), lineHeight: setUpxToPx(itemHeight)}">
          {{ sumRow[item.key] ? sumRow[item.key] : '-' }}
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script src="./index.js" type="text/javascript"></script>

<style lang="scss" scoped>
@import './css/index.scss';
@import url("./css/icon.scss");
</style>
