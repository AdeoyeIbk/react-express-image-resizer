import FileDropArea from "./FileDropArea";
import { useState } from "react";
import axios from "axios"

export default function ImageResizer() {
  const [dimension, setDimension] = useState<{ width: number; height: number; widthUnit: string; heightUnit: string }>({ width: 0, height: 0, widthUnit: 'px', heightUnit: 'px' });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);
  const [downloadExt, setDownloadExt] = useState<string>('');
  const [downloadName, setDownloadName] = useState<string>('');

  function handleDimensionChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setDimension({
      ...dimension,
      [name]: name.endsWith('Unit') ? value : Number(value)
    });
  }

  const canUpload = !!imageFile && !!dimension.width && !!dimension.height;


    async function handleUpload() {
    if (!imageFile || !dimension.width || !dimension.height) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("width", `${dimension.width}${dimension.widthUnit}`);
    formData.append("height", `${dimension.height}${dimension.heightUnit}`);

    try {
      const response = await axios.post("https://react-express-image-resizer.onrender.com/resize", formData, {
        responseType: "blob", // tells axios we expect a binary file
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Get extension from uploaded file
      const ext = imageFile.name.split('.').pop() || '';
      setDownloadExt(ext);

     const headerFilename =
        (response.headers && (response.headers["x-resized-filename"] as string)) || null;
      const filename = headerFilename || `resized-image.${ext}`;
      setDownloadName(filename);

      // reset dimensions if you want (optional)
      setDimension({ width: 0, height: 0, widthUnit: "px", heightUnit: "px" });
      // Create a local URL from the blob
      const url = URL.createObjectURL(response.data);
      setResizedImageUrl(url);
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  }




  return (
    <div className="w-1/2 p-12 shadow-lg mx-auto flex flex-col gap-4 justify-between h-3/5 align-items-center">
      <div className="flex justify-center gap-8">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Width</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="width"
              placeholder="Width"
              className="p-2 border rounded w-24"
              min={1}
              max={9999}
              value={dimension.width}
              onChange={handleDimensionChange}
            />
            <select
              name="widthUnit"
              className="p-2 border rounded w-20"
              value={dimension.widthUnit}
              onChange={handleDimensionChange}
            >
              <option value="px">px</option>
              <option value="in">in</option>
              <option value="cm">cm</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Height</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="height"
              placeholder="Height"
              className="p-2 border rounded w-24"
              min={1}
              max={9999}
              value={dimension.height}
              onChange={handleDimensionChange}
            />
            <select
              name="heightUnit"
              className="p-2 border rounded w-20"
              value={dimension.heightUnit}
              onChange={handleDimensionChange}
            >
              <option value="px">px</option>
              <option value="in">in</option>
              <option value="cm">cm</option>
            </select>
          </div>
        </div>
      </div>
  {/* <img src={defaultImage} alt="" className="" /> */}
      <FileDropArea imageFile={imageFile} setImageFile={setImageFile} />
      

      <button
        className={`bg-blue-900 text-white py-2 px-4 rounded mb-4 w-full ${
          canUpload ? "hover:bg-blue-700 hover:cursor-pointer" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!canUpload}
        onClick={handleUpload}
      >
        Upload Image
      </button>
      {resizedImageUrl && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <img src={resizedImageUrl} alt="Resized Preview" className="max-h-40 object-contain rounded shadow" />
          <a
            href={resizedImageUrl}
          download={downloadName || `resized-image.${downloadExt}`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Resized Image
          </a>
        </div>
      )}
    </div>
  );
}
