<template>
  <viewless-form
    title="Element Plus 表单"
    style="border: 1px solid red;"
    @formChange="handleChange"
  />
</template>
<script setup lang="ts">
import { UseViewlessForm } from '@/examples/form';
import { useAdaptor as useElementPlusAdaptor } from "@/ui/adaptor/element-plus.ts";
import { useProvideAdaptor } from "@/core/provide.ts";
const ViewlessForm = UseViewlessForm();
useProvideAdaptor(useElementPlusAdaptor);
function handleChange(model:any) {
  console.log(model);
}
</script>
