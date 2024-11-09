"use client";

import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Loader, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useToast } from "@/hooks/use-toast";
import useImageDescription from "@/hooks/useImageDescription";
import useUploadImages from "@/hooks/useUploadImages";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Chat() {
  const { toast } = useToast();

  const { handleFileChange } = useUploadImages();
  const { loading, error, fetchDescription } = useImageDescription();
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const [images, activeImageId, setActiveImageId, clearImages] = useAppStore(
    useShallow((state) => [
      state.images,
      state.activeImageId,
      state.setActiveImageId,
      state.clearImages,
    ]),
  );

  console.log("images", images);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [error, toast]);

  useEffect(() => {
    if (activeImageId && !loading) {
      const element = document.getElementById(activeImageId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [activeImageId, loading]);

  return (
    <main className="grid h-full w-full grid-cols-[1fr_auto_1fr] gap-5 p-5">
      <div className="flex flex-col items-start justify-start gap-2">
        <div className="flex w-full flex-row gap-2 p-2">
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hover:cursor-pointer"
            disabled={loading}
            multiple
          />

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    clearImages();

                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
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
        </div>

        {images.length ? (
          <div className="flex h-[calc(100vh-75px)] w-full flex-col gap-4 overflow-auto p-3">
            {images.map((img) => (
              <>
                <Button
                  key={img.id}
                  className={cn(
                    "relative m-0 flex h-full w-full flex-col p-2",
                    loading && activeImageId === img.id && "animate-pulse",
                    activeImageId === img.id &&
                      "opacity-100 ring-4 ring-blue-500",
                  )}
                  onClick={() => {
                    setActiveImageId(img.id);
                    fetchDescription(img);
                  }}
                  variant="secondary"
                  disabled={loading}
                >
                  <span className="font-bold">{img.name}</span>

                  <AspectRatio ratio={16 / 9} key={img.id}>
                    <Image
                      src={`data:image/jpeg;base64,${img.base64}`}
                      alt="Uploaded Image"
                      className="h-full w-full rounded-md object-contain opacity-50 hover:opacity-100"
                      fill
                    />
                  </AspectRatio>

                  {loading && activeImageId === img.id && (
                    <Loader className="absolute animate-spin text-black" />
                  )}
                </Button>
              </>
            ))}
          </div>
        ) : null}
      </div>

      <Separator orientation="vertical" className="hidden md:block" />

      <div className="h-screen overflow-auto p-3">
        {images.length && images.some((img) => img.description) ? (
          <div className="flex flex-col gap-5">
            <h3 className="font-semibold">Image(s) Description:</h3>

            {images.map((img) => (
              <>
                {img.description ? (
                  <div id={img.id}>
                    <div
                      key={img.id}
                      className={cn(
                        "flex flex-col gap-3 border-2 border-transparent p-2",
                        activeImageId === img.id &&
                          "rounded-md border-2 border-blue-500",
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
                            loading &&
                              activeImageId === img.id &&
                              "animate-pulse",
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
                            <div
                              key={index}
                              className="flex flex-row items-start gap-2"
                            >
                              <Button
                                onClick={() =>
                                  copyToClipboard(line.replace(/\d+\./, ""))
                                }
                                size="sm"
                                variant="outline"
                                disabled={loading}
                              >
                                {copiedText === line.replace(/\d+\./, "")
                                  ? "Copied"
                                  : "Copy"}
                              </Button>

                              <p>{line}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator className="mt-2 h-[2px]" />
                  </div>
                ) : null}
              </>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
