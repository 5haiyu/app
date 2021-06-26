<template>
  <div class="inbound">
    <div class="main">
      <div class="title">输入机具信息</div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="org"
          label="所属机构"
          right-icon="arrow"
          placeholder="请选择所属机构"
          readonly
          @click="clickOrg"
        />
        <van-field
          v-model="deviceName"
          label="机具名称"
          right-icon="arrow"
          placeholder="请选择机具名称"
          readonly
          @click="clickDevice"
        />
        <van-field
          v-model="deviceNo"
          label="机具编号"
          right-icon="scan"
          placeholder="请输入机具编号"
          @click-right-icon="clickNo"
        />
        <div style="margin: 16px">
          <van-button
            color="#EF544E"
            block
            type="info"
            native-type="submit"
            class="submit-btn"
            :disabled="isSubmit"
            >确认入库</van-button
          >
          <!-- {{ $store.state.number }}
          {{ $store.getters.PLUS_COUNT}}
          {{ $store.getters.MINUS_COUNT}}
          {{ $store.state.loading ? "true" : "false" }}
          <br />
          <van-button color="#EF544E" block type="info" @click="plus"
            >plus</van-button
          >
          <br />
          <van-button color="#EF544E" block type="info" @click="minus"
            >minus</van-button
          > -->
        </div>
      </van-form>
    </div>
    <van-popup v-model="showOrgPicker" round position="bottom">
      <van-picker
        value-key="name"
        show-toolbar
        :columns="domainList"
        @cancel="showOrgPicker = false"
        @confirm="onConfirm"
        title="机构"
      />
    </van-popup>
    <van-action-sheet v-model="showMechanism" title="机具" class="vas">
      <van-search
        v-model="searchKey"
        placeholder="输入机具名称"
        @input="toPerson"
        shape="round"
      />
      <van-radio-group v-model="radio">
        <van-cell-group v-if="deviceList && deviceList.length">
          <van-cell
            :title="item.typeName"
            clickable
            @click="radioClick(item, index)"
            v-for="(item, index) in deviceList"
            :key="index"
          >
            <template #right-icon>
              <van-radio :name="item.machineType" checked-color="#FF8F5F">
                <template #icon="props">
                  <span v-if="props.checked"><van-icon name="success" /></span>
                  <span v-if="!props.checked"></span>
                </template>
              </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-action-sheet>
    <canvas class="canvas" ref="canvas"> </canvas>
    <div class="scanCancel" @click="scanCancel" id="scan"><van-icon name="clear" /></div>
  </div>
