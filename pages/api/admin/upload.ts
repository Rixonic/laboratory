import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config(process.env.CLOUDINARY_URL || '');

export const config = {
    api: {
        bodyParser: false,
    },
};

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single("file");

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

  const handleUpload = async (dataURI) => {
    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(dataURI);
        return {
            
            message: cloudinaryResponse.secure_url,
        };
    } catch (error) {
        throw new Error('Error uploading file to Cloudinary: ' + error.message);
    }
};

  const handler = async (req, res) => {
    try {
      await runMiddleware(req, res, myUploadMiddleware);
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      console.log(cldRes)
      res.json(cldRes);
    } catch (error) {
      console.log(error);
      res.send({
        message: error.message,
      });
    }
  };
  export default handler;