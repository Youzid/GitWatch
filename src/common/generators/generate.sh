#!/bin/bash
# generators/main.sh - Main orchestrator script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source all generator files
source "$SCRIPT_DIR/lib/utils.sh"
source "$SCRIPT_DIR/lib/generate-module.sh"
source "$SCRIPT_DIR/lib/generate-controller.sh"
source "$SCRIPT_DIR/lib/generate-service.sh"
source "$SCRIPT_DIR/lib/generate-facade.sh"
source "$SCRIPT_DIR/lib/generate-repository.sh"
source "$SCRIPT_DIR/lib/generate-dtos.sh"
source "$SCRIPT_DIR/lib/generate-events.sh"

# Help message
show_help() {
  cat << EOF
Usage: ./generate.sh [command] <module-name>

Commands:
  all           Generate complete module with all files (default)
  module        Generate only module file
  controller    Generate only controller
  service       Generate only service
  facade        Generate only facade
  repository    Generate only repository
  dtos          Generate only DTOs
  events        Generate only events
  help          Show this help message

Examples:
  ./generate.sh all user              # Generate everything
  ./generate.sh user                  # Same as above (default)
  ./generate.sh controller product    # Generate only controller
  ./generate.sh dtos order            # Generate only DTOs

EOF
}

# Parse arguments
COMMAND=$1
MODULE=$2

# If only one argument, assume it's the module name and use 'all' as command
if [ -z "$MODULE" ]; then
  MODULE=$COMMAND
  COMMAND="all"
fi

# Check if module name is provided
if [ -z "$MODULE" ]; then
  echo "Error: Module name is required"
  show_help
  exit 1
fi

# Show help
if [ "$COMMAND" == "help" ] || [ "$COMMAND" == "--help" ] || [ "$COMMAND" == "-h" ]; then
  show_help
  exit 0
fi

# Initialize names
init_names "$MODULE"

# Create base directory for module
BASE_PATH="src/modules/v1/$MODULE_LOWER"

# Execute command
case "$COMMAND" in
  all)
    echo "🚀 Generating complete module '$MODULE'..."
    mkdir -p $BASE_PATH/{controllers,repositories,dtos,events,services,facades}
    
    generate_module_file
    generate_controller_file
    generate_service_file
    generate_facade_file
    generate_repository_file
    generate_dtos_files
    generate_events_file
    
    echo ""
    echo "✅ Module '$MODULE' created successfully at $BASE_PATH"
    echo ""
    echo "Structure created:"
    echo "├── $MODULE_LOWER.module.ts"
    echo "├── controllers/"
    echo "│   └── $MODULE_LOWER.controller.ts"
    echo "├── services/"
    echo "│   └── $MODULE_LOWER.service.ts"
    echo "├── facades/"
    echo "│   └── $MODULE_LOWER.facade.ts"
    echo "├── repositories/"
    echo "│   └── $MODULE_LOWER.repository.ts"
    echo "├── dtos/"
    echo "│   ├── create-$MODULE_LOWER.dto.ts"
    echo "│   └── update-$MODULE_LOWER.dto.ts"
    echo "└── events/"
    echo "    └── $MODULE_LOWER.event.ts"
    ;;
    
  module)
    echo "📦 Generating module file..."
    generate_module_file
    echo "✅ Module file created: $BASE_PATH/$MODULE_LOWER.module.ts"
    ;;
    
  controller)
    echo "🎮 Generating controller..."
    mkdir -p $BASE_PATH/controllers
    generate_controller_file
    echo "✅ Controller created: $BASE_PATH/controllers/$MODULE_LOWER.controller.ts"
    ;;
    
  service)
    echo "⚙️  Generating service..."
    mkdir -p $BASE_PATH/services
    generate_service_file
    echo "✅ Service created: $BASE_PATH/services/$MODULE_LOWER.service.ts"
    ;;
    
  facade)
    echo "🎭 Generating facade..."
    mkdir -p $BASE_PATH/facades
    generate_facade_file
    echo "✅ Facade created: $BASE_PATH/facades/$MODULE_LOWER.facade.ts"
    ;;
    
  repository)
    echo "💾 Generating repository..."
    mkdir -p $BASE_PATH/repositories
    generate_repository_file
    echo "✅ Repository created: $BASE_PATH/repositories/$MODULE_LOWER.repository.ts"
    ;;
    
  dtos)
    echo "📋 Generating DTOs..."
    mkdir -p $BASE_PATH/dtos
    generate_dtos_files
    echo "✅ DTOs created:"
    echo "  - $BASE_PATH/dtos/create-$MODULE_LOWER.dto.ts"
    echo "  - $BASE_PATH/dtos/update-$MODULE_LOWER.dto.ts"
    ;;
    
  events)
    echo "📡 Generating events..."
    mkdir -p $BASE_PATH/events
    generate_events_file
    echo "✅ Events created: $BASE_PATH/events/$MODULE_LOWER.event.ts"
    ;;
    
  *)
    echo "Error: Unknown command '$COMMAND'"
    show_help
    exit 1
    ;;
esac