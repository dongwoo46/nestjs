import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('create-dummy-files')
  createDummyFiles(): string {
    this.fileService.createDummyFiles();
    return 'Dummy files created';
  }

  //http이용해 파일 다운로드하기 (크롬에서 해당 url에 접속하면 됨)
  @Get('download/:filename')
  downloadFile2(@Param('filename') filename: string, @Res() res: Response) {
    const filepath = path.join(
      'C:\\Users\\dw\\Desktop\\Nest.js\\StudyMyself\\load\\src\\file\\dummyFile',
      filename,
    );
    const fileShowName = `download-${filename}.txt`;

    // 파일 존재 여부 확인
    if (!fs.existsSync(filepath)) {
      if (!res.headersSent) {
        return res.status(404).send('파일을 찾을 수 없습니다.');
      }
    }

    res.download(filepath, fileShowName, (err) => {
      if (err) {
        console.error('Error during file download:', err);
        if (!res.headersSent) {
          res.status(500).send('File download failed');
        }
      }
    });

    // 요청 중단 처리
    res.on('close', () => {
      if (!res.headersSent) {
        console.log('Client aborted the request.');
      }
    });
  }

  // 스트림을 이용해 파일 다운받기
  @Get('download-stream/:filename')
  async downloadFileWithStream(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const now = Date.now();
    const url = `http://localhost:3000/file/download/${filename}`; // 다운로드할 파일의 URL
    const dest = path.join(
      'C:\\Users\\dw\\Desktop\\Nest.js\\StudyMyself\\load\\src\\file\\downloadFile',
      `downloaded-stream-${filename}-${now}`,
    ); // 서버에 저장될 파일의 경로
    await this.fileService.downloadFileWithStream(url, dest); // 파일을 스트리밍하여 서버에 다운로드
    if (fs.existsSync(dest)) {
      res.download(dest); // 다운로드된 파일을 클라이언트에게 전송
    } else {
      res.status(404).send('File not found');
    }
  }

  //curl이용해서 파일 다운로드하기
  @Post()
  async download(@Body('url') url: string, @Body('dest') dest: string) {
    await this.fileService.downloadFileCurl(url, dest);
    return { message: 'File downloaded successfully' };
  }

  @Post('download-chunked')
  async downloadFileChunkedWithCluster(
    @Body('url') url: string,
    @Body('filename') filename: string,
  ) {
    const numChunks = 4; // 원하는 청크 수
    await this.fileService.downloadFileChunkedWithCluster(
      url,
      filename,
      numChunks,
    );
    return { message: 'File downloaded successfully' };
  }
}
