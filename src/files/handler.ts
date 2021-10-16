import { v4 as uuidv4 } from 'uuid';
import { fileUploadedEvent } from '../logEvents';
import getPath from './fullPath';
import * as fileRepo from './repo';
import { FileDetails, FileStorageBackend, FileUploadResponse } from './types';



export function getFileDetails(file): FileDetails {
    const originalFileName = file.hapi.filename;
    const fileExtension = originalFileName.split('.').pop();
    const fileId = uuidv4();
    const newFileName = fileId + '.' + fileExtension;
    return {
        fileId,
        originalFilename: originalFileName,
        fileName: newFileName,
        mimetype: file.hapi.headers['content-type'],
        fileContent: file,
    };
}

const uploadFile =
    (fileStorageBackend: FileStorageBackend) =>
        async (file): Promise<FileUploadResponse> => {
            const fileDetails = getFileDetails(file);
            await fileStorageBackend.uploadFile(fileDetails);
            await fileRepo.saveFile(fileDetails);
            fileUploadedEvent({
                fileId: fileDetails.fileId,
                mimetype: fileDetails.mimetype,
            });
            return {
                fileId: fileDetails.fileName,
                filePath: getPath(fileDetails?.fileName),
            };
        };

export default function fileHandler(
    env,
    fileStorageBackend: FileStorageBackend,
) {
    return {
        uploadFile: uploadFile(fileStorageBackend),
    };
}
