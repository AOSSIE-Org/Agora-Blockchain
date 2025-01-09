"use client";

import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";


interface ActionToolTipProps {
  label: string;
  align?: "start" | "center" | "end" ;
  side?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  classname: string;
  responsive: boolean;
}

const ActionToolTip = ({
  label,
  align = "center",
  side = "top",
  children,
  classname = "",
  responsive
}: ActionToolTipProps) => {

  return (
    <TooltipProvider>
    {responsive ? (
      <div>
        <div className="sm:hidden">
          <Tooltip delayDuration={10}>
            <TooltipTrigger asChild>
              {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align}>
              {label && (
                <p className="font-semibold text-sm capitalize">
                  {label.toLocaleLowerCase()}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="hidden sm:block">
          {children}
        </div>
      </div>
    ) : (
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {label && (
            <p className="font-semibold text-sm capitalize">
              {label.toLocaleLowerCase()}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    )}
  </TooltipProvider>

  );
};

 
export default ActionToolTip;