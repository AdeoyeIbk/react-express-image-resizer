import { useRef } from 'react';

type FileDropAreaProps = {
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function FileDropArea({ imageFile, setImageFile }: FileDropAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  
  const handleClick = () => {
    if (inputRef.current) {
      // console.log(inputRef.current);
      inputRef.current?.click();
      console.log(inputRef.current?.files);
    }
  }

      
    const handleChange = () => {
      if (inputRef.current) {
        setImageFile(inputRef.current?.files?.[0] ?? null);
      }
    
    };

    return (
      <div
        className="flex flex-col items-center mb-4 gap-2 border border-dashed justify-center p-4 hover:cursor-pointer h-56 w-full bg-gray-50"
        onClick={handleClick}
        style={{ position: 'relative' }}
      >
        {!imageFile && <span className="text-gray-500">Click or drag to upload image</span>}
        {/* Image preview */}
        {
          imageFile && (
            <div className="mt-2 rounded flex flex-col items-center justify-center max-h-40 max-w-full gap-2">
              <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="rounded shadow max-h-40 max-w-full object-contain"
              />
              <span className="text-gray-500">{imageFile?.name}</span>
            </div>
          )
        }

        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </div>
    )
  }