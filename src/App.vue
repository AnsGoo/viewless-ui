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

    <h1>Viewless-UI 示例集合</h1>
    <ViewlessForm @change="formChange"  ref="formRef"/>
  </div>
</template>

<script setup lang="ts">
import { UseViewlessForm } from "./examples/form.ts";
// import { useAdaptor } from "@/ui/adaptor/naive-ui.ts";
import { useAdaptor as useElementPlusAdaptor } from "@/ui/adaptor/element-plus.ts";
import { useProvideAdaptor } from "@/ui/provide.ts";
const ViewlessForm = UseViewlessForm();

// useProvideAdaptor(useAdaptor);
useProvideAdaptor(useElementPlusAdaptor);



function formChange(...value: any) {
  console.log("form change", ...value);
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
