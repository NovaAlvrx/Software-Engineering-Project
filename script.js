const imageUpload = document.getElementById('imageUpload');
const preview = document.getElementById('preview');
const shareBtn = document.getElementById('shareBtn');

imageUpload.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.style.display = 'block';
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

shareBtn.addEventListener('click', () => {
  const description = document.getElementById('description').value.trim();
  if (!preview.src || !description) {
    alert('Please add an image and a description before sharing!');
  } else {
    alert('Your post has been shared successfully!');
    document.getElementById('description').value = '';
    preview.src = '';
    preview.style.display = 'none';
  }
});
