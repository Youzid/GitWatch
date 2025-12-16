#!/bin/bash
# generators/lib/generate-module.sh

generate_module_file() {
  cat > $BASE_PATH/$MODULE_LOWER.module.ts << EOF
import { Module } from '@nestjs/common';
import { ${MODULE_PASCAL}Controller } from './controllers/${MODULE_LOWER}.controller';
import { ${MODULE_PASCAL}Service } from './services/${MODULE_LOWER}.service';
import { ${MODULE_PASCAL}Facade } from './facades/${MODULE_LOWER}.facade';
import { ${MODULE_PASCAL}Repository } from './repositories/${MODULE_LOWER}.repository';

@Module({
  controllers: [${MODULE_PASCAL}Controller],
  providers: [${MODULE_PASCAL}Service, ${MODULE_PASCAL}Facade, ${MODULE_PASCAL}Repository],
  exports: [${MODULE_PASCAL}Facade],
})
export class ${MODULE_PASCAL}Module {}
EOF
}