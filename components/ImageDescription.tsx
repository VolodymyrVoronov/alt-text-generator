import Image from "next/image";
import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";

import { cn } from "@/lib/utils";
import { IImage, useAppStore } from "@/store/app";

import CopyDescription from "./CopyDescription";

interface IImageDescriptionProps {
  img: IImage;
  loading: boolean;
}

const ImageDescription = ({ img, loading }: IImageDescriptionProps) => {
  const [activeImageId] = useAppStore(
    useShallow((state) => [state.activeImageId]),
  );

  return (
    <Fragment>
      <div
        id={img.id}
        className={cn(
          "flex flex-col gap-3 border-2 border-transparent p-2",
          activeImageId === img.id && "rounded-md border-2 border-blue-500",
        )}
      >
        <span className="font-bold">{img.name}</span>

        <div className="flex flex-row gap-2">
          <Image
            src={`data:image/jpeg;base64,${img.base64}`}
            alt="Uploaded Image"
            width={100}
            height={200}
            className={cn(
              "flex self-start rounded-md",
              loading && activeImageId === img.id && "animate-pulse",
            )}
          />

          <div
            className={cn(
              "flex flex-col gap-2",
              loading &&
                activeImageId === img.id &&
                "animate-pulse text-blue-500 blur-[1px]",
            )}
          >
            {img.description.split("\n").map((line, index) => (
              <div key={index} className="flex flex-row items-start gap-2">
                <CopyDescription line={line} loading={loading} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ImageDescription;
