import { FileDetails, FileStorageBackend } from '../../src/files/types';


const upload = async (fileDetails: FileDetails) => {
    console.log('Uploaded file', fileDetails.fileName);
    return fileDetails.fileId;
};

export default function FakeFileStorageBackend(): FileStorageBackend {
    return {
        uploadFile: upload,
    };
}