</template>
<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js" type="text/javascript" charset="utf-8"></script>
<script>
import {
  getMachineConfigListApi,
  machineImportApi,
  thridDomainApi,
} from "@/service/api/inbound";
import jsQR from "jsqr";
import Jimp from "jimp";
// import func from '../../../vue-temp/vue-editor-bridge';
// import { getQueryString } from "@/utils/index";
export default {
  name: "inbound",
  data() {
    return {
      deviceNo: "",
      deviceName: "",
      org: "",
      fileList: [],
      isSubmit: false,
      dataURL: "",
      show: false,
      url: "",
      // 类型弹出
      searchKey: "",
      radio: "1",
      domainList: [],
      deviceList: [],
      showMechanism: false,
      value: "",
      showOrgPicker: false,
      ids: "",
      payment: "",
      machineType: "",
      originList: [],
      // scan
      timer: null,
      isAnimation: true,
      audio: Object,
      video: Object,
      cvsele: Object,
      canvas: Object,
      result: "",
    };
  },
  created() {},
  mounted() {
    this.audio = new Audio("../assets/tone.mp3");
    this.video = document.createElement("video");
    this.cvsele = this.$refs.canvas;
    this.canvas = this.cvsele.getContext("2d");
    this.thridDomain();
    console.log(document.getElementById('scan').style.display = 'none')
  },
  beforeDestroy() {},
  watch: {
    fileList(val) {
      if (val.length === 0) {
        this.show = false;
      }
    },
  },
  methods: {
    scanCancel() {
      this.isAnimation = false;
      cancelAnimationFrame(this.timer);
      setTimeout(() => {
        this.cvsele.style.display = "none";
        document.getElementById('scan').style.display = "none";
      }, 200);
    },
    draw(begin, end) {
      this.canvas.beginPath();
      this.canvas.moveTo(begin.x, begin.y);
      this.canvas.lineTo(end.x, end.y);
      this.canvas.lineWidth = 3;
      this.canvas.strokeStyle = "red";
      this.canvas.stroke();
    },

    sweep() {
      document.getElementById('scan').style.display = "block";
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        const { videoWidth, videoHeight } = this.video;
        this.cvsele.width = videoWidth;
        this.cvsele.height = videoHeight;
        this.canvas.drawImage(this.video, 0, 0, videoWidth, videoHeight);
        try {
          const img = this.canvas.getImageData(0, 0, videoWidth, videoHeight);
          this.imgurl = img;
          const obj = jsQR(img.data, img.width, img.height, {
            inversionAttempts: "dontInvert",
          });
          if (obj) {
            const loc = obj.location;
            this.draw(loc.topLeftCorner, loc.topRightCorner);
            this.draw(loc.topRightCorner, loc.bottomRightCorner);
            this.draw(loc.bottomRightCorner, loc.bottomLeftCorner);
            this.draw(loc.bottomLeftCorner, loc.topLeftCorner);
            if (this.result != obj.data) {
              this.audio.play();
              this.result = obj.data;
              this.deviceNo = obj.data;
              this.isAnimation = false;
              cancelAnimationFrame(this.timer);
              console.info("识别结果：", obj.data);
              setTimeout(() => {
                this.cvsele.style.display = "none";
               document.getElementById('scan').style.display = "none";
              }, 1000);
            }
          } else {
            console.error("识别失败，请检查二维码是否正确！");
          }
        } catch (err) {
          console.error("识别失败，请检查二维码是否正确！", err);
        }
      }
      if (this.isAnimation) {
        this.timer = requestAnimationFrame(() => {
          this.sweep();
        });
      }
    },

    media() {
      this.isAnimation = true;
      this.cvsele.style.display = "block";
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      if (navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode: "environment" },
          })
          .then((stream) => {
            this.video.srcObject = stream;
            this.video.setAttribute("playsinline", true);
            this.video.setAttribute("webkit-playsinline", true);
            this.video.addEventListener("loadedmetadata", () => {
              this.video.play();
              this.sweep();
            });
          })
          .catch((error) => {
            console.error(
              error.name + "：" + error.message + "，" + error.constraint
            );
          });
      } else if (navigator.getUserMedia) {
        navigator.getUserMedia(
          {
            video: { facingMode: "environment" },
          },
          (stream) => {
            this.video.srcObject = stream;
            this.video.setAttribute("playsinline", true);
            this.video.setAttribute("webkit-playsinline", true);
            this.video.addEventListener("loadedmetadata", () => {
              this.video.play();
              this.sweep();
            });
          },
          (error) => {
            console.error(
              error.name + "：" + error.message + "，" + error.constraint
            );
          }
        );
      } else {
        if (
          navigator.userAgent.toLowerCase().match(/chrome/) &&
          location.origin.indexOf("https://") < 0
        ) {
          console.error(
            "获取浏览器录音功能，因安全性问题，需要在localhost 或 127.0.0.1 或 https 下才能获取权限！"
          );
        } else {
          // alert("对不起：未识别到扫描设备!");
          this.$toast("对不起：未识别到扫描设备!");
        }
      }
    },
    machineImport() {
      machineImportApi({
        snNo: this.deviceNo,
        machineType: this.machineType,
        creator: this.creator,
      });
    },
    toPerson() {
      console.log("根据关键字搜索：");
      if (this.searchKey.trim() === "") {
        this.deviceList = this.originList;
      } else {
        if (this.originList.length) {
          let filterList = [];
          this.originList.forEach((item) => {
            if (item.typeName.indexOf(this.searchKey) > -1) {
              filterList.push(item);
            }
          });
          this.deviceList = filterList;
        }
      }
    },
    onConfirm(value, index) {
      console.log(value, index);
      this.org = value.name;
      this.ids = value.ids;
      this.payment = value.payment_clientid;
      this.showOrgPicker = false;
      this.deviceName = "";
      this.machineType = "";
      this.radio = "";
      this.getMachineConfigList();
    },
    clickOrg() {
      console.log(1);
      this.showOrgPicker = true;
    },
    clickDevice() {
      console.log(2);
      this.searchKey = "";
      this.toPerson();
      this.showMechanism = true;
    },
    clickNo() {
      console.log(3);
      this.media();
    },
    clickUploader() {
      console.log(668);
    },
    radioClick(item, index) {
      console.log(item, index);
      this.radio = item.machineType;
      this.deviceName = item.typeName;
      this.machineType = item.machineType;
      this.showMechanism = false;
    },
    thridDomain() {
      thridDomainApi({}).then((res) => {
        // console.log(res);
        if (res.resultCode === "00") {
          this.domainList = res.domainList;
        } else {
          this.domainList = [];
        }
      });
    },
    getMachineConfigList() {
      getMachineConfigListApi({
        payment: this.payment,
      }).then((res) => {
        if (res.resultCode === "00") {
          this.deviceList = res.data;
          this.originList = res.data;
        } else {
          this.deviceList = [];
        }
      });
    },
    onSubmit() {
      if (this.org === "") {
        this.$toast("请选择所属机构");
        return;
      }
      if (this.deviceName === "") {
        this.$toast("请选择机具名称");
        return;
      }
      if (this.deviceNo.trim() === "") {
        this.$toast("请输入机具编号");
        return;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.inbound {
  background: #f5f5f5;
  /deep/ .van-picker__confirm {
    color: #ff8f5f;
  }
  .title {
    height: 52px;
    color: #666666;
    text-indent: 16px;
    line-height: 52px;
    font-size: 14px;
  }
  .vas {
    /deep/ .van-radio__icon--checked .van-icon {
      color: #ff8f5f;
      background-color: transparent;
      border-color: transparent;
    }
  }
  .banner-image {
    width: 100%;
    height: 195px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // background-image: url("../../assets/image/question@2x.png");
  // background-size: 375px;
  // -webkit-background-size: cover;
  // -o-background-size: cover;
  // background-position: center 0;
  // padding-top: 142px;
  .main {
    // background-color: #fff;
    // border-radius: 15px 15px 0px 0px;
    // padding-top: 20px;
    width: 100%;
    min-height: 525px;
    .textareaTitle {
      span {
        color: #646566;
      }
    }
  }
  .submit-btn {
    width: 294px;
    margin: 0 auto;
    background: #ff8f5f !important;
    border-color: #ff8f5f !important;
    border-radius: 6px !important;
    font-size: 16px !important;
    margin-top: 40px !important;
  }
}
</style>
<style lang="scss">
.inbound {
  .textarea {
    .van-field__control {
      background-color: #f7f8fa;
    }
  }
  .canvas {
    display: none;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  .scanCancel {
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
    font-size: 40px;
    text-align: center;
  }
}
</style>
