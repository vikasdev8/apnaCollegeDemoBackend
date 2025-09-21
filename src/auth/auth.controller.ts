import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Response,
  HttpStatus,
  Get
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Response() res) {
    const result = await this.authService.login(req.user);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Request() req, @Response() res) {
    req.logout((err) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
          message: 'Error logging out' 
        });
      }
      req.session.destroy(() => {
        return res.status(HttpStatus.OK).json({ 
          message: 'Logout successful' 
        });
      });
    });
  }

  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  getProfile(@Request() req) {
    return { user: req.user };
  }

  @Get('status')
  getStatus(@Request() req) {
    return { 
      isAuthenticated: req.isAuthenticated(),
      user: req.user || null 
    };
  }
}