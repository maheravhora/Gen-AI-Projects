import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCloudArrowUp, HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2';

export default function DragDropUpload({ onFileSelect, accept = 'image/*', label = 'Upload Image' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      setFileName(file.name);
      onFileSelect(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleClear = () => {
    setPreview(null);
    setFileName('');
    if (inputRef.current) inputRef.current.value = '';
    onFileSelect(null);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl border border-white/8 bg-[#1E293B]/60 overflow-hidden"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-72 object-contain bg-black/20"
            />
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
              <div className="flex items-center gap-2 min-w-0">
                <HiOutlinePhoto className="h-4 w-4 text-[#94A3B8] flex-shrink-0" />
                <span className="text-sm text-[#F8FAFC] truncate">{fileName}</span>
              </div>
              <button
                onClick={handleClear}
                type="button"
                className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-[#94A3B8] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors cursor-pointer border-none"
              >
                <HiOutlineXMark className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all ${
              isDragging
                ? 'border-[#2563EB] bg-[#2563EB]/5'
                : 'border-white/15 bg-[#1E293B]/30 hover:border-white/25 hover:bg-[#1E293B]/50'
            }`}
          >
            <motion.div
              animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB]/10"
            >
              <HiOutlineCloudArrowUp className={`h-8 w-8 ${isDragging ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`} />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#F8FAFC]">{label}</p>
              <p className="text-xs text-[#94A3B8] mt-1">
                Drag & drop or click to browse
              </p>
              <p className="text-[10px] text-[#94A3B8] mt-2">
                Supported: PNG, JPG, JPEG, WebP
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
