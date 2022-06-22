import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';


//type AllowedRoles = keyof typeof UserRole | 'Any';


// 함수로 따로 뺴기
export const Role = (roles:string[]) => SetMetadata("roles", roles);