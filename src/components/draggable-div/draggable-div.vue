<template>
    <div class="draggable" ref="draggableRef" @mousedown="handleMouseDown" @touchstart="handleTouchStart"
        :class="{ 
            'dragging': isDragging,
            'axis-x': props.axis === 'x',
            'axis-y': props.axis === 'y',
            'axis-xy': props.axis === 'xy'
        }" :style="{
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease'
        }">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    /** 仅支持单边拖拽 */
    // axis: 'x' | 'xy' | 'y'
    axis: 'x' | 'xy' | 'y',
    /** 是否需要背景色 */
    needBgColor: boolean,
    /** 背景颜色 */
    bgColor?: string,
}>()

const draggableRef = ref<HTMLDivElement | null>(null)
/** 当前是否出去拖拽中 */
const isDragging = ref(false)
/** 拖拽开始时的鼠标/触摸位置 */
const startX = ref(0)
const startY = ref(0)

/** 当前元素的偏移位置 */
const offsetX = ref(0)
const offsetY = ref(0)

/** 拖拽开始时元素的初始偏移位置 */
const initialOffsetX = ref(0)
const initialOffsetY = ref(0)

function handleMouseDown(event: MouseEvent) {
    event.preventDefault()
    isDragging.value = true
    startX.value = event.clientX
    startY.value = event.clientY
    initialOffsetX.value = offsetX.value
    initialOffsetY.value = offsetY.value

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = 'none'
}
const getBoundaries = (): { minX: number, maxX: number, minY: number, maxY: number } => {
    if (!draggableRef.value) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }

    const style = window.getComputedStyle(draggableRef.value)
    const matrix = new DOMMatrix(style.transform)

    const rect = draggableRef.value.getBoundingClientRect()

    if (props.axis === 'xy') {
        // 原始位置（去除 transform 的影响）
        const originalLeft = rect.left - matrix.m41   // translateX
        const originalRight = rect.right - matrix.m41
        const originalTop = rect.top - matrix.m42     // translateY
        const originalBottom = rect.bottom - matrix.m42

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        return {
            minX: -originalLeft,
            maxX: windowWidth - originalRight,
            minY: -originalTop,
            maxY: windowHeight - originalBottom
        }
    } else if (props.axis === 'y') {
        // 计算元素的原始位置（减去当前的偏移）
        const originalTop = rect.top - matrix.m42  // m42 是 translateY
        const originalBottom = rect.bottom - matrix.m42

        const windowHeight = window.innerHeight

        return {
            minX: 0,
            maxX: 0,
            // 最小偏移：元素顶部不能超出屏幕顶部
            minY: -originalTop,
            // 最大偏移：元素底部不能超出屏幕底部  
            maxY: windowHeight - originalBottom
        }
    } else if (props.axis === 'x') {
        // 计算元素的原始位置（减去当前的偏移）
        const originalLeft = rect.left - matrix.m41   // translateX
        const originalRight = rect.right - matrix.m41

        const windowWidth = window.innerWidth

        return {
            // 最小偏移：元素左边不能超出屏幕左边
            minX: -originalLeft,
            // 最大偏移：元素右边不能超出屏幕右边
            maxX: windowWidth - originalRight,
            minY: 0,
            maxY: 0
        }
    }

    // 默认返回值，防止 TypeScript 错误
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
}

const constrainPosition = (x: number, y: number) => {
    const b = getBoundaries()
    if (props.axis === 'xy') {
        return {
            x: Math.max(b.minX, Math.min(b.maxX, x)),
            y: Math.max(b.minY, Math.min(b.maxY, y))
        }
    } else if (props.axis === 'y') {
        return {
            x: 0, // 固定X轴为0，保持在右侧
            y: Math.max(b.minY, Math.min(b.maxY, y))
        }
    } else if (props.axis === 'x') {
        return {
            x: Math.max(b.minX, Math.min(b.maxX, x)),
            y: 0 // 固定Y轴为0
        }
    }
    
    // 默认返回值
    return { x: 0, y: 0 }
}

function handleMouseMove(event: MouseEvent) {
    if (!isDragging.value) return
    if (props.axis === 'xy') {
        const deltaX = event.clientX - startX.value
        const deltaY = event.clientY - startY.value
        const newX = initialOffsetX.value + deltaX
        const newY = initialOffsetY.value + deltaY
        const constrained = constrainPosition(newX, newY)
        offsetX.value = constrained.x
        offsetY.value = constrained.y
    } else if (props.axis === 'y') {
        // 只处理Y轴的移动
        const deltaY = event.clientY - startY.value
        const newY = initialOffsetY.value + deltaY
        const constrained = constrainPosition(0, newY)
        offsetX.value = constrained.x // 始终为0
        offsetY.value = constrained.y
    } else if (props.axis === 'x') {
        // 只处理X轴的移动
        const deltaX = event.clientX - startX.value
        const newX = initialOffsetX.value + deltaX
        const constrained = constrainPosition(newX, 0)
        offsetX.value = constrained.x
        offsetY.value = constrained.y // 始终为0
    }
}
function handleMouseUp() {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = ''
}

function handleTouchStart(event: TouchEvent) {
    event.preventDefault()
    const touch = event.touches[0]
    isDragging.value = true
    startX.value = touch.clientX
    startY.value = touch.clientY
    initialOffsetX.value = offsetX.value
    initialOffsetY.value = offsetY.value

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
}

const handleTouchMove = (event: TouchEvent) => {
    if (!isDragging.value) return
    event.preventDefault()
    const touch = event.touches[0]
    if (props.axis === 'xy') {
        const deltaX = touch.clientX - startX.value
        const deltaY = touch.clientY - startY.value
        const newX = initialOffsetX.value + deltaX
        const newY = initialOffsetY.value + deltaY

        const constrained = constrainPosition(newX, newY)
        offsetX.value = constrained.x
        offsetY.value = constrained.y
    } else if (props.axis === 'y') {
        const deltaY = touch.clientY - startY.value
        const newY = initialOffsetY.value + deltaY
        const constrained = constrainPosition(0, newY)
        offsetX.value = constrained.x // 始终为0
        offsetY.value = constrained.y
    } else if (props.axis === 'x') {
        const deltaX = touch.clientX - startX.value
        const newX = initialOffsetX.value + deltaX
        const constrained = constrainPosition(newX, 0)
        offsetX.value = constrained.x
        offsetY.value = constrained.y // 始终为0
    }
}

function handleTouchEnd() {
    isDragging.value = false
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
}


</script>

<style scoped lang="scss">
.draggable {
    position: fixed;
    z-index: 1000;
    // width: 100px;
    // height: 100px;
    
    // 根据拖拽轴设置不同的光标和初始位置
    &.axis-x {
        cursor: ew-resize; // 水平拖拽光标
        top: 0; // 垂直居中（减去元素高度的一半）
        left: calc(50% - 50px); // 水平居中（减去元素宽度的一半）
    }
    
    &.axis-y {
        cursor: ns-resize; // 垂直拖拽光标
        right: 0px;
        top: calc(50% - 50px); // 垂直居中（减去元素高度的一半）
    }
    
    &.axis-xy {
        cursor: move; // 全方向拖拽光标
        top: calc(50% - 50px); // 垂直居中（减去元素高度的一半）
        left: calc(50% - 50px); // 水平居中（减去元素宽度的一半）
    }
}
</style>