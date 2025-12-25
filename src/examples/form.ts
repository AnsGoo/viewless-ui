import { onMounted, reactive, watch } from "vue";
import { useComponent } from "../lib/use-component.tsx";
import { NForm, NFormItem, NInput } from "naive-ui";

export function UseForm() {
  const model = reactive({
    username: "123",
    password: "",
  });
  return useComponent({
    component: NForm,
    props: reactive({
      modelValue: model,
    }),
    slots: {
      default: [
        {
          component: NFormItem,
          props: reactive({
            name: "username",
            label: "用户名",
            required: true,
          }),
          slots: {
            default: {
              component: NInput,
              props: reactive({
                value: model.username,
                placeholder: "请输入用户名",
              }),
              events: {
                change: (value) => {
                  console.log(value);
                },
                "update:value": (value) => {
                  console.log(value);
                  model.username = value;
                },
              },
            },
          },
        },
        {
          component: NFormItem,
          props: reactive({
            name: "password",
            label: "密码",
            required: true,
          }),
          slots: {
            default: {
              component: NInput,
              props: reactive({
                modelValue: model.password,
                placeholder: "请输入密码",
              }),
            },
          },
        },
      ],
    },
    use: ({ props, events }, context) => {
      console.log(props);
      console.log(events);
      console.log(context);
      onMounted(() => {
        console.log("组件挂载完成");
        console.log(props.modelValue);
        props.modelValue.username = "默认用户名";
      });
      watch(
        () => props.modelValue.username,
        (newValue, oldValue) => {
          console.log("用户名变化了", newValue, oldValue);
        },
      );
      watch(
        () => props.modelValue.password,
        (newValue, oldValue) => {
          console.log("密码变化了", newValue, oldValue);
        },
      );
      return { props, events };
    },
  });
}
