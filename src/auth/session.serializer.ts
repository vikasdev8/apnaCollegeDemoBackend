import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, { id: user._id, email: user.email, role: user.role });
  }

  async deserializeUser(
    payload: { id: string; email: string; role: string },
    done: (err: Error, payload: any) => void,
  ): Promise<any> {
    try {
      const user = await this.usersService.findOne(payload.id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}