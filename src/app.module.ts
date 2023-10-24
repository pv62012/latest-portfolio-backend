import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    envFilePath: ['.development.env', '.production.env'],
    // envFilePath: '.production.env',
  }), MongooseModule.forRoot(process.env.MONGO_URI), AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
