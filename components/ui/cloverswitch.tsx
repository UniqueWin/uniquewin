"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { Clover } from "lucide-react";

function IconClover(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="30%" y1="0%" x2="50%" y2="50%">
          <stop offset="0%" style={{ stopColor: "#94f49e", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#72ed64", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#269b34", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <path
        fill="url(#grad1)"
        d="M12 11.18c3.3-3 5-4.54 5-6.49C17 3.19 15.75 2 14.25 2c-.86 0-1.68.36-2.25 1-.57-.64-1.39-1-2.31-1C8.19 2 7 3.25 7 4.75c0 1.89 1.7 3.43 5 6.43m-.82.82c-3-3.3-4.54-5-6.49-5C3.19 7 2 8.25 2 9.75c0 .86.36 1.68 1 2.25-.64.57 1-1.39 1-2.31C2 15.81 3.25 17 4.75 17c1.89 0 3.43-1.7 6.43-5m1.65 0c2.99 3.3 4.53 5 6.48 5 1.5 0 2.69-1.25 2.69-2.75 0-.86-.36-1.68-1-2.25.64-.57 1-1.39 1-2.31C22 8.19 20.75 7 19.25 7c-1.89 0-3.43 1.7-6.42 5m-.83.82c-3.3 3-5 4.54-5 6.49C7 20.81 8.25 22 9.75 22c.86 0 1.68-.36 2.25-1 .57.64 1.39 1 2.31 1 1.5 0 2.69-1.25 2.69-2.75 0-1.89-1.7-3.43-5-6.43z"
      />
    </svg>
  );
}

const CloverSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-4 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-purple-400 data-[state=unchecked]:bg-opacity-40 data-[state=checked]:bg-opacity-40 group",
      className
    )}
    {...props}
    ref={ref}
  >
    {/* Custom Thumb */}
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-7 w-7 rounded-full bg-yellow-500 shadow-lg ring-0 data-[state=checked]:translate-x-9 data-[state=unchecked]:-translate-x-1 flex items-center justify-center duration-300 group-hover:scale-110 transition-all"
      )}
    >
      <IconClover
        className={`h-6 w-6 text-green-500 duration-300 ${
          props.checked ? "rotate-90" : "rotate-0"
        } `}
      />
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
CloverSwitch.displayName = SwitchPrimitives.Root.displayName;

export { CloverSwitch };
