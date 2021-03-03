<template>
  <div class="container" :style="{ opacity: opacity }">
    <!-- <div class="wrapper"> -->
    <img :src="storageImage" v-if="storageImage" />
    <img :src="imgSrc" v-else />
    <!-- </div> -->
    <div class="operation">
      <button v-ripple @click="close">{{ storageImage ? "返回" : "重新制作" }}</button>
    </div>
  </div>
</template>

<script>
import { Events, EventBus } from "../components/EventBus";
export default {
  props: {
    imgSrc: String,
    storageImage: String
  },
  data: () => ({
    opacity: 0,
  }),
  mounted() {
    setTimeout(() => {
      this.opacity = 1;
    }, 50);
  },
  methods: {
    close() {
      this.opacity = 0;
      EventBus.$emit(Events.RESTART);
      setTimeout(() => {
        this.$emit("update:imgSrc", null)
        this.$emit("update:storageImage", null)
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  transition: all 1s;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.5);
  .wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  img {
    display: block;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
  }
  .operation {
    position: absolute;
    bottom: 3%;
    width: 100%;
    padding: 0 22px;
    display: flex;
    justify-content: space-around;
    box-sizing: border-box;
    button {
      width: 160px;
      height: 40px;
      border: none;
      color: #353535;
      border-radius: 50px;
      margin: 0 15px;
      transition: 1s all;
      outline: none;
      background-color: #ffffff;
    }
  }
}
</style>