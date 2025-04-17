
import { cn } from "@/lib/utils";

interface ShapeProps {
  type: "triangle" | "square" | "circle";
  size?: "sm" | "md" | "lg";
  rotation?: number;
  className?: string;
}

export const Shape = ({ type, size = "md", rotation = 0, className }: ShapeProps) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const baseStyle = cn(
    "transition-all duration-300 ease-in-out",
    sizes[size],
    className
  );

  const shapeStyles = {
    triangle: "clip-path-triangle",
    square: "rounded-none",
    circle: "rounded-full",
  };

  return (
    <div
      className={cn(
        baseStyle,
        "bg-[#9b87f5]",
        shapeStyles[type]
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
};
