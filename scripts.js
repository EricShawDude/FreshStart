const fs = require('fs');

function takepicture() {
  var width = document.getElementById('vid').offsetWidth;
  var height = document.getElementById('vid').offsetHeight;
  console.log(width);
  console.log(height);
  canvas = document.getElementById('canvas')
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(vid, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");
    console.log(data);

    writeImage(data, "C:/Github/ScammerJammerTest/Hackashaw/images")
  } 
}

function writeImage(dataUrl, filePath) {
  try {
      // Extract the base64 data part from the data URL
      const base64Data = dataUrl.split(',')[1];

      // Decode the base64 data into a buffer
      const buffer = Buffer.from(base64Data, 'base64');

      // Write the buffer to the specified file path
      fs.writeFileSync(filePath, buffer);

      console.log('Image saved successfully to', filePath);
  } catch (error) {
      console.error('Error saving image:', error);
  }
}