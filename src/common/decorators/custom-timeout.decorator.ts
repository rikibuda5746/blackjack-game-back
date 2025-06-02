import { SetMetadata } from '@nestjs/common';
import { TIMEOUT_KEY } from '@src/core/interceptors/timeout.interceptor';

export const CustomTimeout = (ms: number) => SetMetadata(TIMEOUT_KEY, ms);
