import { Component, JSX, splitProps } from "solid-js";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ["variant", "size", "class", "children"]);
  
  const variantClasses = {
    default: "bg-accent text-black hover:bg-green-300 font-semibold",
    outline: "border border-accent text-accent hover:bg-accent/10",
    ghost: "text-accent hover:bg-white/5",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      class={`rounded-lg transition-all duration-200 ${variantClasses[local.variant || "default"]} ${sizeClasses[local.size || "md"]} ${local.class || ""}`}
      {...others}
    >
      {local.children}
    </button>
  );
};
