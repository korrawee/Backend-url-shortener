import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './database/config/ormconfig';
import { UrlModule } from './components/url/url.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormConfig()),
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
