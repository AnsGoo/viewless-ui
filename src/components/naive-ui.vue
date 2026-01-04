<template>
  <viewless-form title="Naive UI 表单" style="border: 1px solid red;width: 100%;" v-show="true" />
</template>
<script setup lang="ts">
import { UseViewlessForm } from '@/examples/form';
import { useAdaptor as useNaiveUiAdaptor } from "@/ui/adaptor/naive-ui.ts";
import { useProvideAdaptor } from "@/core/provide.ts";
const ViewlessForm = UseViewlessForm();
useProvideAdaptor(useNaiveUiAdaptor);
</script>
