<template>
  <viewless-form title="Element Plus 表单" />
</template>
<script setup lang="ts">
import { UseViewlessForm } from '@/examples/form';
import { useAdaptor as useElementPlusAdaptor } from "@/ui/adaptor/element-plus.ts";
import { useProvideAdaptor } from "@/ui/provide.ts";
const ViewlessForm = UseViewlessForm();
useProvideAdaptor(useElementPlusAdaptor);
</script>
