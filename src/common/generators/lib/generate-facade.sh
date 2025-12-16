#!/bin/bash
# generators/lib/generate-facade.sh

generate_facade_file() {
  cat > $BASE_PATH/facades/$MODULE_LOWER.facade.ts << EOF
import { Injectable } from '@nestjs/common';
import { ${MODULE_PASCAL}Service } from '../services/${MODULE_LOWER}.service';
import { Create${MODULE_PASCAL}Dto } from '../dtos/create-${MODULE_LOWER}.dto';
import { Update${MODULE_PASCAL}Dto } from '../dtos/update-${MODULE_LOWER}.dto';

@Injectable()
export class ${MODULE_PASCAL}Facade {
  constructor(private readonly ${MODULE_LOWER}Service: ${MODULE_PASCAL}Service) {}

  async create(create${MODULE_PASCAL}Dto: Create${MODULE_PASCAL}Dto) {
    return this.${MODULE_LOWER}Service.create(create${MODULE_PASCAL}Dto);
  }

  async findAll() {
    return this.${MODULE_LOWER}Service.findAll();
  }

  async findOne(id: string) {
    return this.${MODULE_LOWER}Service.findOne(id);
  }

  async update(id: string, update${MODULE_PASCAL}Dto: Update${MODULE_PASCAL}Dto) {
    return this.${MODULE_LOWER}Service.update(id, update${MODULE_PASCAL}Dto);
  }

  async remove(id: string) {
    return this.${MODULE_LOWER}Service.remove(id);
  }
}
EOF
}