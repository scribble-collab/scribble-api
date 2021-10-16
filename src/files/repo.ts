import { right } from 'fp-ts/lib/Either';
import db from '../db';
import { FileDetails } from './types';

const fileTableName = 'files';

export async function saveFile(fileDetails: FileDetails) {
    const row = await db(fileTableName)
        .insert({
            id: fileDetails.fileId,
            name: fileDetails.fileName,
            fileType: fileDetails.mimetype,
            isUsed: false,
            metadata: {
                originalFilename: fileDetails.originalFilename,
            },
        })
        .returning('id');

    return right(row[0]);
}
