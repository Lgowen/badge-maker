<template>
  <div class="container" ref="container" v-show="display">
    <div class="message">
      <div class="message__box">
        <div class="message__title">
          {{ title }}
        </div>
        <div class="message__content" v-html="content"></div>
      </div>
      <div class="message__operation" @click="ok">
        {{ operation }}
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus, Events } from "./EventBus";

export default {
  data: () => ({
    title: "我是标题",
    content: "loriem ipsum asoidjiojfoewjfiojweeoifjowjefojwoifjwiofj",
    operation: "好的",
    display: false,
  }),
  mounted() {
    EventBus.$on(Events.MESSAGE, (args) => {
      console.log(args);
      this.show(args);
    });
  },
  methods: {
    show({ title, content, operation }) {
      this.display = true;
      this.$refs.container.className = "container container__show";
      this.title = title;
      this.content = content;
      this.operation = operation;
    },
    ok() {
      this.$refs.container.className = "container";
      setTimeout(() => {
        this.display = false;
      }, 400);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0);
  position: absolute;
  top: 0;
  left: 0;
  transition: 0.4s background-color;
  .message {
    position: absolute;
    border-radius: 5px;
    min-width: 280px;
    background-color: #6a5b9e;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    opacity: 0;
    transition: 0.4s opacity, 0.3s transform;
    color: #fff;
    .message__box {
      padding: 15px;
      .message__title {
        font-size: 18px;
        line-height: 36px;
        margin-bottom: 10px;
      }
      .message__content {
        line-height: 24px;
      }
    }
    .message__operation {
      width: 100%;
      height: 40px;
      background-color: #a2ca9c;
      color: #fff;
      bottom: 0;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.container__show {
  display: block;
  background-color: rgba($color: #000000, $alpha: 0.5);
  .message {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}
</style>