import { Expose } from "class-transformer"
import UserTypeOrmEntity, { UserRole } from "../../entities/user.entity"

export class UserResponse implements Pick<UserTypeOrmEntity, 'id' | 'firstName' | 'lastName' | 'userName' | 'email' | 'phone' | 'avatar' | 'role' | 'isActivated' | 'createdAt' | 'updatedAt'> {
    @Expose()
    public id: number;
    
    @Expose()
    public firstName: string;
    
    @Expose()
    public lastName: string;
    
    @Expose()
    public userName: string;
    
    @Expose()
    public email: string;
    
    @Expose()
    public phone: string;
    
    @Expose()
    public avatar: string;
    
    @Expose()
    public role: UserRole;
    
    @Expose()
    public isActivated: boolean;
    
    @Expose()
    public createdAt: Date;
    
    @Expose()
    public updatedAt: Date;
}