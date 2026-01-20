<template>
  <div>
    <div class="flex flex-row justify-center items-center pt-20">
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>

    <div class="text-2xl font-bold mb-4 text-center">Viewless-UI 示例</div>
    <div class="flex flex-col justify-center items-center px-4">
      <div class="w-1/2">
        <viewlessTabs />
      </div>
      <!-- <div class="w-1/2">
        <ProxyCard />
      </div> -->
      <!-- <div class="w-1/2">
        <viewlessInput />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProvideAdaptor } from '@viewless-ui/core'
import { useNaiveUiAdaptor } from '@viewless-ui/ui'
import { viewlessTabs, viewlessInput, ProxyCard } from '@viewless/examples'

useProvideAdaptor(useNaiveUiAdaptor);
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
