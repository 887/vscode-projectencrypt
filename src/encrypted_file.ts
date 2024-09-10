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
            this.isValidDate(line5) &&
            line6 === '-----'
        );
    }

    /**
     * Writes the header with the specified format.
     * @param version - The semver version.
     * @param encryptionKeyId - The encryption key ID.
     * @param date - The date in YYYY-MM-DD format.
     * @param content - The content to append after the header.
     * @returns The content with the header prepended.
     */
    public static writeHeader(version: string, encryptionKeyId: string, date: string, content: string): string {
        const header = `-----\n${this.HEADER_IDENTIFIER}\n${version}\n${encryptionKeyId}\n${date}\n-----\n`;
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
}

// Example usage:
const version = '1.0.0';
const encryptionKeyId = 'key123';
const date = '2023-10-01';
const content = 'This is the encrypted content.';

const encryptedContent = EncryptedFile.writeHeader(version, encryptionKeyId, date, content);
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