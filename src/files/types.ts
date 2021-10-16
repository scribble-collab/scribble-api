export interface FileDetails {
    fileId: string;
    originalFilename: string;
    fileName: string;
    mimetype: string;
    fileContent: any;
}

export interface FileUploadResponse {
    fileId: string;
    filePath: string | null;
}

export interface FileStorageBackend {
    uploadFile(fileDetails: FileDetails): Promise<any>;
}
