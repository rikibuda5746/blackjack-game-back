import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminUsersService } from '../services/admin-users.service';
import { GetUsersQueryDto } from '../dto/queries/get-users.query.dto';
import { PaginationResponseDto } from '@src/shared/dtos/pagination.response.dto';
import { Roles } from '@src/common/decorators/roles.decorator';
import { RoleEnum } from '@src/common/enums/role.enum';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { AdminUserResponseDto } from '../dto/responses/admin-user.response.dto';

@ApiTags('admin/users')
@Controller('admin/users')
@UseGuards(RolesGuard)
@Roles(RoleEnum.ADMIN)
export class AdminUsersController {
  constructor(private AdminUsersService: AdminUsersService) {}

  @Get('')
  async getUsers(@Query() query: GetUsersQueryDto): Promise<PaginationResponseDto<AdminUserResponseDto>> {
    return this.AdminUsersService.getUsers(query);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<AdminUserResponseDto> {
    return this.AdminUsersService.getById(id);
  }
}
