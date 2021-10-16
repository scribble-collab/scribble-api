import fs from 'fs';
import path from 'path';
import { FileDetails, FileStorageBackend } from './types';


const upload = async (fileDetails: FileDetails) => {
    const filepath = path.join('user-media', fileDetails.fileName);
    const fileStream = fs.createWriteStream(filepath);

    return new Promise((resolve, reject) => {
        fileDetails.fileContent.on('error', function (err) {
            reject(err);
        });

        fileDetails.fileContent.pipe(fileStream);

        fileDetails.fileContent.on('end', function (err) {
            resolve(fileDetails);
        });
    });
};

export default function localFileStorageBackend(config): FileStorageBackend {
    return {
        uploadFile: upload,
    };
}
