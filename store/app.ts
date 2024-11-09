import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface IImage {
  id: string;
  name: string;
  base64: string;
  description: string;
}

export interface IAppStore {
  images: IImage[];
  activeImageId: string;
}

export interface IAppActions {
  setImage: (image: IImage) => void;
  updateImage: (id: string, image: Partial<IImage>) => void;
  setActiveImageId: (id: string) => void;
  clearImages: () => void;
}

export const useAppStore = create(
  persist(
    devtools(
      immer<IAppStore & IAppActions>((set) => ({
        images: [],
        activeImageId: "",

        setImage: (image) => {
          set((state) => {
            state.images.push(image);
          });
        },

        updateImage: (id, image) => {
          set((state) => {
            const index = state.images.findIndex((i) => i.id === id);

            if (index !== -1) {
              state.images[index] = {
                ...state.images[index],
                ...image,
              };
            }
          });
        },

        setActiveImageId: (id) => {
          set((state) => {
            state.activeImageId = id;
          });
        },

        clearImages: () =>
          set((state) => {
            state.images = [];
            state.activeImageId = "";
          }),
      })),
    ),
    {
      name: "alt-text-generator-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
