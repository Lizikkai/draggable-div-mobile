<script setup lang="ts">
import DraggableDiv from './components/draggable-div/draggable-div.vue'
</script>

<template>
    <div>
        <DraggableDiv axis="x" :need-bg-color="false">
            <div class="draggable-content">123123</div>
        </DraggableDiv>
    </div>
</template>

<style scoped lang="scss">
.draggable-content {
    width: 100px;
    height: 100px;
    background-color: aqua;
}
</style>