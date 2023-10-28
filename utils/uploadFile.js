const { initializeApp } = require('firebase/app');
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require('firebase/storage');
const config = require('../config/firebase.config.js');
const { v4: uuidv4 } = require('uuid');
const cacthAsync = require('../utils/catchAsync');

// Khởi tạo ứng dụng Firebase
initializeApp(config.firebaseConfig);

// Khởi tạo Cloud Storage và lấy tham chiếu đến dịch vụ
const storage = getStorage();

exports.uploadFile = async (image) => {
  try {
    const uploadedImageUrls = [];
    for (const imgName of image) {
      const dateTime = giveCurrentDateTime();
      const uid = uuidv4(); // Tạo một chuỗi ngẫu nhiên
      const originalName = imgName.originalname.split('.')[0]; // Lấy tên gốc của tệp
      const fileExtension = imgName.originalname.split('.')[1]; // Lấy phần mở rộng của tệp
      const newFileName = `${originalName}-${uid}.${fileExtension}`; // Tạo tên mới cho tệp
      const storageRef = ref(storage, `files/${newFileName + ' ' + dateTime}`); // Tạo tham chiếu đến tệp
      const metadata = {
        contentType: imgName.mimetype,
      };

      // Tải tệp lên lưu trữ
      const snapshot = await uploadBytesResumable(
        storageRef,
        imgName.buffer,
        metadata,
      );

      const downloadURL = await getDownloadURL(snapshot.ref);
      uploadedImageUrls.push(downloadURL);
    }
    return uploadedImageUrls;
  } catch (error) {
    console.log(error);
  }
};

function giveCurrentDateTime() {
  const date = new Date();
  const dateTime = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  return dateTime;
}
