// pages/index.js
import { useState, useEffect } from 'react';
import pdfToImages from '@/lib/pdfToImages';
import OCRImages from '@/lib/OCRImages';


export default function Home() {
const [progress, setProgress] = useState()
const [results, setResults] = useState()

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file?.type !== 'application/pdf') {
      toast({ status: 'error', title: 'Invalid file type' });
      return;
    }
    const pdfUrl = URL.createObjectURL(file);
    const imageUrls = await pdfToImages(pdfUrl, {
      scale: 2,
      onStart: progress => setProgress({ ...progress, total: progress.total * 2, type: 'Processing' }),
      onProgress: progress => setProgress({ ...progress, total: progress.total * 2, type: 'Processing' }),
    });
    const recognisedImages = await OCRImages(imageUrls, {
      onStart: progress =>
        setProgress({ current: progress.total + progress.current, total: progress.total * 2, type: 'Recognising' }),
      onProgress: progress =>
        setProgress({ current: progress.total + progress.current, total: progress.total * 2, type: 'Recognising' }),
    });
    setResults(recognisedImages);
  };

  return (
    <div>
      <h1>Upload PDF and Get Data</h1>
      <input type="file" accept="application/pdf" onChange={(e) => handleFileSelect(e)} />
      {progress?.type && <h1>{progress.type}</h1>}
      
      {results && Object.keys(results).length ? (
         <p>{Object.values(results)}</p>
      ) : null}
     
    </div>
  );
}
