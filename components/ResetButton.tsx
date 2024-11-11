import { Trash } from "lucide-react";
import { RefObject } from "react";
import { useShallow } from "zustand/react/shallow";

import { useAppStore } from "@/store/app";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

interface IResetButtonProps {
  loading: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

const ResetButton = ({ loading, inputRef }: IResetButtonProps) => {
  const [images, clearImages] = useAppStore(
    useShallow((state) => [state.images, state.clearImages]),
  );

  const onClick = (): void => {
    clearImages();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="icon"
            disabled={!images.length || loading}
          >
            <Trash />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clear all images</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ResetButton;
