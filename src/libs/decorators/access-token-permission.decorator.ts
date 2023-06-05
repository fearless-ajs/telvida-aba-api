import { SetMetadata } from '@nestjs/common';

export const AccessTokenPermission = (permission) => SetMetadata('tokenPermissionName', permission);
