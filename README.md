# Draggable Div Mobile

移动端可拖拽的div组件，支持Vue 3。

## 安装

```bash
npm install draggable-div-mobile
```

## 基本使用

```vue
<template>
  <div>
    <DraggableDiv>
      <div>可拖拽的内容</div>
    </DraggableDiv>
  </div>
</template>

<script setup>
import { DraggableDiv } from 'draggable-div-mobile'
</script>
```

## 移动端适配配置

为了确保组件在移动端正确显示，建议在你的项目中配置px-to-vw转换。

### 1. 安装依赖

```bash
npm install postcss-px-to-viewport --save-dev
```

### 2. 配置Vite项目

在你的 `vite.config.js` 中添加以下配置：

```javascript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import pxToViewport from 'postcss-px-to-viewport'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 检查是否启用 px-to-vw 转换
  const enablePxToVw = env.VITE_ENABLE_PX_TO_VW === 'true'
  
  // px-to-vw 配置选项
  const pxToVwOptions = {
    viewportWidth: 750,
    unitPrecision: 3,
    viewportUnit: 'vw',
    selectorBlackList: ['.ignore', '.hairlines', '.px_ignore'],
    minPixelValue: 1,
    mediaQuery: false,
    exclude: /(\/|\\)(node_modules)(\/|\\)/
  }

  const config = {
    plugins: [vue()],
    // 其他配置...
  }

  // 根据配置决定是否启用 px-to-vw 转换
  if (enablePxToVw) {
    config.css = {
      postcss: {
        plugins: [
          pxToViewport(pxToVwOptions)
        ]
      }
    }
  }

  return config
})
```

### 3. 环境变量配置

在项目根目录创建 `.env` 文件：

```env
# 启用px-to-vw转换
VITE_ENABLE_PX_TO_VW=true

# 可选配置项
VITE_VIEWPORT_WIDTH=750
VITE_UNIT_PRECISION=3
VITE_VIEWPORT_UNIT=vw
VITE_SELECTOR_BLACKLIST=.ignore,.hairlines,.px_ignore
VITE_MIN_PIXEL_VALUE=1
VITE_MEDIA_QUERY=false
```

### 4. 配置说明

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_ENABLE_PX_TO_VW` | 是否启用px-to-vw转换 | `false` |
| `VITE_VIEWPORT_WIDTH` | 设计稿宽度 | `750` |
| `VITE_UNIT_PRECISION` | 转换后的小数位数 | `3` |
| `VITE_VIEWPORT_UNIT` | 转换后的单位 | `vw` |
| `VITE_SELECTOR_BLACKLIST` | 不转换的选择器（逗号分隔） | `.ignore,.hairlines,.px_ignore` |
| `VITE_MIN_PIXEL_VALUE` | 最小转换像素值 | `1` |
| `VITE_MEDIA_QUERY` | 是否转换媒体查询中的px | `false` |

## 其他构建工具配置

### Webpack项目

如果你使用的是Webpack，可以这样配置：

```javascript
// webpack.config.js
const pxToViewport = require('postcss-px-to-viewport')

module.exports = {
  // 其他配置...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  pxToViewport({
                    viewportWidth: 750,
                    unitPrecision: 3,
                    viewportUnit: 'vw',
                    selectorBlackList: ['.ignore', '.hairlines', '.px_ignore'],
                    minPixelValue: 1,
                    mediaQuery: false,
                    exclude: /(\/|\\)(node_modules)(\/|\\)/
                  })
                ]
              }
            }
          }
        ]
      }
    ]
  }
}
```

### Vue CLI项目

```javascript
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px-to-viewport')({
            viewportWidth: 750,
            unitPrecision: 3,
            viewportUnit: 'vw',
            selectorBlackList: ['.ignore', '.hairlines', '.px_ignore'],
            minPixelValue: 1,
            mediaQuery: false,
            exclude: /(\/|\\)(node_modules)(\/|\\)/
          })
        ]
      }
    }
  }
}
```

## 注意事项

1. **设计稿宽度**：请根据你的设计稿宽度调整 `viewportWidth` 参数
2. **选择器黑名单**：如果某些元素不需要进行px-to-vw转换，可以添加相应的class到黑名单中
3. **第三方组件**：`exclude` 配置会排除 `node_modules` 中的文件，避免影响第三方组件

## API文档

### DraggableDiv Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `disabled` | `boolean` | `false` | 是否禁用拖拽 |
| `boundary` | `string \| HTMLElement` | `'parent'` | 拖拽边界限制 |
| `initialPosition` | `{x: number, y: number}` | `{x: 0, y: 0}` | 初始位置 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `drag-start` | `{x: number, y: number}` | 开始拖拽时触发 |
| `drag-move` | `{x: number, y: number}` | 拖拽过程中触发 |
| `drag-end` | `{x: number, y: number}` | 拖拽结束时触发 |

## 许可证

ISC

## 贡献

欢迎提交Issue和Pull Request！