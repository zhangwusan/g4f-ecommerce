import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export class EncodedService {
    private readonly base_path: string;
    private readonly path_folder: string;

    constructor(path_folder?: string) {
        // Use default folder if none provided
        this.path_folder = path_folder || 'uploads';
        this.base_path = join(process.cwd(), this.path_folder);

        if (!existsSync(this.base_path)) {
            mkdirSync(this.base_path, { recursive: true });
        }
    }

    base64ToImage(base64Str: string): Buffer {
        const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            base64Str = matches[2];
        }
        return Buffer.from(base64Str, 'base64');
    }

    saveBase64Image(base64Str: string, originalFilename?: string): string {
        const imageBuffer = this.base64ToImage(base64Str);

        let ext = '.png';
        if (originalFilename) {
            const match = originalFilename.match(/\.(png|jpg|jpeg|gif|webp)$/i);
            if (match) {
                ext = match[0];
            }
        } else {
            const match = base64Str.match(/^data:image\/(png|jpg|jpeg|gif|webp);base64,/i);
            if (match) {
                ext = `.${match[1].toLowerCase()}`;
            }
        }

        const filename = `${uuidv4()}${ext}`;
        const filePath = join(this.base_path, filename);

        writeFileSync(filePath, imageBuffer);

        // Return relative URL path (for example: /public/uploads/filename.png)
        return `/${this.path_folder}/${filename}`;
    }

    isBase64Image(base64Str: string): boolean {
        if (typeof base64Str !== 'string') return false;

        const regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+\s*$/;

        if (!regex.test(base64Str)) return false;

        const base64Data = base64Str.split(',')[1];

        try {
            const buffer = Buffer.from(base64Data, 'base64');
            return buffer.length > 0;
        } catch {
            return false;
        }
    }

    imageToBase64(filePath: string): string {
        const fullPath = join(process.cwd(), filePath);
        const fileBuffer = readFileSync(fullPath);
        const ext = extname(filePath).toLowerCase().replace('.', '');
        const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    }
    imageBufferToBase64(buffer: Buffer, originalFilename?: string): string {
        let ext = 'png';

        if (originalFilename) {
            const match = originalFilename.match(/\.(png|jpg|jpeg|gif|webp)$/i);
            if (match) {
                ext = match[1].toLowerCase();
            }
        }

        const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        return `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    // General method: accept either path or Buffer
    async imageToBase64Universal(
        input: string | Buffer,
        originalFilename?: string
    ): Promise<string> {
        if (typeof input === 'string') {
            return this.imageToBase64(input);
        } else if (Buffer.isBuffer(input)) {
            return this.imageBufferToBase64(input, originalFilename);
        } else {
            throw new Error('Unsupported input type: must be file path or Buffer.');
        }
    }

    fileOrBufferToBase64(input: string | Buffer, originalFilename?: string): string {
        let fileBuffer: Buffer;
        let ext: string;

        if (typeof input === 'string') {
            const fullPath = join(process.cwd(), input);
            fileBuffer = readFileSync(fullPath);
            ext = extname(input).toLowerCase().replace('.', '');
        } else if (Buffer.isBuffer(input)) {
            fileBuffer = input;
            ext = originalFilename ? extname(originalFilename).toLowerCase().replace('.', '') : 'bin';
        } else {
            throw new Error('Input must be a file path or a Buffer');
        }

        const mimeMap: Record<string, string> = {
            pdf: 'application/pdf',
            txt: 'text/plain',
            csv: 'text/csv',
            json: 'application/json',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            webp: 'image/webp',
            bin: 'application/octet-stream',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            xls: 'application/vnd.ms-excel'
        };

        const mimeType = mimeMap[ext] || 'application/octet-stream';
        return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    }

    async fileToBase64Universal(input: string | Buffer, originalFilename?: string): Promise<string> {
        if (typeof input === 'string') {
            return this.fileOrBufferToBase64(input);
        } else if (Buffer.isBuffer(input)) {
            const ext = originalFilename ? extname(originalFilename).replace('.', '') : 'bin';
            const mimeType = this.getMimeType(ext);
            return `data:${mimeType};base64,${input.toString('base64')}`;
        } else {
            throw new Error('Unsupported input type: must be file path or Buffer.');
        }
    }

    private getMimeType(ext: string): string {
        const mimeMap: Record<string, string> = {
            pdf: 'application/pdf',
            txt: 'text/plain',
            csv: 'text/csv',
            json: 'application/json',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            webp: 'image/webp',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            xls: 'application/vnd.ms-excel'
        };
        return mimeMap[ext.toLowerCase()] || 'application/octet-stream';
    }
}