<template>
  <viewless-form title="Naive UI 表单" />
</template>
<script setup lang="ts">
import { UseViewlessForm } from '@/examples/form';
import { useAdaptor as useNaiveUiAdaptor } from "@/ui/adaptor/naive-ui.ts";
import { useProvideAdaptor } from "@/ui/provide.ts";
const ViewlessForm = UseViewlessForm();
useProvideAdaptor(useNaiveUiAdaptor);
</script>
