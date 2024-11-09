import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { IImage, useAppStore } from "@/store/app";

const useImageDescription = () => {
  const [updateImage] = useAppStore(useShallow((state) => [state.updateImage]));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDescription = async (image: IImage): Promise<void> => {
    if (!image) return;

    setLoading(true);
    try {
      const response = await fetch("/api/describe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ base64Image: image.base64 }),
      });

      if (!response.ok) throw new Error("Failed to fetch description");

      const data = await response.json();

      updateImage(image.id, { description: data.description });
    } catch (error) {
      console.error(error);

      setError("Failed to fetch description");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchDescription,
  };
};

export default useImageDescription;
