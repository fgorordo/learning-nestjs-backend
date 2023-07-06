import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compareHash, generateSalt, hashData } from './helpers/generate-password.helper';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor (

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  
  ) {}

  async create(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto;

      const salt = generateSalt();
      const user = this.userRepository.create({
        ...userData,
        password: hashData(password, salt)
      });

      await this.userRepository.save(user);

      delete user.password;

      //TODO: Return access token (JWT);
      return {
        ...user,
        token: this.getJwtToken({email: user.email})
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  };

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({where: {email}, select: { email: true, password: true }});

    if (!user) 
      throw new UnauthorizedException("Invalid credentials (email).")

    if (!compareHash(password, user.password)) 
      throw new UnauthorizedException("Invalid credentials.")

    //TODO: Return access token (JWT)
    return {
      ...user,
      token: this.getJwtToken({email: user.email}),
    };
  } 

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505") throw new BadRequestException(error.detail)
    console.log(error);
    throw new InternalServerErrorException("Please check server logs");
  }

}
