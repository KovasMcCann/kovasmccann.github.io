#!/bin/bash

location="$1"  # Assume the Markdown file is passed as the first argument
name=$(basename "$location" .html)  # Get the filename without the .md extension
date=$(grep -m 1 "^# Date" $location | cut -d " " -f 3-)
tag=$(grep -m 1 "^# Tag" $location | cut -d " " -f 3-)

rss="rss.xml"
index="index.html"

echo "Creating a new blog post with the title $name and the date $date and the tag $tag"

# Create the HTML directory for the new post
#mkdir -p "./blog/$name"

# Read the Markdown file content
markdown_content=$(cat "$location")

# Convert Markdown to HTML using pandoc (updated to use --embed-resources and --standalone)
html_content=$(echo "$markdown_content")

# Create the HTML file for the new blog post
cat << EOF > "$name.html"

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$name</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>

<body>
<header style="top: 0; position: sticky; z-index: 10; background-color: #02000a; display: flex; justify-content: space-between; align-items: center; border-bottom: solid #ddd 1px; padding-bottom: 10px;">
    <h4 style="margin: 0;">
        <a href="#" style="text-decoration: none; color: #7171d1;">$name | $date</a>
    </h4>
    <a href="index.html" style="text-decoration: none; color: #7171d1; font-weight: bold;">Home</a>
</header> 
    <!-- Your page content goes here -->
    <div class="blog-post">
        <!-- Blog post content -->
        $html_content
    </div>
</body>
</html>

EOF

echo "Blog post created with the title $name and the date $date"

# Check if the RSS file exists
if [ ! -f "$rss" ]; then
    # If the RSS file doesn't exist, create it with the channel header
    cat << EOF > "$rss"
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
    <title>Computing Blog</title>
    <link>https://kovasmccann.github.io</link>
    <description>Recent content of the Blog</description>
    <language>en-us</language>
    <lastBuildDate>$(date --rfc-2822)</lastBuildDate>
EOF
fi

# Append the new post entry to the RSS feed (without breaking the XML structure)
# Read the current RSS file and append the new <item> entry
temp_rss=$(mktemp)
grep -v -e '</channel>' -e '</rss>' "$rss" > "$temp_rss"  # Remove the closing </channel> temporarily
cat << EOF >> "$temp_rss"
    <item>
        <title>$name</title>
        <link>https://kovasmccann.github.io/Blog/$name.html</link>
        <pubDate>$(date -d "$date" --rfc-2822)</pubDate>
        <guid>https://kovasmccann.github.io/Blog/$name.html</guid>
        <description></description>
    </item>
EOF

# Re-add the closing </channel> and </rss> tags to the end of the file
echo "</channel>" >> "$temp_rss"
echo "</rss>" >> "$temp_rss"

# Overwrite the original RSS file with the new content
mv "$temp_rss" "$rss"

echo "RSS feed updated at $rss"

if [ ! -f "$index" ]; then
    # If index.html doesn't exist, create the basic structure
    cat << EOF > "$index"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blog</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
    <style>
        .posts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 10px;
            padding: 20px;
        }
        .post {
            border: 1px solid #ddd;
            padding: 15px;
            background-color: #f9f9f9;
        }
        header {
            top: 0; 
            position: sticky; 
            z-index: 10; 
            background-color: #02000a; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border-bottom: solid #ddd 1px; 
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
<header>
    <h4 style="margin: 0;">
        <a href="#" style="text-decoration: none; color: #7171d1;">Welcome to My Blog</a>
    </h4>
    <a href="rss.xml" style="text-decoration: none; color: #e26a2d; font-weight: bold;">RSS</a>
</header> 
    <div class="posts">
EOF
fi

# Insert new post at the beginning for newest-first sorting
temp_file=$(mktemp)
echo "    <div class=\"post\">" > "$temp_file"
echo "        <h2><a href=\"/Blog/$name.html\" style=\"font-family: 'heading', monospace;\">$name</a></h2>" >> "$temp_file"
echo "        <p><strong>Date:</strong> $date</p>" >> "$temp_file"
echo "        <p><strong>Tag:</strong> $tag</p>" >> "$temp_file"
echo "    </div>" >> "$temp_file"

# Merge temp file and old posts, keeping the newest first
cat "$index" | awk '/<div class="posts">/{print; system("cat '$temp_file'"); next}1' > "$index.new" && mv "$index.new" "$index"
rm "$temp_file"

echo "Index page updated at $index"