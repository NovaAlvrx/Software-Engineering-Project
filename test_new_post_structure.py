# filename: test_new_post_structure.py

import pytest
from bs4 import BeautifulSoup

# The HTML content of the new-post.html file is loaded once for all structural tests
HTML_CONTENT = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Skill Swap - New Post</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2 class="logo">Skill<br>Swap</h2>
      <nav>
        <ul>
          <li><i class="icon">🏠</i> Home</li>
          <li><i class="icon">🔍</i> Search</li>
          <li class="active"><i class="icon">➕</i> Create</li>
          <li><i class="icon">💬</i> Messages</li>
          <li><i class="icon">👤</i> [username]</li>
        </ul>
      </nav>
      <div class="more">
        <i class="icon">☰</i> More
      </div>
    </aside>

    <main class="main-content">
      <h1 class="title">New Post</h1>

      <div class="post-container">
        <button class="circle-btn">Skills<br>Overview</button>

        <div class="image-section">
          <label for="imageUpload" class="image-placeholder">
            <input type="file" id="imageUpload" accept="image/*" hidden />
            <span>Click to upload image</span>
            <img id="preview" alt="Image preview" />
          </label>
        </div>

        <button class="circle-btn">More<br>Options</button>
      </div>

      <textarea
        id="description"
        placeholder="Add a description..."
        rows="4"
      ></textarea>

      <button class="share-btn" id="shareBtn">Share</button>
    </main>
  </div>

  <script src="script.js"></script>
</body>
</html>
"""

@pytest.fixture(scope="module")
def soup():
    """A Pytest fixture to parse the HTML once for all tests."""
    return BeautifulSoup(HTML_CONTENT, 'html.parser')

# ----------------------------------------------------------------------
# Test Case #1: Structural Presence of Core Elements
# ----------------------------------------------------------------------

def test_page_title_and_main_header(soup):
    """Checks for the page title and the main heading in the content area."""
    assert soup.title.string == "Skill Swap - New Post"
    main_header = soup.find('h1', class_='title')
    assert main_header is not None
    assert main_header.text.strip() == "New Post"

def test_share_button_presence_and_id(soup):
    """
    Test Case #1 relates to sharing a post. This checks the 'Share' button exists.
    """
    share_button = soup.find('button', id='shareBtn')
    assert share_button is not None
    assert 'share-btn' in share_button.get('class', [])
    assert share_button.text.strip() == "Share"

def test_sidebar_create_link_is_active(soup):
    """Checks that the 'Create' navigation link is marked as active."""
    create_link = soup.find('li', class_='active')
    assert create_link is not None
    assert 'Create' in create_link.text

# ----------------------------------------------------------------------
# Test Case #2: Structural Presence of Image/Input Elements
# ----------------------------------------------------------------------

def test_image_upload_input_and_placeholder(soup):
    """
    Test Case #2 relates to attaching an image. This checks the input and its label/placeholder.
    """
    # Check for the file input element
    image_input = soup.find('input', id='imageUpload')
    assert image_input is not None
    assert image_input.get('type') == 'file'
    assert image_input.get('accept') == 'image/*'

    # Check for the descriptive label/placeholder structure
    image_placeholder_span = soup.find('span')
    assert image_placeholder_span is not None
    assert image_placeholder_span.text.strip() == "Click to upload image"
    
    # Check for the main container element
    image_section = soup.find('div', class_='image-section')
    assert image_section is not None

def test_post_container_circle_buttons(soup):
    """Checks for the presence of the two circle action buttons."""
    buttons = soup.find_all('button', class_='circle-btn')
    assert len(buttons) == 2
    assert "Skills Overview" in buttons[0].text.replace('\n', ' ')
    assert "More Options" in buttons[1].text.replace('\n', ' ')

def test_description_textarea_attributes(soup):
    """Checks the description text area for required attributes."""
    textarea = soup.find('textarea', id='description')
    assert textarea is not None
    assert textarea.get('placeholder') == "Add a description..."
    assert textarea.get('rows') == "4"

# ----------------------------------------------------------------------
# Test Case #3: CSS File Linkage (Example of checking dependencies)
# ----------------------------------------------------------------------

def test_css_linkage(soup):
    """Verifies that the styles.css file is correctly linked."""
    css_link = soup.find('link', rel='stylesheet')
    assert css_link is not None
    assert css_link.get('href') == 'styles.css'