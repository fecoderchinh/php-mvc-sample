import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule } from './global/clients/clients.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { ShopModule } from './global/shop/shop.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config';
import {JoiPipeModule} from "nestjs-joi";
import {APP_PIPE} from "@nestjs/core";
import {JoiPipe} from "@emzmono/common/pipes/joi.pipe";
import { LocationModule } from './modules/location/location.module';
import { ThemeModule } from './global/themes/theme.module';
import { PackageModule } from './global/packages/package.module';
import { AdminUsersModule } from './global/admin-users/admin-users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Mongoose default connection
    MongooseModule.forRootAsync({
      useFactory: async (cfs: ConfigService) => await cfs.get('database'),
      inject: [ConfigService],
    }),
    JoiPipeModule,
    // global modules
    AdminUsersModule,
    LocationModule,

    // Emz modules
    ClientsModule,
    ShopModule,
    ThemeModule,
    PackageModule,

  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    {
        provide: APP_PIPE,
        useClass: JoiPipe,
    },
  ],
  exports: [],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
