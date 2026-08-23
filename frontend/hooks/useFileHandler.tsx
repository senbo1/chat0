import { useState, useCallback } from 'react';

export function useFileHandler() {
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [fileList, setFileList] = useState<FileList | undefined>(undefined);
  const [contentTypes, setContentTypes] = useState<string[]>([]);

  const processFiles = useCallback((files: FileList) => {
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    const types = Array.from(files).map((file) => file.type);

    setFileUrls(urls);
    setFileList(files);
    setContentTypes(types);
    console.log("type" , types , fileUrls , fileList);
    
  }, []);

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    event.preventDefault();

    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
    if (
      items[i].type.startsWith('image') ||
      items[i].type === 'application/pdf' ||
      items[i].type === 'text/plain'
    ) {
        const file = items[i].getAsFile();
        if (file) {
          const dt = new DataTransfer();
          dt.items.add(file);
          processFiles(dt.files);
          break;
        }
      }
    }

    // Optional: handle pasted text if needed
    const text = event.clipboardData.getData('text/plain');
    if (text) {
      document.execCommand('insertText', false, text);
    }
  }, [processFiles]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);


  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault(); 
  }, []);

  const clearFiles = useCallback(() =>{
    setFileList(undefined);
    setFileUrls([]);
    setContentTypes([]) 
  } , [])

  return {
    fileUrls,
    fileList,
    contentTypes,
    handlePaste,
    handleFileChange,
    handleDragOver,
    handleDrop,
    clearFiles
  };
}
