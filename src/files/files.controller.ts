import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    ) {};

  @Post('product')
  @UseInterceptors( FileInterceptor('file', { fileFilter, storage: diskStorage({destination: "./static/products", filename: fileNamer}) }) )
  uploadProduceImage( @UploadedFile() file: Express.Multer.File) {

    if ( !file ) throw new BadRequestException("Please select a file to upload or check the file extension");

    const secureUrl = `${this.configService.get("HOST_API")}/files/product/${file.filename}`;
    
    return {
      secureUrl
    };
  };

  @Get("product/:imageName")
  findOneImage(@Res() res: Response, @Param("imageName") imageName: string) {

    const path = this.filesService.getStaticProductImage(imageName);

    return res.sendFile(path)
  };
};
