import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Headers,
} from '@nestjs/common';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { AppService } from './app.service';
const archiver = require('archiver');
import * as path from 'path';
import * as unzipper from 'unzipper';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async test() {
    return 'test';
  }

  @Get('hello')
  hello(
    @I18n() i18n: I18nContext,
    @Headers('accept-language') lang: string,
  ): string {
    console.log(`Requested Language: ${lang}`);
    return i18n.t('common.HELLO');
  }
}
