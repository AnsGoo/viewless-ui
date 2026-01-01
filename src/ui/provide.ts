import { provide } from 'vue';
import { ADAPTOR_KEY, HANDLE_ADAPTOR_KEY } from '@/core/const';
import type { HandleAdaptor, UiComponent } from '@/core/use-component';

export type Adaptor = (opt: UiComponent) => UiComponent;
export type AdaptorFn = () => {
  adaptorMap: Record<string, Adaptor>;
  adaptor: Adaptor;
  handleAdaptor: HandleAdaptor;
};

export function useProvideAdaptor(useAdaptor: AdaptorFn) {
  const { adaptor, handleAdaptor, adaptorMap } = useAdaptor();
  provide(ADAPTOR_KEY, adaptor);
  provide(HANDLE_ADAPTOR_KEY, handleAdaptor);
  return adaptorMap
}
