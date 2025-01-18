#!/bin/bash

# This script is used to create a new blog post along with the necessary metadata and rss feed

location=$1
name=$(basename "$location" .md)  # Get the filename without the .md extension
date=$(grep -m 1 "^# Date" $location | cut -d " " -f 3-)
tag=$(grep -m 1 "^# Tag" $location | cut -d " " -f 3-)

rss="Blog/rss.xml"
index="Blog/index.html"

echo "Creating a new blog post with the title $name and the date $date and the tag $tag"

# Create the HTML directory
mkdir -p "./blog/$name"

# Read the Markdown file content (without converting it to HTML)
markdown_content=$(cat "$location")

# Create the HTML file with the necessary div wrapper
cat << EOF > "./blog/$name/index.html"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$name</title>
</head>
<body>
    <div class="blog-post">
        <h1>$name</h1>
        <p><strong>Date:</strong> $date</p>
        <p><strong>Tag:</strong> $tag</p>
        <span class="content" markdown="1" style="display:block">
		$markdown_content
            </span>
        </div>
    </div>
</body>
</html>
EOF

echo "Blog post created in ./blog/$name/index.html with the title $name and the date $date"
