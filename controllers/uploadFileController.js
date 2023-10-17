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

exports.uploadFile = cacthAsync(async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime();

    const uid = uuidv4(); // Tạo một chuỗi ngẫu nhiên

    const originalName = req.file.originalname.split('.')[0]; // Lấy tên gốc của tệp

    const fileExtension = req.file.originalname.split('.')[1]; // Lấy phần mở rộng của tệp

    const newFileName = `${originalName}-${uid}.${fileExtension}`; // Tạo tên mới cho tệp

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + ' ' + dateTime}`,
    );

    // Tạo siêu dữ liệu tệp bao gồm kiểu nội dung
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Tải tệp lên lưu trữ
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata,
    );

    // Lấy đường dẫn công khai
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('Upload file successfully.');
    return res.send({
      message: 'Upload file successfully',
      name: newFileName,
      type: req.file.mimetype,
      downloadURL: downloadURL,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
};
