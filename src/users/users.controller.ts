import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamsDto } from './dtos/get-users-params.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-user.dto';

/**
 * Controller to handle user routes
 */

@Controller('users')
@ApiTags('users')
export class UsersController {
  /**
   * Constructor to inject UsersService
   * @param usersService - UsersService instance
   */
  constructor(private readonly usersService: UsersService) {}
  /**
   * Method to get all users
   * @param getUsersParamsDto - DTO to get users
   * @param limit - Number of users to get
   * @param page - Page number
   * @returns List of users
   */
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'the number of entries per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'the page number',
    example: 1,
  })
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'The users have been fetched successfully',
  })
  @Get('/{:id}')
  public getUsers(
    @Param() getUsersParamsDto: GetUsersParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.getUsers(getUsersParamsDto, limit, page);
  }
  /**
   * Method to create a user
   * @param createUserDto
   * @returns Created user
   */
  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('/many')
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.usersService.createManyUsers(createManyUsersDto);
  }

  /**
   * Method to patch a user
   * @param patchUserDto
   * @returns Patched user
   */
  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
  @Get('single-user/:id')
  public getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }
}
