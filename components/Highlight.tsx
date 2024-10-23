import Image from "next/image";

type Props = {
  children: React.ReactNode;
  fill?: string;
  color?: string;
};

function Highlight({ children, fill = "[#f79e07]", color = "white" }: Props) {
  console.log(`rotate-[-2deg] absolute inset-0 w-full h-full bg-[${fill}]`);
  return (
    <span className="p-[0.5px] m-1 relative leading-normal">
      <div
        className={`rotate-[-2deg] absolute inset-0 w-full h-full bg-${fill}`}
      ></div>
      <span className={`relative z-10 text-${color}`}>{children}</span>
    </span>
  );
}

export default Highlight;
