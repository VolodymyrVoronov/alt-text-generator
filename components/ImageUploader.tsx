import { InputHTMLAttributes, RefObject } from "react";

import useUploadImages from "@/hooks/useUploadImages";

import { Input } from "./ui/input";

interface IImageUploaderProps extends InputHTMLAttributes<HTMLInputElement> {
  loading: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

const ImageUploader = ({
  loading,
  inputRef,

  ...props
}: IImageUploaderProps) => {
  const { handleFileChange } = useUploadImages();

  return (
    <Input
      ref={inputRef}
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      onChange={handleFileChange}
      className="hover:cursor-pointer"
      disabled={loading}
      multiple
      {...props}
    />
  );
};

export default ImageUploader;
