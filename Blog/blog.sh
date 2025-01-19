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
<header style="display: flex; justify-content: space-between; align-items: center; border-bottom: solid #ddd 1px; padding-bottom: 10px;">
    <h4 style="margin: 0;">
        <a href="#" style="text-decoration: none; color: #7171d1;">$name | $date</a>
    </h4>
    <a href="index.html" style="text-decoration: none; color: #7171d1; font-weight: bold;">Home</a>
</header>
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
    <title>Kovas's Blog</title>
    <link>https://kovasmccann.github.io</link>
    <description>Recent content Kovas's Webpage</description>
    <language>en-us</language>
    <lastBuildDate>$(date --rfc-2822)</lastBuildDate>
    <atom:link href="https://kovasmccann.github.io/Blog/index.xml" rel="self" type="application/rss+xml"/>
EOF
fi

# Append the new post entry to the RSS feed (without breaking the XML structure)
# Read the current RSS file and append the new <item> entry
temp_rss=$(mktemp)
grep -v '</channel>' "$rss" > "$temp_rss"  # Remove the closing </channel> temporarily
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


# Create index.html file if it doesn't exist
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
</head>
<body>
    <h1>Welcome to My Blog</h1>
    <div class="posts">
EOF
fi

# Append the new post link to index.html
cat << EOF >> "$index"
    <div class="post">
        <h2><a href="/Blog/$name.html">$name</a></h2>
        <p><strong>Date:</strong> $date</p>
        <p><strong>Tag:</strong> $tag</p>
    </div>
EOF

# Close the index.html structure if it was newly created
if [ ! -f "$index" ]; then
    echo "    </div>" >> "$index"
    echo "</body>" >> "$index"
    echo "</html>" >> "$index"
fi

echo "Index page updated at $index"

