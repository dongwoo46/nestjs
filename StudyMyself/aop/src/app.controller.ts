import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { AppService } from './app.service';
const archiver = require('archiver');
import * as path from 'path';
import * as unzipper from 'unzipper';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async test() {
    return 'test';
  }
}
