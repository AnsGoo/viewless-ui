<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();
const emit = defineEmits<{
  go: [count: number];
}>();

const count = ref(0);
function countAdd() {
  count.value = count.value + 1;
  emit("go", count.value);
}
</script>

<template>
  <h1>---{{ msg }}---</h1>

  <div class="card">
    <button type="button" @click="countAdd">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
