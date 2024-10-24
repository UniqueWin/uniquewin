"use client";

import { useState } from "react";
import { CloverSwitch } from "./ui/cloverswitch";
import { Label } from "./ui/label";

interface CustomSwitchProps {
  label: string;
  onChange: (checked: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ label, onChange }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange(newCheckedState);
  };

  return (
    <div className="flex items-center gap-4 md:gap-2 bg-black bg-opacity-40 p-2 rounded-full w-23 px-10 justify-center py-2 md:bg-transparent my-2 md:my-0">
      <CloverSwitch
        id="lucky-dip"
        onCheckedChange={handleToggle}
        checked={isChecked}
      />
      <Label htmlFor="lucky-dip" className="font-bold">
        Lucky Dip
      </Label>
    </div>
  );
};

export default CustomSwitch;
