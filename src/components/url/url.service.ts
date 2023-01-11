import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isURL } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateUrlDto } from './dtos/create.dto';
import { Url } from './entity/url.entity';
import * as base62 from 'base62';
@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private readonly urlRepository: Repository<Url>,
  ) {}
  counter = 1;
  async createUrl(originalUrl: string): Promise<string> {
    // Check if originalUrl is a valid one
    if (!isURL(originalUrl)) {
      throw new BadRequestException('String Must be a Valid URL');
    }

    // Declare URL code and baseUrl
    const urlCode: string = base62.encode(this.counter);
    const baseUrl = 'http://shorturl/';

    try {
      // If the given URL is already shorted then return shorted URL
      const url = await this.urlRepository.findOneBy({ originalUrl });
      if (url) {
        return baseUrl + url.urlCode;
      }

      // Shorten URL then save it to database
      const shortedUrl = `${baseUrl}/${urlCode}`;

      const urlDto: CreateUrlDto = {
        urlCode: urlCode,
        originalUrl: originalUrl,
      };

      const newUrl = this.urlRepository.create(urlDto);
      await this.urlRepository.save(newUrl);

      return shortedUrl;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Error from server.');
    }
  }

  async findUrl(urlCode: string): Promise<Url> {
    try {
      const url = await this.urlRepository.findOneBy({ urlCode });
      if (url) {
        return url;
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException('URL Not Found.');
    }
  }
}
