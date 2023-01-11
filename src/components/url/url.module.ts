import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlSchema } from './schemas/url.schema';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'url', schema: UrlSchema }])],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
