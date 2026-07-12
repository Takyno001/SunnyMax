const { Jimp } = require('jimp');

Jimp.read('public/sunnymax.png')
  .then((image) => {
    // Scan only the central region to avoid screenshot borders
    const marginX = 200;
    const marginY = 150;
    const scanMinX = marginX;
    const scanMaxX = image.bitmap.width - marginX;
    const scanMinY = marginY;
    const scanMaxY = image.bitmap.height - marginY;

    let minX = image.bitmap.width;
    let minY = image.bitmap.height;
    let maxX = 0;
    let maxY = 0;

    // Scan within the bounding box
    for (let x = scanMinX; x < scanMaxX; x++) {
      for (let y = scanMinY; y < scanMaxY; y++) {
        const idx = (image.bitmap.width * y + x) * 4;
        const r = image.bitmap.data[idx];
        const g = image.bitmap.data[idx + 1];
        const b = image.bitmap.data[idx + 2];
        
        // Find white/gray logo pixels
        if (r > 30 || g > 30 || b > 30) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX >= minX && maxY >= minY) {
      // Add padding
      const padding = 20;
      const cropX = Math.max(0, minX - padding);
      const cropY = Math.max(0, minY - padding);
      const cropW = Math.min(image.bitmap.width - cropX, (maxX - minX) + 2 * padding);
      const cropH = Math.min(image.bitmap.height - cropY, (maxY - minY) + 2 * padding);

      console.log(`Auto-cropping center logo: x=${cropX}, y=${cropY}, w=${cropW}, h=${cropH}`);
      image.crop({ x: cropX, y: cropY, w: cropW, h: cropH })
           .write('public/sunnymax.png')
           .then(() => {
             console.log('Successfully cropped logo and saved to public/sunnymax.png!');
           });
    } else {
      console.log('No logo text found in center region.');
    }
  })
  .catch((err) => {
    console.error('Error reading/processing image:', err);
  });
