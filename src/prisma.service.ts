import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async batchQueries({
    array,
    prismaPromise,
  }: {
    array: unknown[];
    prismaPromise: any;
  }) {
    // Function to chunk the cities array
    const chunk = (array, size) => {
      const chunkedArr = [];
      let index = 0;
      while (index < array.length) {
        chunkedArr.push(array.slice(index, size + index));
        index += size;
      }
      return chunkedArr;
    };

    // Chunk the cities array into arrays of 20
    const arrayChunks = chunk(array, 20);

    for (const arrayChunk of arrayChunks) {
      await Promise.all(arrayChunk.map(prismaPromise));
    }
  }
}
