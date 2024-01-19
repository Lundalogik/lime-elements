#!/bin/bash

# Stencil generates src/components.d.ts, which is not compatible with
# api-extractor. This script renames the file to a backup, runs api-extractor,
# and then renames the backup back to the original name.

# Path to the components file
COMPONENTS_FILE="src/components.d.ts"
BACKUP_FILE="src/components.d.ts.backup"

# Check if the components file exists
if [ -f "$COMPONENTS_FILE" ]; then
    # Rename the components file to backup
    mv "$COMPONENTS_FILE" "$BACKUP_FILE"

    # Run API Extractor
    npx api-extractor run --local --verbose

    # Capture the exit code of API Extractor
    EXIT_CODE=$?

    # Rename the backup file back to components
    mv "$BACKUP_FILE" "$COMPONENTS_FILE"

    # Exit with the original exit code of API Extractor
    exit $EXIT_CODE
else
    # Run API Extractor and exit with its exit code
    npx api-extractor run --local --verbose
fi
