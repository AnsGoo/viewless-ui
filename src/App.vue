<template>
  <div>
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>

    <h1>UseComponent 示例集合</h1>

    <!-- 简单div组件 -->
    <SimpleDiv />

    <!-- 带事件的按钮组件 -->
    <EventButton />

    <!-- 数字作为slot内容 -->
    <NumberSlotExample />

    <!-- 混合内容的slot -->
    <MixedSlotExample />

    <!-- 卡片包含标签页 -->
    <CardWithTabs />

    <!-- 折叠面板组件 -->
    <ComplexCollapse />

    <!-- UiLess标签页组件 -->

    <NCard class="card-tabs">
      <UiLessTabs />
    </NCard>
    <NCard class="card-form">
      <ViewlessForm @change="formChange" />
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard } from "naive-ui";

// import HelloWorld from "./components/HelloWorld.vue";
import {
  SimpleDiv,
  EventButton,
  NumberSlotExample,
  MixedSlotExample,
  CardWithTabs,
  ComplexCollapse,
  UiLessTabs,
} from "./examples/example-components.ts";
import { UseForm } from "./examples/form.ts";
const ViewlessForm = UseForm();


function formChange(value: any) {
  console.log("form change", value);
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>
