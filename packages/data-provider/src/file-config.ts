/* eslint-disable max-len */
import { z } from 'zod';
import { EModelEndpoint } from './schemas';
import type { FileConfig, EndpointFileConfig } from './types/files';

export const supportsFiles = {
  [EModelEndpoint.openAI]: true,
  [EModelEndpoint.google]: true,
  [EModelEndpoint.assistant]: true,
  [EModelEndpoint.azureOpenAI]: true,
  [EModelEndpoint.custom]: true,
};

export const excelFileTypes = [
  'application/vnd.ms-excel',
  'application/msexcel',
  'application/x-msexcel',
  'application/x-ms-excel',
  'application/x-excel',
  'application/x-dos_ms_excel',
  'application/xls',
  'application/x-xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const fullMimeTypesList = [
  'text/x-c',
  'text/x-c++',
  'application/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/html',
  'text/x-java',
  'application/json',
  'text/markdown',
  'application/pdf',
  'text/x-php',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/x-python',
  'text/x-script.python',
  'text/x-ruby',
  'text/x-tex',
  'text/plain',
  'text/css',
  'image/jpeg',
  'text/javascript',
  'image/gif',
  'image/png',
  'application/x-tar',
  'application/typescript',
  'application/xml',
  'application/zip',
  ...excelFileTypes,
];

export const codeInterpreterMimeTypesList = [
  'text/x-c',
  'text/x-c++',
  'application/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/html',
  'text/x-java',
  'application/json',
  'text/markdown',
  'application/pdf',
  'text/x-php',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/x-python',
  'text/x-script.python',
  'text/x-ruby',
  'text/x-tex',
  'text/plain',
  'text/css',
  'image/jpeg',
  'text/javascript',
  'image/gif',
  'image/png',
  'application/x-tar',
  'application/typescript',
  'application/xml',
  'application/zip',
  ...excelFileTypes,
];

export const retrievalMimeTypesList = [
  'text/x-c',
  'text/x-c++',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/html',
  'text/x-java',
  'application/json',
  'text/markdown',
  'application/pdf',
  'text/x-php',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/x-python',
  'text/x-script.python',
  'text/x-ruby',
  'text/x-tex',
  'text/plain',
];

export const imageExtRegex = /\.(jpg|jpeg|png|gif|webp)$/i;

export const excelMimeTypes =
  /^application\/(vnd\.ms-excel|msexcel|x-msexcel|x-ms-excel|x-excel|x-dos_ms_excel|xls|x-xls|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/;

export const textMimeTypes =
  /^(text\/(x-c|x-c\+\+|x-java|html|markdown|x-php|x-python|x-script\.python|x-ruby|x-tex|plain|css|javascript|csv))$/;

export const applicationMimeTypes =
  /^(application\/(csv|json|pdf|x-tar|typescript|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation|spreadsheetml\.sheet)|xml|zip))$/;

export const imageMimeTypes = /^image\/(jpeg|gif|png|webp)$/;

export const supportedMimeTypes = [
  textMimeTypes,
  excelMimeTypes,
  applicationMimeTypes,
  imageMimeTypes,
];

export const codeInterpreterMimeTypes = [
  textMimeTypes,
  excelMimeTypes,
  applicationMimeTypes,
  imageMimeTypes,
];

export const retrievalMimeTypes = [
  /^(text\/(x-c|x-c\+\+|html|x-java|markdown|x-php|x-python|x-script\.python|x-ruby|x-tex|plain))$/,
  /^(application\/(json|pdf|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation)))$/,
];

export const megabyte = 1024 * 1024;
/** Helper function to get megabytes value */
export const mbToBytes = (mb: number): number => mb * megabyte;

export const fileConfig = {
  endpoints: {
    [EModelEndpoint.assistant]: {
      fileLimit: 10,
      fileMaxSizeMB: 512,
      totalMaxSizeMB: 512,
      fileSizeLimit: mbToBytes(512),
      totalSizeLimit: mbToBytes(512),
      supportedMimeTypes,
    },
    default: {
      fileLimit: 10,
      fileMaxSizeMB: 20,
      totalMaxSizeMB: 25,
      fileSizeLimit: mbToBytes(20),
      totalSizeLimit: mbToBytes(25),
      supportedMimeTypes: [imageMimeTypes],
    },
  },
  serverFileSizeLimit: mbToBytes(512),
  avatarSizeLimit: mbToBytes(2),
  checkType: function (fileType: string, supportedTypes: RegExp[] = supportedMimeTypes) {
    return supportedTypes.some((regex) => regex.test(fileType));
  },
};

export const endpointFileConfigSchema = z.object({
  fileLimit: z.number().min(1).optional(),
  fileMaxSizeMB: z.number().min(1).optional(),
  totalMaxSizeMB: z.number().min(1).optional(),
  fileSizeLimit: z.number().min(1).optional(),
  totalSizeLimit: z.number().min(1).optional(),
  supportedMimeTypes: z.array(z.any()).optional(),
});

export const fileConfigSchema = z.object({
  endpoints: z.record(endpointFileConfigSchema).optional(),
  serverFileSizeLimit: z.number().min(1).optional(),
  avatarSizeLimit: z.number().min(1).optional(),
});

/** Helper function to safely convert string patterns to RegExp objects */
export const convertStringsToRegex = (patterns: string[]): RegExp[] =>
  patterns.reduce((acc: RegExp[], pattern) => {
    try {
      const regex = new RegExp(pattern);
      acc.push(regex);
    } catch (error) {
      console.error(`Invalid regex pattern "${pattern}" skipped.`);
    }
    return acc;
  }, []);

export function mergeFileConfig(dynamic: z.infer<typeof fileConfigSchema>): FileConfig {
  const mergedConfig: FileConfig = JSON.parse(JSON.stringify(fileConfig));

  if (dynamic.serverFileSizeLimit !== undefined) {
    mergedConfig.serverFileSizeLimit = mbToBytes(dynamic.serverFileSizeLimit);
  }

  if (dynamic.avatarSizeLimit !== undefined) {
    mergedConfig.avatarSizeLimit = mbToBytes(dynamic.avatarSizeLimit);
  }

  if (!dynamic.endpoints) {
    return mergedConfig;
  }

  Object.keys(dynamic.endpoints).forEach((key) => {
    const dynamicEndpoint = (dynamic.endpoints as Record<string, EndpointFileConfig>)[key];

    if (!mergedConfig.endpoints[key]) {
      mergedConfig.endpoints[key] = {};
    }

    const mergedEndpoint = mergedConfig.endpoints[key];

    if (dynamicEndpoint.fileSizeLimit !== undefined) {
      mergedEndpoint.fileSizeLimit = mbToBytes(dynamicEndpoint.fileSizeLimit);
    }

    if (dynamicEndpoint.totalSizeLimit !== undefined) {
      mergedEndpoint.totalSizeLimit = mbToBytes(dynamicEndpoint.totalSizeLimit);
    }

    const configKeys = ['fileLimit', 'fileMaxSizeMB', 'totalMaxSizeMB'] as const;
    configKeys.forEach((field) => {
      if (dynamicEndpoint[field] !== undefined) {
        mergedEndpoint[field] = dynamicEndpoint[field];
      }
    });

    if (dynamicEndpoint.supportedMimeTypes) {
      mergedEndpoint.supportedMimeTypes = convertStringsToRegex(
        dynamicEndpoint.supportedMimeTypes as unknown as string[],
      );
    }
  });

  return mergedConfig;
}
