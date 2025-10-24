import { useToastContext } from "./ToastProvider";

export const useToast = () => {
  const { push, dismiss } = useToastContext();
  return { show: push, dismiss };
};

export default useToast;
