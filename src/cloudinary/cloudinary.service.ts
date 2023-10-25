import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File, folder: string = '/images'): Promise<UploadApiResponse | UploadApiErrorResponse | any> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream({
                folder: `${folder}`
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });

            toStream(file.buffer).pipe(upload);
        });
    }

    async deleteFile(public_id:string): Promise<UploadApiResponse | UploadApiErrorResponse | any> {
        return await v2.uploader.destroy(public_id);
    }
}