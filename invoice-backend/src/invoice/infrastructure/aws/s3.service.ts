import {
    Injectable,
    Logger
} from '@nestjs/common';
import {
    ConfigService
} from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
    private readonly logger = new Logger(AwsS3Service.name);
    private readonly s3Client: S3Client | null;
    private readonly bucket: string;

    constructor(private readonly configService: ConfigService) {
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';

        this.bucket = this.configService.get<string>('AWS_S3_BUCKET') || '';

        if (accessKeyId && secretAccessKey) {
            this.s3Client = new S3Client({
                region,
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });
            this.logger.log('☁️ AWS S3 Client initialized');
        } else {
            this.s3Client = null;
            this.logger.warn('☁️ AWS S3 Client not configured - missing credentials');
        }
    }

    async uploadFile(
        key: string,
        body: Buffer,
        contentType: string,
    ): Promise<string | null> {
        if (!this.s3Client || !this.bucket) {
            this.logger.error('S3 client not configured');
            return null;
        }

        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
            });

            await this.s3Client.send(command);

            return `https://${this.bucket}.s3.amazonaws.com/${key}`;
        } catch (error) {
            this.logger.error(`Failed to upload file to S3: ${error}`);
            return null;
        }
    }

    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
        if (!this.s3Client || !this.bucket) {
            return null;
        }

        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });

            return await getSignedUrl(this.s3Client, command, { expiresIn });
        } catch (error) {
            this.logger.error(`Failed to generate signed URL: ${error}`);
            return null;
        }
    }

    async deleteFile(key: string): Promise<boolean> {
        if (!this.s3Client || !this.bucket) {
            return false;
        }

        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });

            await this.s3Client.send(command);
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete file from S3: ${error}`);
            return false;
        }
    }
}
