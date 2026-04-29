import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTenantDto } from './dto/tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async create(@Body() dto: CreateTenantDto) {
    return this.tenantService.createTenant(dto.name, dto.subdomain);
  }

  @Get()
  async findAll() {
    return this.tenantService.getAllTenants();
  }
}
