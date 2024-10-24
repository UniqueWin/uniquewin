type Props = {
  children: React.ReactNode;
  fill?: string;
  color?: string;
};

function Highlight({ children, fill = "[#f79e07]", color = "white" }: Props) {
  return (
    <span className="p-[0.5px] m-1 relative leading-normal whitespace-nowrap">
      <div
        className={`rotate-[-2deg] absolute inset-0 h-full bg-${fill}`}
      ></div>
      <span className={`relative z-10 text-${color}`}>{children}</span>
    </span>
  );
}

export default Highlight;
