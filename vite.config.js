import { defineConfig, mergeConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import pxToViewport from 'postcss-px-to-viewport'

export default defineConfig(({ mode }) => {
    // 加载环境变量
    const env = loadEnv(mode, process.cwd(), '')
    const plugins = [vue()]

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

    if (mode === 'lib') {
        return {
            plugins,
            build: {
                lib: {
                    entry: resolve(__dirname, 'src/index.ts'),
                    name: 'DraggableDivMobile',
                    fileName: format => `index.${format}.js`
                },
                rollupOptions: {
                    external: ['vue'],
                    output: {
                        globals: {
                            vue: 'Vue'
                        }
                    }
                },
                emptyOutDir: true
            }
        }
    } else {
        // 开发模式配置
        const config = {
            plugins,
            resolve: {
                alias: {
                    '@': resolve(__dirname, 'src')
                }
            }
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
    }
})