"use client";

import { useState } from "react";
import { CloverSwitch } from "./ui/closerswitch";
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
    <div className="flex items-center space-x-2 py-1">
      <CloverSwitch
        id="lucky-dip"
        onCheckedChange={handleToggle}
        checked={isChecked}
      />
      <Label htmlFor="lucky-dip">Lucky Dip</Label>
    </div>
  );
};

export default CustomSwitch;
