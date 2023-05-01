import { toastOpen, toastProps } from './stores';
import type { ToastProps } from './types';

export function createToast(props: ToastProps) {
  toastProps.set(props);
  toastOpen.set(true);
  setTimeout(closetoast, 2000);
}

export function closetoast() {
  toastOpen.set(false);
}
