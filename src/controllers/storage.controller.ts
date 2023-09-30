const processUploadedFile = require('../middlewares/processFile.middleware');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { File } from '../entity/File';
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'storage-keys.json' });
const bucket = storage.bucket('cloud_backupsys');

// TODO: @lowpriority - refactor this to use a storage service
const upload = async (req, res) => {
  try {
    await processUploadedFile(req, res);
    const newFile = new File();
    // const user = await userService.findById(req.userData.userId);

    // if (!user) {
    //   throw new Error('User not found');
    // }

    if (!req.file) {
      throw new Error('Please upload a file!');
    }

    // Create a new blob in the bucket and upload the file data.
    // let uniquename = `${req.file.fieldname}-${uuid.v4()}-${
    //   req.file.originalname
    // }`;

    // creating a directory for each user
    // TODO: create a type to access req.userData et al

    // const userRootDir = `${req.userData.fullName
    //   .replace(/\s/g, '')
    //   .toLowerCase()}${req.userData.userId}`;

    // const blob = bucket.file(`${userRootDir}/${req.file.originalname}`);
    const blob = bucket.file(`hng5/${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      throw new Error(err);
    });

    // eslint-disable-next-line no-unused-vars
    blobStream.on('finish', async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      // newFile.fileName = `${userRootDir}/${req.file.originalname}`;
      newFile.fileName = `${req.file.originalname}`;
      newFile.path = publicUrl;
      // newFile.user = user;

      const fileRepository = AppDataSource.getRepository(File);
      // const historyService = new HistoryService();

      await fileRepository.save(newFile);
      // await historyService.createHistory(
      //   user,
      //   `${userRootDir}/${req.file.originalname}`,
      //   'CREATE'
      // );

      try {
        // Make the file public
        await bucket.file(req.file.originalname).makePublic();
      } catch (err) {
        console.log(err);

        return res.status(200).json({
          status: 'success',
          message: `Uploaded the file successfully: ${req.file.originalname}`,
          data: {
            url: publicUrl,
            name: req.file.originalname,
            mimetype: req.file.mimetype,
            size: `${(req.file.size / 1048576).toFixed(3)}MB`,
            createdAt: new Date(),
          },
        });
      }
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File cannot be larger than 200MB',
        data: null,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: `Could not upload the file - ${err.message}`,
      data: null,
    });
  }
};

const download = async (req: any, res: any) => {
  try {
    const fileName = req.params.fileName;
    const folderName = req.params.folderName;
    const userRootDir = `${req.userData.fullName
      .replace(/\s/g, '')
      .toLowerCase()}${req.userData.userId}`;

    const filePath = folderName
      ? `${userRootDir}/${folderName}/${fileName}`
      : `${userRootDir}/${fileName}`;

    const [metaData] = await bucket.file(filePath).getMetadata();

    res.redirect(metaData.mediaLink);
    return {
      status: 'success',
      message: 'File downloaded successfully, navigate to the link below',
      data: metaData.mediaLink,
    };
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Could not download the file. ' + err,
      data: null,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const fileRepository = AppDataSource.getRepository(File);
    const { fileName } = req.params;
    const userRootDir = `${req.userData.fullName
      .replace(/\s/g, '')
      .toLowerCase()}${req.userData.userId}`;
    const file = await fileRepository.findOne({
      where: { fileName: `${userRootDir}/${fileName}` },
    });
    console.log(file);
    // const userRootDir = `${req.userData.fullName
    //   .replace(/\s/g, '')
    //   .toLowerCase()}${req.userData.userId}`;

    if (!file) {
      throw new Error('File not found!');
    }

    await bucket.file(`${file.fileName}`).delete();
    await fileRepository.delete(file.id);

    return res.status(200).json({
      status: 'success',
      message: 'File deleted successfully!',
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: `Could not delete the file - ${error}`,
      data: null,
    });
  }
};

const listFiles = async (req, res) => {
  try {
    const rootDir = `hng5/`;

    const options = {
      prefix: rootDir,
    };

    // only list files in the user's root directory
    const [files] = await bucket.getFiles(options);
    const fileList = files.map((file) => {
      return {
        fileName: file.name,
        fileSize: file.size,
        fileOwner: file.metadata.owner,
        fileCreated: file.metadata.timeCreated,
      };
    });

    return res.status(200).json({
      status: 'success',
      message: 'Files retrieved successfully!',
      data: fileList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: `Could not retrieve files - ${error}`,
      data: null,
    });
  }
};

const compressFile = async (req: any, res) => {
  try {
    await processUploadedFile(req, res);
    const destination = `../compressed/${req.file.originalname}.gz`;
    let fileBuffer = req.file.buffer;
    await zlib.gzip(fileBuffer, (err, response) => {
      if (err) {
        console.log(err);
      }
      fs.writeFile(path.join(__dirname, destination), response, (err, data) => {
        if (err) {
          console.log(err);
        }
        res.download(path.join(__dirname, destination));
      });
    });
  } catch (err) {
    console.log(err);
    res.json(err);
    return res.status(500).json({
      status: 'error',
      message: `Could not compress the file - ${err}`,
      data: null,
    });
  }
};

export { upload, download, deleteFile, listFiles, compressFile };
