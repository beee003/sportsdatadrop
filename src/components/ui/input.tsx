import { Component, JSX, splitProps } from "solid-js";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  class?: string;
}

export const Input: Component<InputProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <input
      class={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text placeholder:text-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all ${local.class || ""}`}
      {...others}
    />
  );
};
