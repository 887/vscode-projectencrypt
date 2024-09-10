import * as CryptoJS from 'crypto-js';

class EncryptedFile {
    private static HEADER_IDENTIFIER = 'PROJECT_ENCRYPT';

    /**
     * Checks if the content starts with the specified header format.
     * @param content - The content to check.
     * @returns True if the content starts with the specified header format, false otherwise.
     */
    public static checkHeader(content: string): boolean {
        const lines = content.split('\n');
        if (lines.length < 7) {return false;}

        const [line1, line2, line3, line4, line5, line6, line7] = lines;

        return (
            line1 === '-----' &&
            line2 === this.HEADER_IDENTIFIER &&
            this.isValidSemver(line3) &&
            this.isValidEncryptionKeyId(line4) &&
            this.isValidCipher(line5) &&
            this.isValidDate(line6) &&
            line7 === '-----'
        );
    }

    /**
     * Writes the header with the specified format.
     * @param params - An object containing the header parameters.
     * @param params.version - The semver version.
     * @param params.encryptionKeyId - The encryption key ID.
     * @param params.cipher - The cipher used for encryption.
     * @param params.date - The date in YYYY-MM-DD format.
     * @param params.content - The content to append after the header.
     * @returns The content with the header prepended.
     */
    public static writeHeader(params: HeaderParams): string {
        const header = [
            '-----',
            this.HEADER_IDENTIFIER,
            params.version,
            params.encryptionKeyId,
            params.cipher,
            params.date,
            '-----'
        ].join('\n');
        return header + '\n' + content;
    }

    private static isValidSemver(version: string): boolean {
        const semverPattern = /^\d+\.\d+\.\d+$/;
        return semverPattern.test(version);
    }

    private static isValidEncryptionKeyId(encryptionKeyId: string): boolean {
        // Add your own validation logic for encryption key ID if needed
        return encryptionKeyId.length > 0;
    }

    private static isValidDate(date: string): boolean {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        return datePattern.test(date);
    }

    private static isValidCipher(cipher: string): boolean {
        switch (cipher) {
            case 'aes-256-cbc':
            case 'aes-128-cbc':
                return true;
            default:
                return false;
        }
    }
}

class HeaderParams {
    version: string;
    encryptionKeyId: string;
    cipher: string;
    date: string;
    content: string;

    constructor(version: string, encryptionKeyId: string, cipher: string, date: string, content: string) {
        this.version = version;
        this.encryptionKeyId = encryptionKeyId;
        this.cipher = cipher;
        this.date = date;
        this.content = content;
    }
}

// Example usage:
const version = '1.0.0';
const encryptionKeyId = 'key123';
const cipher = 'aes-256-cbc';
const date = '2023-10-01';
const content = 'This is the encrypted content.';

const headerParams = new HeaderParams(version, encryptionKeyId, cipher, date, content);
const encryptedContent = EncryptedFile.writeHeader(headerParams);
console.log(encryptedContent);
/*
Expected output:
-----
PROJECT_ENCRYPT
1.0.0
key123
2023-10-01
-----

This is the encrypted content.
*/

const isValidHeader = EncryptedFile.checkHeader(encryptedContent);
console.log(isValidHeader); // Should print true