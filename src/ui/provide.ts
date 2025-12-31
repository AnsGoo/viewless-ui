import { provide } from 'vue';
import { ADAPTOR_KEY, HANDLE_ADAPTOR_KEY } from '@/lib/const';
import type { HandleAdaptor, UiComponent } from '@/lib/use-component';

type Adaptor = (opt: UiComponent) => UiComponent;
type AdaptorFn = () => {
  adaptorMap: Record<string, Adaptor>;
  adaptor: Adaptor;
  handleAdaptor: HandleAdaptor;
};

export function useProvideAdaptor(useAdaptor: AdaptorFn) {
  const { adaptor, handleAdaptor } = useAdaptor();
  provide(ADAPTOR_KEY, adaptor);
  provide(HANDLE_ADAPTOR_KEY, handleAdaptor);
}
