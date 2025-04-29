const fs = require('fs');

function convertImageToBase64(imagePath) {
    try {
        const image = fs.readFileSync(imagePath);
        const base64Image = image.toString("base64");
        return base64Image;
    } catch (error) {
        console.error(`Error converting image to base64: ${error}`);
        return null;
    }
}

// ส่งค่า Base64 ไปยังไฟล์ที่ต้องการใช้
module.exports = convertImageToBase64;
