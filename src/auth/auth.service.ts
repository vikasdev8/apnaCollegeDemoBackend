import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string; user: Partial<User> }> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = await this.usersService.create(createUserDto);
    
    // Return user without password
    const userObj = (user as any).toObject ? (user as any).toObject() : user;
    const { password, ...userResult } = userObj;
    
    return {
      message: 'User registered successfully',
      user: userResult,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await this.usersService.validatePassword(password, user.password)) {
      const userObj = (user as any).toObject ? (user as any).toObject() : user;
      const { password: userPassword, ...result } = userObj;
      return result;
    }
    
    return null;
  }

  async login(user: any): Promise<{ message: string; user: any }> {
    // Update last login
    await this.usersService.updateLastLogin(user._id);
    
    return {
      message: 'Login successful',
      user,
    };
  }
}