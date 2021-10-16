import AWS from 'aws-sdk';
import _ from 'ramda';
import { FileDetails, FileStorageBackend } from './types';


const upload =
    (s3, bucketName) =>
        async (fileDetails: FileDetails): Promise<any> => {
            let fileResp: any = null;
            const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
            const params = {
                Bucket: bucketName, //config.AWS_S3_BUCKET_NAME, // pass your bucket name
                Key: fileDetails.fileName, // _.isNil(config.AWS_S3_FOLDER_NAME) ? fileName : `${config.AWS_S3_FOLDER_NAME}/${fileName}`, // file will be saved as testBucket/contacts.csv
                Body: fileDetails.fileContent,
                ACL: 'public-read',
                ContentDisposition: `attachment; filename=${fileDetails.originalFilename}`,
            };

            await s3
                .upload(params, options)
                .promise()
                .then((res) => {
                    fileResp = res;
                });
            console.log(fileResp);
            return fileResp;
        };

export default function S3FileBackend(config): FileStorageBackend {
    if (
        _.isNil(config.AWS_ACCESS_KEY_ID) ||
        _.isNil(config.AWS_SECRET_ACCESS_KEY) ||
        _.isNil(config.AWS_S3_BUCKET_NAME)
    ) {
        throw new Error(
            'INVALID_AWS_CONFIGURATION while configuring STORAGE BACKEND',
        );
    }

    const s3 = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    });
    return {
        uploadFile: upload(s3, config.AWS_S3_BUCKET_NAME),
    };
}
