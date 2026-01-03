import { computed, onMounted, reactive, ref, watch } from 'vue';
import { defineViewlessComponent, useViewlessTemplateRef, type UiComponent } from '@/core/render';
import { useCard, useFormItem, useInput, useForm } from '@/ui';
import type { FormHandler } from '@/ui/components/form';

// 定义表单数据类型
interface FormModel {
  username: string;
  password: string;
}

export function UseViewlessForm() {
  return defineViewlessComponent({
    name: 'UseViewlessForm',
    props: {
      title: {
        type: String,
        default: 'viewless-ui 表单示例',
      },
    },
    setup(props, context) {
      const username = ref('123');
      const password = ref('');
      const model: FormModel = reactive({
        username,
        password,
      });

      const formRef = useViewlessTemplateRef('formRef');

      onMounted(async () => {
        if (formRef.value) {
          console.log(
            'formRef.value.validate()',
            await (formRef.value as FormHandler).validate?.(),
          );
        }
      });

      watch(
        () => model.username,
        (newValue, oldValue) => {
          console.log('用户名变化了', newValue, oldValue);
          context.emit('formChange', { ...model });
        },
      );

      watch(
        () => model.password,
        (newValue, oldValue) => {
          console.log('密码变化了', newValue, oldValue);
        },
      );

      return reactive<UiComponent>(
        useCard({
          $key: 'form-card',
          title: props.title,
          defaultSlot: useForm({
            modelValue: model,
            $ref: 'formRef',
            labelPosition: 'top',
            defaultSlot: [
              useFormItem({
                prop: 'username',
                label: '用户名',
                required: true,
                $key: 'username',
                defaultSlot: useInput({
                  modelValue: username,
                  placeholder: '请输入用户名',
                  'onUpdate:modelValue': (value: string) => {
                    console.log('用户名输入框值变化了', value);
                    model.username = value;
                  },
                }),
              }),
              useFormItem({
                prop: 'password',
                label: '密码',
                required: true,
                $key: 'password',
                $vshow: computed(() => model.username !== '1234'),
                defaultSlot: useInput({
                  modelValue: password,
                  placeholder: '请输入密码',
                  type: 'password',
                  'onUpdate:modelValue': (value: string) => {

                    model.password = value;
                  },
                }),
              }),
            ],
          }),
        }),
      );
    },
  });
}
