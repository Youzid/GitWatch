#!/bin/bash
# generators/lib/generate-repository.sh

generate_repository_file() {
  cat > $BASE_PATH/repositories/$MODULE_LOWER.repository.ts << EOF
import { Injectable } from '@nestjs/common';
import { Create${MODULE_PASCAL}Dto } from '../dtos/create-${MODULE_LOWER}.dto';
import { Update${MODULE_PASCAL}Dto } from '../dtos/update-${MODULE_LOWER}.dto';

@Injectable()
export class ${MODULE_PASCAL}Repository {
  // Inject your database connection/ORM here
  
  async create(create${MODULE_PASCAL}Dto: Create${MODULE_PASCAL}Dto) {
    // Database create logic
    return { id: '1', ...create${MODULE_PASCAL}Dto };
  }

  async findAll() {
    // Database findAll logic
    return [];
  }

  async findOne(id: string) {
    // Database findOne logic
    return { id };
  }

  async update(id: string, update${MODULE_PASCAL}Dto: Update${MODULE_PASCAL}Dto) {
    // Database update logic
    return { id, ...update${MODULE_PASCAL}Dto };
  }

  async remove(id: string) {
    // Database remove logic
    return { id, deleted: true };
  }
}
EOF
}