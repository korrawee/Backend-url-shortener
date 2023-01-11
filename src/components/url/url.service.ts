import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isURL } from 'class-validator';
import { CreateUrlDto } from './dtos/create.dto';
import * as base62 from 'base62';
import { Model } from 'mongoose';
import { Url } from './schemas/url.schema';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UrlService {
  constructor(@InjectModel('url') private readonly urlModel: Model<Url>) {}
  counter = 1;
  async createUrl(originalUrl: string): Promise<string> {
    // Check if originalUrl is a valid one
    if (!isURL(originalUrl)) {
      throw new BadRequestException('String Must be a Valid URL');
    }

    // Declare URL code and baseUrl
    const urlCode: string = base62.encode(this.counter);
    const baseUrl = 'http://shorturl';

    try {
      // If the given URL is already shorted then return shorted URL
      const url = await this.urlModel.findOne({ originalUrl });
      if (url) {
        return baseUrl + url.urlCode;
      }

      // Shorten URL then save it to database
      const shortedUrl = `${baseUrl}/${urlCode}`;

      const urlDto: CreateUrlDto = {
        urlCode: urlCode,
        originalUrl: originalUrl,
      };

      const newUrl = new this.urlModel(urlDto);
      await newUrl.save();

      return shortedUrl;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Error from server.');
    }
  }

  async findUrl(urlCode: string): Promise<Url> {
    try {
      const url = await this.urlModel.findOne({ urlCode }).exec();
      if (url) {
        return url;
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException('URL Not Found.');
    }
  }
}
