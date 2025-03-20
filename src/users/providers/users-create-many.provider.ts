import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-user.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /**
     * Inject Datasource
     */
    private readonly dataSource: DataSource,
  ) {}
  public async createManyUsers(createUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    //create Query Runner
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      //Connect Query Runner to DataSource
      await queryRunner.connect();
      //start transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new InternalServerErrorException(
        `Internal error occured, try again later ${error}`,
      );
    }

    try {
      for (const user of createUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);

        newUsers.push(result);
      }

      //if successful, commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      //if unsuccessful, rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException(`could not complete process`, {
        description: String(error),
      });
    } finally {
      //release the connection
      await queryRunner.release();
    }
    return newUsers;
  }
}
