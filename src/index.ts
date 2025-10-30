import type { App } from 'vue'
import DraggableDiv from './components/draggable-div/draggable-div.vue'

export { default as DraggableDiv } from './components/draggable-div/draggable-div.vue'

// Vue 插件安装函数
const install = (app: App) => {
  app.component('DraggableDiv', DraggableDiv)
}

// 默认导出
const DraggableDivVue = {
  install,
  DraggableDiv
}

export default DraggableDivVue
