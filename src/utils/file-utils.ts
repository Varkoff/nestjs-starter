/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { FastifyRequest } from 'fastify/types/request';
import { v4 as uuidv4 } from 'uuid';
const LEGAL_STORAGE_BUCKET = process.env.LEGAL_STORAGE_BUCKET;
if (!LEGAL_STORAGE_BUCKET) {
  throw new Error(`Storage is missing required configuration.`);
}
export const getFileFromRequest = ({
  req,
  keyName = 'file',
  legalDocumentDirectoryId,
}: {
  legalDocumentDirectoryId: string;
  req: FastifyRequest;
  keyName?: string;
}) => {
  if (!req?.isMultipart()) {
    throw new Error('La requête ne contient pas de fichier.');
  }
  // @ts-ignore
  const hasFile = Boolean(req.body[keyName][0].filename);
  // ? Nous récupérons les informations du déclassement au format formData, ainsi qu'une image.

  if (!hasFile) {
    throw new Error('Vous devez fournir un fichier.');
  }
  const requestBody = req.body;
  // @ts-ignore
  const file = req.body[keyName][0] as fastifyMultipart.MultipartFile;

  if (!file) {
    throw new Error('Vous devez fournir un fichier.');
  }

  const { filename, mimetype, data } = file;
  const [filenameWithoutExtension, fileExtension] = filename.split('.');

  const allowedFormats = ['jpg', 'jpeg', 'png', 'heif', 'webp', 'pdf'];
  const fileBuffer = data;
  // Only allow image files
  if (!allowedFormats.includes(fileExtension)) {
    throw new Error('Seuls les images ou les fichiers PDF sont autorisés.');
  }
  const fileKey = generateFilekey({
    fileExtension,
    filenameWithoutExtension,
    legalDocumentDirectoryId,
  });
  const awsPutCommand = generateAwsPutCommand({
    fileKey: fileKey,
    fileBuffer: fileBuffer,
    mimetype: mimetype,
  });

  return {
    fileBuffer,
    awsPutCommand,
    file,
    fileKey,
    mimetype,
    filenameWithoutExtension,
    requestBody,
  };
};

export const generateFilekey = ({
  legalDocumentDirectoryId,
  filenameWithoutExtension,
  fileExtension,
}: {
  fileExtension: string;
  filenameWithoutExtension: string;
  legalDocumentDirectoryId: string;
}) => {
  return `${legalDocumentDirectoryId}/${filenameWithoutExtension}-${uuidv4()}.${fileExtension}`;
};

export const generateAwsPutCommand = ({
  fileKey,
  fileBuffer,
  mimetype,
}: {
  fileKey: string;
  fileBuffer: Buffer;
  mimetype: string;
}) => {
  const awsPutCommand = new PutObjectCommand({
    Bucket: `${LEGAL_STORAGE_BUCKET}`,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: mimetype,
  });
  return awsPutCommand;
};
