import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreateUrlDto } from './dtos/create.dto';
import { UrlService } from './url.service';

@Controller('shorturl')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':urlCode')
  async redirect(@Res() res, @Param('urlCode') urlCode: string) {
    const url = await this.urlService.findUrl(urlCode);
    return res.redirect(url.originalUrl);
  }

  @Post('')
  async createUrl(@Body() body: CreateUrlDto) {
    return await this.urlService.createUrl(body.originalUrl);
  }
}
