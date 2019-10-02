// Predefined configurations for OverlayController

export const withBottomSheetConfig = () => ({
  hasBackdrop: true,
  preventsScroll: true,
  trapsKeyboardFocus: true,
  hidesOnEsc: true,
  viewportConfig: {
    placement: 'bottom',
  },
});

export const withModalDialogConfig = () => ({
  isGlobal: true,
  isModal: true,
  hasBackdrop: true,
  preventsScroll: true,
  trapsKeyboardFocus: true,
  hidesOnEsc: true,
  viewportConfig: {
    placement: 'center',
  },
});

export const withDropdownConfig = () => ({
  inheritsInvokerWidth: true,
  hidesOnOutsideClick: true,
  popperConfig: {
    placement: 'bottom-start',
    modifiers: {
      offset: {
        enabled: false,
      },
    },
  },
});
