#!/bin/bash
# generators/lib/generate-dtos.sh

generate_dtos_files() {
  cat > $BASE_PATH/dtos/create-$MODULE_LOWER.dto.ts << EOF
export class Create${MODULE_PASCAL}Dto {
  // Add your properties here
  name: string;
}
EOF

  cat > $BASE_PATH/dtos/update-$MODULE_LOWER.dto.ts << EOF
import { PartialType } from '@nestjs/mapped-types';
import { Create${MODULE_PASCAL}Dto } from './create-${MODULE_LOWER}.dto';

export class Update${MODULE_PASCAL}Dto extends PartialType(Create${MODULE_PASCAL}Dto) {}
EOF
}