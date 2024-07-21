import Tesseract from 'tesseract.js';

const OCRImages = async (urls, options, lang= "eng") => {
  options.onStart && options.onStart({ current: 0, total: urls.length });
  const progress = { total: urls.length, current: 0 };

  const promises = urls.map(
    async url =>
      await Tesseract.recognize(url, lang).then(({ data: { text } }) => {
        progress.current += 1;
        options.onProgress && options.onProgress(progress);
        return text;
      })
  );

  const texts = await Promise.all(promises);

  return texts.reduce((acc, text, index) => {
    return { ...acc, [index + 1]: text };
  }, {});
};

export default OCRImages;
