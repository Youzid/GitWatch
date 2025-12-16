#!/bin/bash
# generators/lib/utils.sh

init_names() {
  MODULE=$1
  MODULE_LOWER=$(echo "$MODULE" | tr '[:upper:]' '[:lower:]')
  MODULE_PASCAL=$(echo "$MODULE" | sed -r 's/(^|-)([a-z])/\U\2/g')
  BASE_PATH="src/modules/v1/$MODULE_LOWER"
  
  export MODULE
  export MODULE_LOWER
  export MODULE_PASCAL
  export BASE_PATH
}