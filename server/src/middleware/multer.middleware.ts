import multer, { memoryStorage } from "multer";

const storage = memoryStorage();
const uploadMiddleWare = multer({
  storage: storage,
});

export const uploadLicense = () => {
  return uploadMiddleWare.single("org_license");
};
