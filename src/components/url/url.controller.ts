import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreateUrlDto } from './dtos/create.dto';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':urlId')
  async redirect(@Res() res, @Param('urlId') urlId: string) {
    const url = await this.urlService.redirect(urlId);
    return res.redirect(url.originalUrl);
  }

  @Post('shorten-url')
  createUrl(@Body() body: CreateUrlDto) {
    return this.urlService.createUrl(body.originalUrl);
  }
}
