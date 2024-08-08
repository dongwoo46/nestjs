import { Injectable } from '@nestjs/common';
import { CreateAeDto } from './dto/create-ae.dto';
import { UpdateAeDto } from './dto/update-ae.dto';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as zlib from 'zlib';

@Injectable()
export class AesService {
  private readonly algorithm = 'aes-256-cbc';

  private generateKey(key: string): Buffer {
    return crypto.createHash('sha256').update(key).digest();
  }

  private generateIv(iv: string): Buffer {
    return crypto.createHash('md5').update(iv).digest();
  }

  encryptObjectToFile(
    obj: any,
    key: string,
    iv: string,
    outputFilePath: string,
  ): void {
    const jsonString = JSON.stringify(obj);
    const keyBuffer = this.generateKey(key);
    const ivBuffer = this.generateIv(iv);

    const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, ivBuffer);
    const encrypted = Buffer.concat([
      cipher.update(jsonString, 'utf8'),
      cipher.final(),
    ]);

    fs.writeFileSync(outputFilePath, encrypted);
  }

  decryptFileToObject(filePath: string, key: string, iv: string): any {
    const keyBuffer = this.generateKey(key);
    const ivBuffer = this.generateIv(iv);
    const encryptedData = fs.readFileSync(filePath);

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      keyBuffer,
      ivBuffer,
    );
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    const jsonString = decrypted.toString('utf8');
    return JSON.parse(jsonString);
  }

  async encryptString(content: string, key: string, iv: string) {
    const keyBuffer = this.generateKey(key);
    const ivBuffer = this.generateIv(iv);

    const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, ivBuffer);

    const encrypted = Buffer.concat([
      cipher.update(content, 'utf8'),
      cipher.final(),
    ]);

    return encrypted;
  }

  async makeEncryptedZipFile(content: string, key: string, iv: string) {
    try {
      const filePath =
        'C:\\Users\\dw\\Desktop\\nestjs\\all_nestjs\\nestjs\\src\\aes\\encrypted_file';

      const zipBuffer = await this.compressString(content);
      console.log('zipbuffer', zipBuffer);

      const unzipBuffer = await this.decompressString(zipBuffer);
      console.log(unzipBuffer);

      await this.bufferToEncrptedfile(zipBuffer, key, iv);

      const decryptedBuffer = await this.decryptedFilepath(filePath, key, iv);
      console.log('decryptedBuffer', decryptedBuffer);

      const unzipedString = await this.decompressString(decryptedBuffer);

      console.log('unzipedString', unzipedString);
    } catch (err) {
      console.log(err);
    }
  }

  // 압축된 버퍼 암호화해서 파일로 만들기
  async bufferToEncrptedfile(buffer: Buffer, key: string, iv: string) {
    const filePath =
      'C:\\Users\\dw\\Desktop\\nestjs\\all_nestjs\\nestjs\\src\\aes\\encrypted_file';

    const keyBuffer = this.generateKey(key);
    const ivBuffer = this.generateIv(iv);

    const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, ivBuffer);

    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    await fs.writeFileSync(filePath, encrypted);
  }

  async compressString(content: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      zlib.gzip(content, (err, buffer) => {
        if (err) {
          return reject(err);
        }
        resolve(buffer);
      });
    });
  }

  async decompressString(input: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      zlib.gunzip(input, (err, buffer) => {
        if (err) {
          return reject(err);
        }
        resolve(buffer.toString('utf8'));
      });
    });
  }

  // 파일경로로 파일 읽어서 복호화하기
  async decryptedFilepath(filepath: string, key: string, iv: string) {
    const buffer = await fs.readFileSync(filepath);

    const keyBuffer = this.generateKey(key);
    const ivBuffer = this.generateIv(iv);

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      keyBuffer,
      ivBuffer,
    );
    const decrypted = Buffer.concat([
      decipher.update(buffer),
      decipher.final(),
    ]);

    console.log(decrypted);
    return decrypted;
  }
}
