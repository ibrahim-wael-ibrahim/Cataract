#!/bin/bash
# This script appends each file in the src directory to PROMPT_FRONTEND.txt with a header and separator.
echo -e "\n======= File Structure =======\n" >> PROMPT.txt

tree src >> PROMPT.txt

# Optional: Write a starting header in PROMPT_FRONTEND.txt (this will append to the file)
echo -e "\n======= Appending src file contents =======\n" >> PROMPT.txt

# Find all files in the src directory and loop through them
find src -type f | while IFS= read -r file; do
    # Write a header with the file path and name
    echo "File: $file" >> PROMPT.txt
    echo "------------------------" >> PROMPT.txt
    # Append the file content
    cat "$file" >> PROMPT.txt
    # Append the separator
    echo -e "\n__________\n" >> PROMPT.txt
done