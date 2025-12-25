import { onMounted, reactive, ref, watch } from "vue";
import { useComponent } from "../lib/use-component.tsx";
import { NForm, NFormItem, NInput } from "naive-ui";

export function UseForm() {
    const username = ref("123");
    const password = ref("");
  const model = reactive({
    username,
    password,
  });
  return useComponent({
    component: NForm,
    props: reactive({
      model: model,
    }),
    slots: {
      default: [
        {
          component: NFormItem,
          props: reactive({
            path: "username",
            label: "用户名",
            required: true,
          }),
          slots: {
            default: {
              component: NInput,
              props: {
                value: username,
                placeholder: "请输入用户名",
                onUpdateValue: (value: string) => {
                  console.log(value);
                  model.username = value;    
                },
              },
            //   events: {
            //     change: (_value) => {
            //     //   console.log(value);
            //     },
            //     // "update:value": (value) => {
            //     //   console.log(value);
            //     // //   model.username = value;
            //     // },
            //   },
            },
          },
        },
        {
          component: NFormItem,
          props: reactive({
            path: "password",
            label: "密码",
            required: true,
          }),
          slots: {
            default: {
              component: NInput,
              props: {
                value: password,
                placeholder: "请输入密码",
                type: "password",
                onUpdateValue: (value:string) => {
                  console.log(value);
                  model.password = value;    
                },
              },
            },
          },
        },
      ],
    },
    setup: ({ props, events }, context) => {
      console.log(props);
      console.log(events);
      console.log(context);
      onMounted(() => {
        console.log("组件挂载完成");
        console.log(props.model);
        props.model.username = "默认用户名";
      });
      watch(
        () => props.model.username,
        (newValue, oldValue) => {
          console.log("用户名变化了", newValue, oldValue);
        },
      );
      watch(
        () => props.model.password,
        (newValue, oldValue) => {
          console.log("密码变化了", newValue, oldValue);
        },
      );
      return { props, events };
    },
  });
}
