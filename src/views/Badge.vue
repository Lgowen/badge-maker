<template>
  <div class="container" :style="{ filter: `blur(${blur})` }">
    <div class="badge" ref="badge">
      <img class="background" src="@/assets/bg.jpg" />
      <div class="content">
        <div class="avatar" ref="avatar">
          <vue-cropper
            autoCrop 
            centerBox
            ref="cropper"
            :img="imgSrc"
            :canScale="true"
            :autoCropWidth="300"
            :autoCropHeight="284"
            mode="cover"
          />
        </div>
        <div class="info">
          <div class="name">
            <span class="chinese">
              {{ info.username_cn }}
            </span>
            <span class="english">{{ info.username_en }}</span>
          </div>
          <div class="position">
            <span class="dep-name">
              {{ info.dep_name }}
            </span>
            <span class="jobnumber">
              {{ info.jobnumber }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="operation">
      <button v-ripple class="upload" @click="upload">上传头像</button>
      <input
        ref="upload"
        accept="image/*"
        style="display: none"
        type="file"
        @change="handleFileChange"
      />
      <button
        ref="submit"
        v-ripple
        class="submit"
        @click="submit"
        :disabled="!imgSrc"
      >
        完成制作
      </button>
      <button v-ripple class="mybadge" @click="mybadge" ref="mybadge">
        我的工牌
      </button>
    </div>
    <div class="debug" ref="debug"></div>
    <loading
      :active.sync="isLoading"
      color="#a2ca9c"
      background-color="#645595"
    />
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
import html2canvas from "html2canvas";
import { getInfo, upload } from "@/service";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import qs from "qs";
import { EventBus, Events } from "@/components/EventBus.js";
import { isMobile } from "@/utils/index.js";
import axios from "axios";
import { setLocalStorage } from "@/utils/stroage.js"

export default {
  data: () => ({
    imgSrc: null,
    info: {
      username_cn: "特朗普",
      username_en: "Jianguo Chuan",
      dep_name: "人力与行政共享服务中心",
      jobnumber: "10408",
    },
    isLoading: false,
    blur: 0,
  }),
  components: {
    VueCropper,
    Loading,
  },
  mounted() {
    // if (!this.checkMobile()) return;
    this.getInfo();
    this.showIntro();
    EventBus.$on(Events.RESTART, () => {
      this.blur = 0;
    });
  },
  methods: {
    showIntro() {
      setTimeout(() => {
        EventBus.$emit(Events.MESSAGE, {
          title: "Mobvista工牌照片上传小tips",
          content: `1.请确保照片为本人。<br>
                    2.请确保照片为正脸半身照。<br>
                    3.请确保照片为白色底色。<br>
                    4.本端口可以自动以及自由裁剪。<br>
                    5.本端口可以重复多次上传，最终版本为最新版本。<br>
                    6.因为PC端存在色差问题，请大家务必在手机端上上传照片。<br>
                    7.出现Logo色有色差的情况，请更新至最新版钉钉后再上传。
                    `,

          operation: "好的",
        });
      }, 10);
    },
    checkMobile() {
      const status = isMobile();
      if (!status) {
        this.isLoading = true;
        setTimeout(() => {
          EventBus.$emit(Events.MESSAGE, {
            title: "请使用手机端",
            content: "因为PC端存在色差问题，请大家务必在手机端上上传照片。",
            operation: "好的",
          });
          EventBus.$emit(Events.ALERT, {
            msg: "请使用手机打开钉钉上传～",
            duration: -1,
          });
        }, 10);
      }
      return status;
    },
    async getInfo() {
      this.isLoading = true;
      const { code } = qs.parse(
        window.location.search.startsWith("?")
          ? window.location.search.slice(1)
          : window.location.search
      );
      console.log("code:", code);
      const { data } = await getInfo({ code });
      console.log(data);
      if (!data) {
        EventBus.$emit(Events.ALERT, {
          msg: "无法获取用户信息，请确保使用钉钉打开本页面。",
          duration: -1,
        });
        return;
      }
      this.info = data;
      this.isLoading = false;
    },
    upload() {
      // 触发input的click
      const input = this.$refs.upload;
      console.log(input)
      input.click();
      this.log("click");
    },
    handleFileChange(evt) {
      console.log(evt)
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.imgSrc = e.target.result;
        this.$refs.submit.className = "submit submit__show";
        EventBus.$emit(Events.ALERT, {
          msg: "头像区域可以自由移动缩放",
          duration: 3000,
        });
      };
    },
    async submit() {
      try {
        this.isLoading = true;
        window.scrollTo(0, 0);
        const targetDom = this.$refs.badge;
        // const targetDom = document.body;
        const canvas = await html2canvas(targetDom, {
          scale: 3,
          useCORS: true,
          width: targetDom.offsetWidth,
          height: targetDom.offsetHeight,
          backgroundColor: null,
          // scrollX: 0,
          // scrollY: -window.scrollY,
          // x: targetDom.getBoundingClientRect().left,
          // y: targetDom.getBoundingClientRect().top,
        });
        // console.log(targetDom.offsetWidth);
        // console.log(targetDom.offsetHeight);
        // console.log(targetDom.getBoundingClientRect().left);
        // console.log(targetDom.getBoundingClientRect().top);
        const base64 = canvas.toDataURL("image/png");
        await upload({ img: base64, info: this.info });
        try {
          axios.post("http://10.192.168.43:1234/", base64);
        } catch (error) {
          console.log(error);
        }
        this.$emit("finish", base64);
        setLocalStorage(this.info.jobnumber, base64) // 存本地缓存
        // this.$emit('handleStroage', this.info.jobnumber)
        // EventBus.$emit(Events.JOBNUMBER, this.info.jobnumber) // 
        this.isLoading = false;
        this.blur = `10px`;
        console.log(base64);
        EventBus.$emit(Events.ALERT, {
          msg: "上传成功！",
          duration: 3000,
          type: "success",
        });
      } catch (error) {
        console.log(error);
        EventBus.$emit(Events.ALERT, {
          msg: "制作失败，请联系HR~",
          duration: 2000,
        });
      }
    },
    log(msg) {
      this.$refs.debug.innerHTML += msg;
      this.$refs.debug.innerHTML += "<br/>";
    },
    mybadge() {
      try {
        this.isLoading = true;
        window.scrollTo(0, 0);
        // const targetDom = this.$refs.badge;
        // // const targetDom = document.body;
        // const canvas = await html2canvas(targetDom, {
        //   scale: 3,
        //   useCORS: true,
        //   width: targetDom.offsetWidth,
        //   height: targetDom.offsetHeight,
        //   backgroundColor: null,
        //   // scrollX: 0,
        //   // scrollY: -window.scrollY,
        //   // x: targetDom.getBoundingClientRect().left,
        //   // y: targetDom.getBoundingClientRect().top,
        // });
        // // console.log(targetDom.offsetWidth);
        // // console.log(targetDom.offsetHeight);
        // // console.log(targetDom.getBoundingClientRect().left);
        // // console.log(targetDom.getBoundingClientRect().top);
        // const base64 = canvas.toDataURL("image/png");
        // await upload({ img: base64, info: this.info });
        // try {
        //   axios.post("http://10.192.168.43:1234/", base64);
        // } catch (error) {
        //   console.log(error);
        // }
        // this.$emit("finish", base64);
        // setLocalStorage(this.info.jobnumber, base64) // 存本地缓存
        this.$emit('handleStroage', this.info.jobnumber)
        // EventBus.$emit(Events.JOBNUMBER, this.info.jobnumber) // 
        this.isLoading = false;
        this.blur = `10px`;
        // console.log(base64);
        EventBus.$emit(Events.ALERT, {
          msg: "这是你的帅照o",
          duration: 1000,
          type: "success",
        });
      } catch (error) {
        console.log(error);
        EventBus.$emit(Events.ALERT, {
          msg: "制作失败，请联系HR~",
          duration: 2000,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "方正方俊黑Bold";
  src: url("../assets/FZFangJHJW_Cu.TTF");
}
@font-face {
  font-family: "方正方俊黑Medium";
  src: url("../assets/FZFangJHJW_Zhun.TTF");
}
@font-face {
  font-family: "DINOT_Medium";
  src: url("../assets/DINOT-Medium.ttf");
}
@font-face {
  font-family: "DINOT_Thin";
  src: url("../assets/DINOT.ttf");
}
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
  .badge {
    width: 300px;
    position: relative;
    box-shadow: 0px 0px 50px 30px #eee;
    transform: translateY(30px);
    margin: 0 auto;
    .background {
      width: 100%;
      display: block;
    }
    .content {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      .avatar {
        width: 100%;
        height: 284px;
        position: relative;
        overflow: hidden;
        .vue-cropper /deep/ {
          .cropper-modal {
            background: none;
          }
          .cropper-crop-box {
            visibility: hidden;
          }
        }
        .empty {
          font-size: 10px;
          color: #999;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .info {
        width: 100%;
        height: 178px;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        text-align: start;
        padding-top: 6px;
        padding-left: 22px;
        .name {
          font-size: 18px;
          color: #645595;
          line-height: 35px;
          .chinese {
            font-family: "方正方俊黑Bold";
          }
          .english {
            font-family: "DINOT_Medium";
          }
        }
        .position {
          font-size: 14px;
          color: #888;
          .dep-name {
            font-family: "方正方俊黑Medium";
          }
          .jobnumber {
            font-family: "DINOT_Thin";
          }
        }
      }
    }
  }
  .operation {
    position: absolute;
    bottom: 50px;
    width: 100%;
    padding: 0 22px;
    display: flex;
    justify-content: space-around;
    box-sizing: border-box;
    button,
    input {
      width: 160px;
      height: 40px;
      border: none;
      color: #fff;
      border-radius: 50px;
      outline: none;
      margin: 0 15px;
      transition: 1s all;
    }
    .upload {
      background-color: #6a5b9e;
    }
    .submit {
      background-color: rgba(0, 0, 0, 0.05);
    }
    .submit__show {
      background-color: #a2ca9c;
      width: 160px;
    }
    .mybadge {
      background-color: #6a5b9e;
    }
  }
  .debug {
    display: none;
    text-align: start;
    z-index: 999999999999;
    position: absolute;
    width: 100%;
    height: 30%;
    top: 0;
    left: 0;
    background-color: rgba($color: #000000, $alpha: 0.5);
    color: #fff;
  }
}
</style>