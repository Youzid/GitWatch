#!/bin/bash
# generators/lib/generate-controller.sh

generate_controller_file() {
  cat > $BASE_PATH/controllers/$MODULE_LOWER.controller.ts << EOF
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ${MODULE_PASCAL}Facade } from '../facades/${MODULE_LOWER}.facade';
import { Create${MODULE_PASCAL}Dto } from '../dtos/create-${MODULE_LOWER}.dto';
import { Update${MODULE_PASCAL}Dto } from '../dtos/update-${MODULE_LOWER}.dto';

@Controller('${MODULE_LOWER}')
export class ${MODULE_PASCAL}Controller {
  constructor(private readonly ${MODULE_LOWER}Facade: ${MODULE_PASCAL}Facade) {}

  @Post()
  create(@Body() create${MODULE_PASCAL}Dto: Create${MODULE_PASCAL}Dto) {
    return this.${MODULE_LOWER}Facade.create(create${MODULE_PASCAL}Dto);
  }

  @Get()
  findAll() {
    return this.${MODULE_LOWER}Facade.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${MODULE_LOWER}Facade.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() update${MODULE_PASCAL}Dto: Update${MODULE_PASCAL}Dto) {
    return this.${MODULE_LOWER}Facade.update(id, update${MODULE_PASCAL}Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${MODULE_LOWER}Facade.remove(id);
  }
}
EOF
}