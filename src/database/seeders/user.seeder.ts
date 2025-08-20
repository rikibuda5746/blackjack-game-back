// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { UserEntity } from '../../modules/users/entities/user.entity';

// @Injectable()
// export class UserSeeder {
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepository: Repository<UserEntity>,
//   ) {}

//   async run() {
//     const hashedPassword = await bcrypt.hash('admin123!', 10);

//     const user = this.userRepository.create({
//       email: 'admin@example.com',
//       name: 'Admin',
//       password: hashedPassword,
//     });

//     await this.userRepository.save(user);
//   }
// }
