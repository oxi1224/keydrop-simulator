import { popupOpen, popupProps } from './stores';
import type { PopupProps } from './types';

export function createPopup(props: PopupProps) {
  popupProps.set(props);
  popupOpen.set(true);
  setTimeout(closePopup, 2000);
}

export function closePopup() {
  popupOpen.set(false);
}
