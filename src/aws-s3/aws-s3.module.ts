import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';

@Module({
  controllers: [],
  providers: [AwsS3Service],
})
export class AwsS3Module {}
