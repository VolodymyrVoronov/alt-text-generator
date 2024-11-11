import { Loader } from "lucide-react";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";

import { cn } from "@/lib/utils";
import { IImage, useAppStore } from "@/store/app";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";

interface IImagePreviewProps {
  img: IImage;
  loading: boolean;

  handleClick: (img: IImage) => void;
}

const ImagePreview = ({ img, loading, handleClick }: IImagePreviewProps) => {
  const [activeImageId, setActiveImageId, deleteImage] = useAppStore(
    useShallow((state) => [
      state.activeImageId,
      state.setActiveImageId,
      state.deleteImage,
    ]),
  );

  const onClick = (): void => {
    handleClick(img);
    setActiveImageId(img.id);
  };

  const onDelete = (): void => {
    deleteImage(img.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Button
          className={cn(
            "relative m-0 flex h-auto w-full flex-col p-2",
            loading && activeImageId === img.id && "animate-pulse",
            activeImageId === img.id && "opacity-100 ring-4 ring-blue-500",
            activeImageId !== img.id &&
              "transition-all hover:ring-4 hover:ring-blue-200",
          )}
          onClick={onClick}
          variant="secondary"
          disabled={loading}
        >
          <span className="font-bold">{img.name}</span>

          <AspectRatio ratio={16 / 9} key={img.id}>
            <Image
              src={`data:image/jpeg;base64,${img.base64}`}
              alt="Uploaded Image"
              className="h-full w-full rounded-md object-contain"
              fill
            />
          </AspectRatio>

          {loading && activeImageId === img.id && (
            <Loader className="absolute animate-spin text-black" />
          )}
        </Button>

        <ContextMenuContent>
          <ContextMenuItem onClick={onDelete} disabled={loading}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuTrigger>
    </ContextMenu>
  );
};

export default ImagePreview;
