import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isURL } from 'class-validator';
import { CreateUrlDto } from './dtos/create.dto';
import { Model } from 'mongoose';
import { Url } from './schemas/url.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(@InjectModel('url') private readonly urlModel: Model<Url>, private readonly configService : ConfigService) {}
  async createUrl(originalUrl: string): Promise<string> {
    // Check if originalUrl is a valid one
    if (!isURL(originalUrl)) {
      throw new BadRequestException('String Must be a Valid URL');
    }

    // Declare URL code and baseUrl

    const saltOrRounds = await bcrypt.genSalt();
    const urlCode: string = await bcrypt.hash(originalUrl, saltOrRounds).then((str: string)=>(str.substring(0,9)));
    const baseUrl = `http://${this.configService.get<string>('APP_HOST')}`;

    try {
      // If the given URL is already shorted then return shorted URL
      const url = await this.urlModel.findOne({ originalUrl });
      if (url) {
        return `${baseUrl}/${url.urlCode}`;
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
