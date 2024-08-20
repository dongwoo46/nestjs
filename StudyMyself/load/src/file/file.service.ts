import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

@Injectable()
export class FileService {
  private readonly fileDir =
    'C:\\Users\\dw\\Desktop\\Nest.js\\StudyMyself\\load\\src\\file\\dummyFile';
  private readonly downloadDir =
    'C:\\Users\\dw\\Desktop\\Nest.js\\StudyMyself\\load\\src\\file\\downloadFile';

  // 스트림 파일 만들기
  createFileWithSize(fileName: string, sizeInMB: number): void {
    try {
      const filePath = path.join(this.fileDir, fileName);
      const buffer = Buffer.alloc(1024 * 1024 * sizeInMB, '0');
      fs.writeFileSync(filePath, buffer);
      console.log(
        `File ${fileName} created with size ${sizeInMB}MB at ${filePath}`,
      );
    } catch (error) {
      console.error('Error creating file with size:', error);
      throw new Error('Failed to create file with specified size');
    }
  }

  // http로 파일 다운로드하기
  downloadFile(url: string, destFileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const dest = path.join(this.downloadDir, destFileName);
      const file = fs.createWriteStream(dest);
      http
        .get(url, (response) => {
          response.pipe(file);

          file.on('finish', () => {
            file.close();
            console.log(`File downloaded and saved to ${dest}`);
            resolve();
          });
        })
        .on('error', (err) => {
          fs.unlink(dest, () => reject(err));
        });
    });
  }

  //stream을 이용해 chunk 사이즈로 파일 다운로드하기
  downloadFileWithStream(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      const request = http
        .get(url, (response) => {
          const totalSize = parseInt(
            response.headers['content-length'] || '0',
            10,
          );
          let downloadedSize = 0;

          response.on('data', (chunk) => {
            downloadedSize += chunk.length;
            file.write(chunk);
            console.log(
              `Downloading: ${((downloadedSize / totalSize) * 100).toFixed(2)}%`,
            );
          });

          response.on('end', () => {
            file.end();
            resolve();
          });
        })
        .on('error', (err) => {
          fs.unlink(dest, () => reject(err));
        });

      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });

      request.end();
    });
  }

  // 클러스터링을 이용한 스트림 다운로드
  async downloadFileChunkedWithCluster(
    url: string,
    filename: string,
    numChunks: number,
  ): Promise<void> {
    const dest = path.join(this.downloadDir, filename);

    // 파일의 총 크기 가져오기
    const totalSize = await this.getFileSize(url);
    const chunkSize = Math.ceil(totalSize / numChunks);

    // 각 워커가 맡을 청크 다운로드
    const downloadChunk = (chunkIndex: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize - 1, totalSize - 1);
        const options = {
          headers: {
            Range: `bytes=${start}-${end}`,
          },
        };

        const file = fs.createWriteStream(dest, {
          flags: chunkIndex === 0 ? 'w' : 'a',
        });
        http
          .get(url, options, (response) => {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log(
                `Chunk ${chunkIndex + 1} downloaded (${start}-${end})`,
              );
              resolve();
            });
          })
          .on('error', (err) => {
            fs.unlink(dest, () => reject(err));
          });
      });
    };

    const chunkPromises = Array.from({ length: numChunks }, (_, i) =>
      downloadChunk(i),
    );
    await Promise.all(chunkPromises);
    console.log(`File downloaded and saved to ${dest}`);
  }

  // 파일 크기 가져오기
  private getFileSize(url: string): Promise<number> {
    return new Promise((resolve, reject) => {
      http
        .get(url, (response) => {
          const totalSize = parseInt(
            response.headers['content-length'] || '0',
            10,
          );
          resolve(totalSize);
        })
        .on('error', reject);
    });
  }

  //curl이용해서 파일 다운로드
  async downloadFileCurl(url: string, dest: string): Promise<void> {
    const command = `curl -o ${dest} ${url}`;
    await execPromise(command);
  }

  getFilePath(filename: string): string {
    return path.join(this.fileDir, filename);
  }
  createDummyFiles(): void {
    this.createFileWithSize('300mb', 300);
    this.createFileWithSize('500mb', 500);
    this.createFileWithSize('700mb', 700);
    this.createFileWithSize('1000mb', 1000);
  }
}
