#!/bin/bash
# generators/lib/generate-service.sh

generate_service_file() {
  cat > $BASE_PATH/services/$MODULE_LOWER.service.ts << EOF
import { Injectable } from '@nestjs/common';
import { ${MODULE_PASCAL}Repository } from '../repositories/${MODULE_LOWER}.repository';
import { Create${MODULE_PASCAL}Dto } from '../dtos/create-${MODULE_LOWER}.dto';
import { Update${MODULE_PASCAL}Dto } from '../dtos/update-${MODULE_LOWER}.dto';

@Injectable()
export class ${MODULE_PASCAL}Service {
  constructor(private readonly ${MODULE_LOWER}Repository: ${MODULE_PASCAL}Repository) {}

  async create(create${MODULE_PASCAL}Dto: Create${MODULE_PASCAL}Dto) {
    // Business logic here
    return this.${MODULE_LOWER}Repository.create(create${MODULE_PASCAL}Dto);
  }

  async findAll() {
    return this.${MODULE_LOWER}Repository.findAll();
  }

  async findOne(id: string) {
    return this.${MODULE_LOWER}Repository.findOne(id);
  }

  async update(id: string, update${MODULE_PASCAL}Dto: Update${MODULE_PASCAL}Dto) {
    return this.${MODULE_LOWER}Repository.update(id, update${MODULE_PASCAL}Dto);
  }

  async remove(id: string) {
    return this.${MODULE_LOWER}Repository.remove(id);
  }
}
EOF
}