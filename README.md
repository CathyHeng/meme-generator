# 🎨 Meme Generator

A modern, feature-rich meme generator web application with an intuitive drag-and-drop interface.

## 🚀 [Try the Live Demo](https://cathyheng.github.io/meme-generator/)

Create memes instantly - no installation required!

## ✨ Features

- **8 Popular Meme Templates**: Choose from classic memes like "Always Has Been", "This is Fine", "Distracted Boyfriend", and more
- **Custom Image Upload**: Upload your own images to create custom memes
- **Interactive Text Editing**:
  - Add multiple text overlays
  - Drag to reposition text
  - Hold Shift + Drag to rotate text
  - Customize text size, color, and border color
- **Real-time Preview**: See changes instantly on the canvas
- **Download**: Save your created memes as high-quality images
- **Modern UI**: Sleek dark theme with vibrant colors and smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Option 1: Local Server (Recommended)

1. Clone this repository:
```bash
git clone https://github.com/yourusername/meme-generator.git
cd meme-generator
```

2. Start a local server:
```bash
# Using Python 3
python3 -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or using Node.js
npx http-server -p 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

### Option 2: Direct File Opening

Simply open `index.html` in your web browser. Note: Some features may be limited due to CORS restrictions.

## 🎮 How to Use

1. **Select a Template**: Click on any meme template from the gallery or upload your own image
2. **Add Text**: The first text editor will appear automatically. Click "Add another text" to add more
3. **Customize Text**:
   - Type your text in the input field
   - Adjust the text size using the slider
   - Change text and border colors using the color pickers
4. **Position & Rotate**:
   - **Move**: Click and drag the text to reposition it
   - **Rotate**: Hold Shift and drag the text to rotate it
5. **Download**: Click the "Download Meme" button to save your creation

## 🛠️ Technologies Used

- **HTML5 Canvas**: For rendering memes with text overlays
- **Vanilla JavaScript**: No frameworks, just pure JS
- **CSS3**: Modern styling with gradients, animations, and flexbox/grid layouts
- **Google Fonts**: Righteous and Inter fonts for beautiful typography

## 📁 Project Structure

```
meme-generator/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Core functionality and canvas manipulation
├── always-has-been.jpg # Local meme template
└── README.md          # Project documentation
```

## 🎨 Customization

### Adding New Templates

To add your own meme templates, simply add a new `<img>` tag in the template gallery section of `index.html`:

```html
<img src="your-meme-url.jpg" alt="Meme Name" class="template-img">
```

### Changing Colors

The color scheme can be easily modified in `styles.css`. Key color variables used:
- Primary: `#a78bfa` (Purple)
- Accent: `#ec4899` (Pink)
- Background: `#0a0a14` (Dark blue-black)
- Card Background: `#1a1a2e` (Dark blue-gray)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Acknowledgments

- Meme templates sourced from imgflip and various meme archives
- Inspired by modern web design trends
- Built with accessibility and user experience in mind

---

**Enjoy creating memes! 🎉**

