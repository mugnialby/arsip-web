import { UploadCloud } from "lucide-react";
import { useState, useRef } from "react";

export function UploadDropzone({ handleFileUpload }) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    return (
        <div className="w-full">
            <div
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
                    backdrop-blur-xl shadow-sm
                    ${isDragging ? "border-blue-500 bg-blue-50/70" : "border-gray-300 bg-white/80"}
                `}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.length) {
                        handleFileUpload({ target: { files: e.dataTransfer.files } });
                    }
                }}
                onClick={() => inputRef.current?.click()}
            >
                <UploadCloud size={40} className="mx-auto text-gray-500 mb-2" />
                <p className="font-medium text-gray-800">Drag & drop berkas</p>
                <p className="text-sm text-gray-500">
                    atau <span className="text-blue-600 underline">cari</span> untuk upload
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    File yang dapat diupload: JPG, PNG, JPEG, PDF
                </p>
            </div>

            <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
            />
        </div>
    );
}
