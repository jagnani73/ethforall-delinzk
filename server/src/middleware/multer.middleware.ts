import multer, { memoryStorage } from "multer";

const storage = memoryStorage();
const uploadMiddleWare = multer({
  storage: storage,
});

export const parseLicense = () => {
  return uploadMiddleWare.single("org_license");
};

export const parseUserPhoto = () => {
  return uploadMiddleWare.single("employee_photo");
};
