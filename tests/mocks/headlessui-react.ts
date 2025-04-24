// Mock for @headlessui/react
export const Switch = ({ checked, onChange, children }: any) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    data-testid="headless-switch"
  >
    {children}
  </button>
);
