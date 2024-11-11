"use client";

import { Fragment, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useToast } from "@/hooks/use-toast";
import useImageDescription from "@/hooks/useImageDescription";
import { useAppStore } from "@/store/app";

import ImageDescription from "@/components/ImageDescription";
import ImagePreview from "@/components/ImagePreview";
import ImageUploader from "@/components/ImageUploader";
import ResetButton from "@/components/ResetButton";
import { Separator } from "@/components/ui/separator";

export default function Chat() {
  const { toast } = useToast();

  const { loading, error, fetchDescription } = useImageDescription();

  const [images, activeImageId] = useAppStore(
    useShallow((state) => [state.images, state.activeImageId]),
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
          <ImageUploader loading={loading} inputRef={inputRef} />
          <ResetButton loading={loading} inputRef={inputRef} />
        </div>

        {images.length ? (
          <div className="flex h-[calc(100vh-75px)] w-full flex-col gap-4 overflow-auto p-3">
            {images.map((img) => (
              <Fragment key={img.id}>
                <ImagePreview
                  img={img}
                  loading={loading}
                  handleClick={(img) => fetchDescription(img)}
                />
              </Fragment>
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
              <Fragment key={img.id}>
                {img.description ? (
                  <Fragment>
                    <ImageDescription img={img} loading={loading} />

                    <Separator className="mt-2 h-[2px]" />
                  </Fragment>
                ) : null}
              </Fragment>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
