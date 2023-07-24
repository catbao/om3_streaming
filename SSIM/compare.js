const ssim = require("ssim.js");
 
const img1 = loadImage("./picture/1b_zoom_init.png");
const img2 = loadImage("./picture/initial_data.png");
 
const { mssim, performance } = ssim(img1, img2);
 
console.log(`SSIM: ${mssim} (${performance}ms)`);

// ssim(
//     './picture/1b_zoom_init.png',
//     './picture/initial_data.png'
//   ).then(({mssim}) => console.log(`SSIM: ${mssim}`));