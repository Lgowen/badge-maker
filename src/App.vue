<template>
  <div id="app">
    <badge @finish="handleFinish" @handleStroage="handleStroage" />
    <finish v-if="imgSrc || stroageImage" :img-src.sync="imgSrc" :storage-image.sync="stroageImage" />
    <!-- <photos v-if="stroageImage" :img-src.sync="stroageImage" /> -->
    <alert />
    <message />
  </div>
</template>

<script>
import Badge from "./views/Badge";
import Finish from "./views/Finish";
import Alert from './components/Alert.vue'
import Message from './components/Message.vue'
// import Photos from './views/photos.vue'
import { getLocalStorage } from './utils/stroage'
import { Events, EventBus } from './components/EventBus'
export default {
  name: "App",
  data: () => ({
    imgSrc: null,
    stroageImage: null
  }),
  mounted() {
    EventBus.$on(Events.JOBNUMBER, jobNumber => {
      const base64 = getLocalStorage(jobNumber)
      if (base64) {
          this.stroageImage = base64
      }
      console.log(this.stroageImage);
    })
  },
  components: {
    Badge,
    Finish,
    Alert,
    Message
  },
  computed: {
     newMessage() {
       return this.stroageImage ? this.stroageImage : this.imgSrc
     }
  },
  methods: {
    handleFinish(base64) {
      this.imgSrc = base64;
    },
    handleStroage (jobNumber) {
      const base64 = getLocalStorage(jobNumber)
      if (base64) {
          this.stroageImage = base64
          console.log(this.stroageImage);
      }
    }
  },
};
</script>
<style>
* {
  margin: 0;
}
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

body {
  overflow: hidden;
}
</style>
