import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';


export type AllowedRoles = keyof typeof UserRole | 'Any';


// 함수로 따로 뺴기
export const Role = (roles: AllowedRoles[]) => SetMetadata("roles", roles);