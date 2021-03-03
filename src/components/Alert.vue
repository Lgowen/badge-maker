<template>
  <div class="alert" ref="alert">
    <v-icon name="exclamation-circle" /> {{ msg }}
  </div>
</template>

<script>
import { EventBus, Events } from "./EventBus";
let backTimeout = null;
export default {
  props: {},
  data: () => ({
    msg: null,
    duration: 1000,
  }),
  mounted() {
    EventBus.$on(Events.ALERT, ({ msg, duration, type }) => {
      this.duration = duration;
      this.show(msg, type);
    });
  },
  methods: {
    show(msg, type) {
      if (backTimeout) clearTimeout(backTimeout);
      const alertDom = this.$refs.alert;
      this.msg = msg;
      const basicClass = ["alert"];
      if (type === "success") {
        basicClass.push("alert__success");
      }
      alertDom.className = basicClass.concat("alert__show").join(" ");
      if (this.duration < 0) return;
      if (!this.duration) this.duration = 1000;
      backTimeout = setTimeout(() => {
        alertDom.className = basicClass.join(" ");
      }, this.duration);
    },
  },
};
</script>
<style lang="scss" scoped>
.alert {
  min-width: 280px;
  color: #fff;
  background-color: #6a5b9e;
  border-radius: 5px;
  z-index: 99999999999999999;
  position: fixed;
  left: 50%;
  transform: translate(-50%, -200%);
  top: 20px;
  text-align: start;
  padding: 15px;
  opacity: 0;
  transition: 0.4s opacity, 0.3s transform;
  line-height: 22px;
  font-size: 16px;
}
.alert__show {
  opacity: 1;
  transform: translate(-50%, 0);
}
.alert__success {
  background-color: #a2ca9c;
}
</style>