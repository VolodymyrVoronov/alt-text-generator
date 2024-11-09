import { ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";

import generateRandomUUID from "@/helpers/generateRandomUUID";
import { IImage, useAppStore } from "@/store/app";

const useUploadImages = () => {
  const [setImage] = useAppStore(useShallow((state) => [state.setImage]));

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);

    convertToBase64(files);
  };

  const convertToBase64 = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Array = reader.result as string;

        const newImage = {
          id: generateRandomUUID(),
          name: file.name,
          base64: base64Array.split(",")[1],
          description: "",
        } as IImage;

        console.log("newImage", newImage);

        setImage(newImage);
      };

      reader.readAsDataURL(file);
    });
  };

  return {
    handleFileChange,
  };
};

export default useUploadImages;
