// DOM Elements
const canvas = document.getElementById('meme-canvas');
const ctx = canvas.getContext('2d');
const canvasPlaceholder = document.getElementById('canvas-placeholder');
const downloadBtn = document.getElementById('download-btn');
const imageUpload = document.getElementById('image-upload');
const templateImages = document.querySelectorAll('.template-img');
const dragHint = document.getElementById('drag-hint');
const addTextBtn = document.getElementById('add-text-btn');
const textEditorsList = document.getElementById('text-editors-list');

// State
let currentImage = null;
let currentTemplateElement = null; // Track selected template element
let textElements = []; // Array to store multiple text elements
let selectedTextId = null; // Currently selected text element
let nextTextId = 1; // ID counter for text elements

// Drag state
let isDragging = false;
let draggedTextId = null;
let dragOffset = { x: 0, y: 0 };
let isRotating = false;
let rotationStartAngle = 0;

// Initialize with one empty text editor on page load
window.addEventListener('DOMContentLoaded', () => {
    createInitialTextEditor();
});

// Create initial text editor (disabled until image is loaded)
function createInitialTextEditor() {
    const editorBox = document.createElement('div');
    editorBox.className = 'text-editor-box active';
    editorBox.id = 'initial-text-editor';
    editorBox.innerHTML = `
        <div class="editor-header">
            <span class="text-number">Text 1</span>
            <button class="delete-text-btn" disabled style="opacity: 0.5; cursor: not-allowed;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
        
        <div class="text-inputs">
            <div class="input-group single">
                <label>Text Content</label>
                <input type="text" placeholder="Select a template to start" maxlength="100" disabled style="opacity: 0.6;">
            </div>
        </div>

        <div class="slider-group">
            <label>Text Size: <span>48</span>px</label>
            <input type="range" min="20" max="100" value="48" step="2" disabled style="opacity: 0.6;">
        </div>

        <div class="slider-group">
            <label>Rotation: <span>0</span>°</label>
            <input type="range" min="0" max="360" value="0" step="1" disabled style="opacity: 0.6;">
        </div>

        <div class="color-controls">
            <div class="color-group">
                <label>Text Color</label>
                <div class="color-input-wrapper">
                    <input type="color" value="#ffffff" disabled style="opacity: 0.6;">
                    <span>#ffffff</span>
                </div>
            </div>
            <div class="color-group">
                <label>Border Color</label>
                <div class="color-input-wrapper">
                    <input type="color" value="#000000" disabled style="opacity: 0.6;">
                    <span>#000000</span>
                </div>
            </div>
        </div>
    `;
    
    textEditorsList.appendChild(editorBox);
}

// Add Text Button
addTextBtn.addEventListener('click', () => {
    addNewTextElement();
});

// Add new text element
function addNewTextElement() {
    if (!currentImage) {
        alert('Please select a template or upload an image first!');
        return;
    }
    
    const newText = {
        id: nextTextId++,
        content: '',
        x: canvas.width / 2,
        y: 50 + (textElements.length * 60), // Stagger vertically
        size: 48,
        color: '#ffffff',
        borderColor: '#000000',
        rotation: 0 // Rotation in degrees
    };
    
    textElements.push(newText);
    createTextEditorBox(newText);
    drawMeme();
    updateDragHint();
    updateTextNumbers();
}

// Delete text element
function deleteTextElement(id) {
    textElements = textElements.filter(t => t.id !== id);
    
    // Remove the editor box from DOM
    const editorBox = document.getElementById(`text-editor-${id}`);
    if (editorBox) {
        editorBox.remove();
    }
    
    if (selectedTextId === id) {
        selectedTextId = null;
    }
    
    drawMeme();
    updateTextNumbers();
}

// Select text element (visual highlight)
function selectTextElement(id) {
    selectedTextId = id;
    
    // Remove active class from all editor boxes
    document.querySelectorAll('.text-editor-box').forEach(box => {
        box.classList.remove('active');
    });
    
    // Add active class to selected editor box
    const selectedBox = document.getElementById(`text-editor-${id}`);
    if (selectedBox) {
        selectedBox.classList.add('active');
    }
}

// Update text numbers to be sequential
function updateTextNumbers() {
    textElements.forEach((textElement, index) => {
        const editorBox = document.getElementById(`text-editor-${textElement.id}`);
        if (editorBox) {
            const textNumber = editorBox.querySelector('.text-number');
            if (textNumber) {
                textNumber.textContent = `Text ${index + 1}`;
            }
        }
    });
}

// Create individual text editor box
function createTextEditorBox(textElement) {
    const editorBox = document.createElement('div');
    editorBox.className = 'text-editor-box active';
    editorBox.id = `text-editor-${textElement.id}`;
    
    // Calculate the display number based on position in array
    const displayNumber = textElements.findIndex(t => t.id === textElement.id) + 1;
    
    editorBox.innerHTML = `
        <div class="editor-header">
            <span class="text-number">Text ${displayNumber}</span>
            <button class="delete-text-btn" onclick="deleteTextElement(${textElement.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
        
        <div class="text-inputs">
            <div class="input-group single">
                <label>Text Content</label>
                <input type="text" id="text-input-${textElement.id}" placeholder="Enter your text" maxlength="100" value="${textElement.content}">
            </div>
        </div>

        <div class="slider-group">
            <label>Text Size: <span id="size-value-${textElement.id}">${textElement.size}</span>px</label>
            <input type="range" id="text-size-${textElement.id}" min="20" max="100" value="${textElement.size}" step="2">
        </div>

        <div class="color-controls">
            <div class="color-group">
                <label>Text Color</label>
                <div class="color-input-wrapper">
                    <input type="color" id="text-color-${textElement.id}" value="${textElement.color}">
                    <span id="text-color-hex-${textElement.id}">${textElement.color}</span>
                </div>
            </div>
            <div class="color-group">
                <label>Border Color</label>
                <div class="color-input-wrapper">
                    <input type="color" id="border-color-${textElement.id}" value="${textElement.borderColor}">
                    <span id="border-color-hex-${textElement.id}">${textElement.borderColor}</span>
                </div>
            </div>
        </div>
    `;
    
    // Remove active class from other boxes
    document.querySelectorAll('.text-editor-box').forEach(box => {
        box.classList.remove('active');
    });
    
    textEditorsList.appendChild(editorBox);
    
    // Add event listeners
    const textInput = document.getElementById(`text-input-${textElement.id}`);
    const sizeSlider = document.getElementById(`text-size-${textElement.id}`);
    const sizeValue = document.getElementById(`size-value-${textElement.id}`);
    const colorInput = document.getElementById(`text-color-${textElement.id}`);
    const colorHex = document.getElementById(`text-color-hex-${textElement.id}`);
    const borderInput = document.getElementById(`border-color-${textElement.id}`);
    const borderHex = document.getElementById(`border-color-hex-${textElement.id}`);
    
    textInput.addEventListener('input', (e) => {
        textElement.content = e.target.value.toUpperCase();
        drawMeme();
    });
    
    sizeSlider.addEventListener('input', (e) => {
        textElement.size = parseInt(e.target.value);
        sizeValue.textContent = textElement.size;
        drawMeme();
    });
    
    colorInput.addEventListener('input', (e) => {
        textElement.color = e.target.value;
        colorHex.textContent = e.target.value;
        drawMeme();
    });
    
    borderInput.addEventListener('input', (e) => {
        textElement.borderColor = e.target.value;
        borderHex.textContent = e.target.value;
        drawMeme();
    });
    
    // Select on click
    editorBox.addEventListener('click', () => {
        selectTextElement(textElement.id);
    });
    
    // Focus on text input
    textInput.focus();
}

// Template Selection
templateImages.forEach(img => {
    img.addEventListener('click', function() {
        // Check if clicking the already selected template (deselect)
        if (currentTemplateElement === this) {
            // Deselect the template
            this.classList.remove('selected');
            currentTemplateElement = null;
            currentImage = null;
            
            // Clear canvas
            canvas.classList.remove('active');
            canvasPlaceholder.classList.remove('hidden');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Clear all text elements
            textElements = [];
            textEditorsList.innerHTML = '';
            
            // Add back initial disabled editor
            createInitialTextEditor();
        } else {
            // Remove selection from all templates
            templateImages.forEach(t => t.classList.remove('selected'));
            
            // Add selection to clicked template
            this.classList.add('selected');
            currentTemplateElement = this;
            
            // Load the template image
            loadImage(this.src);
        }
    });
});

// File Upload
imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            loadImage(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Drag and Drop
const uploadArea = document.querySelector('.upload-area');
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#e8e8ff';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = '#f8f9ff';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f8f9ff';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            loadImage(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load Image
function loadImage(src) {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for external images
    
    img.onload = function() {
        currentImage = img;
        
        // Set canvas size to match image
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;
        
        // Scale down if too large
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Show canvas and hide placeholder
        canvas.classList.add('active');
        canvasPlaceholder.classList.add('hidden');
        
        // Remove initial disabled editor if it exists
        const initialEditor = document.getElementById('initial-text-editor');
        if (initialEditor) {
            initialEditor.remove();
        }
        
        // Automatically add first text element if none exist
        if (textElements.length === 0) {
            addNewTextElement();
        } else {
            // Draw the meme with existing text
            drawMeme();
        }
    };
    
    img.onerror = function() {
        alert('Failed to load image. Please try another image or template.');
    };
    
    img.src = src;
}

// Show/hide drag hint
function updateDragHint() {
    if (textElements.length > 0 && currentImage) {
        dragHint.classList.add('show');
    } else {
        dragHint.classList.remove('show');
    }
}

// Draw Meme Function
function drawMeme() {
    if (!currentImage) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    
    // Draw all text elements
    textElements.forEach(textElement => {
        if (textElement.content) {
            // Save canvas state
            ctx.save();
            
            // Apply rotation (default to 0 if not set)
            const rotation = textElement.rotation || 0;
            if (rotation !== 0) {
                ctx.translate(textElement.x, textElement.y);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.translate(-textElement.x, -textElement.y);
            }
            
            // Set text properties for this element
            ctx.font = `bold ${textElement.size}px Impact, Arial Black, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            
            const maxWidth = canvas.width - 20;
            drawText(textElement.content, textElement.x, textElement.y, maxWidth, textElement.color, textElement.borderColor, textElement.size);
            
            // Restore canvas state
            ctx.restore();
        }
    });
}

// Draw Text with Outline
function drawText(text, x, y, maxWidth, fillColor, strokeColor, fontSize) {
    // Split text into lines if too long
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    
    // Draw each line
    const lineHeight = fontSize * 1.2;
    lines.forEach((line, index) => {
        const lineY = ctx.textBaseline === 'bottom' 
            ? y - (lines.length - 1 - index) * lineHeight
            : y + index * lineHeight;
        
        // Draw border outline (stroke)
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = fontSize / 16; // Proportional stroke width
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(line, x, lineY, maxWidth);
        
        // Draw text (fill)
        ctx.fillStyle = fillColor;
        ctx.fillText(line, x, lineY, maxWidth);
    });
}

// Get text bounds for hit detection
function getTextBounds(text, x, y, baseline, fontSize) {
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = baseline;
    
    const maxWidth = canvas.width - 20;
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    
    // Calculate bounds with padding for easier clicking
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
    
    let top = baseline === 'bottom' ? y - totalHeight : y;
    let bottom = baseline === 'bottom' ? y : y + totalHeight;
    
    const padding = 10; // Add padding to make clicking easier
    
    return {
        left: x - maxLineWidth / 2 - padding,
        right: x + maxLineWidth / 2 + padding,
        top: top - padding,
        bottom: bottom + padding
    };
}

// Check if point is inside text bounds
function isPointInText(mouseX, mouseY, textElement) {
    if (!textElement.content) return false;
    const bounds = getTextBounds(textElement.content, textElement.x, textElement.y, 'top', textElement.size);
    return mouseX >= bounds.left && mouseX <= bounds.right &&
           mouseY >= bounds.top && mouseY <= bounds.bottom;
}

// Get mouse position relative to canvas
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    };
}

// Mouse down - start dragging or rotating
canvas.addEventListener('mousedown', (e) => {
    if (!currentImage) return;
    
    const mousePos = getMousePos(canvas, e);
    
    // Check if clicking on any text element (iterate in reverse to get top-most)
    for (let i = textElements.length - 1; i >= 0; i--) {
        const textElement = textElements[i];
        if (isPointInText(mousePos.x, mousePos.y, textElement)) {
            draggedTextId = textElement.id;
            
            // Check if Shift key is pressed for rotation
            if (e.shiftKey) {
                isRotating = true;
                // Calculate initial angle
                const dx = mousePos.x - textElement.x;
                const dy = mousePos.y - textElement.y;
                rotationStartAngle = Math.atan2(dy, dx) * (180 / Math.PI) - (textElement.rotation || 0);
                canvas.style.cursor = 'crosshair';
            } else {
                isDragging = true;
                dragOffset.x = mousePos.x - textElement.x;
                dragOffset.y = mousePos.y - textElement.y;
                canvas.style.cursor = 'grabbing';
            }
            
            // Also select this text element for editing
            selectTextElement(textElement.id);
            e.preventDefault();
            break;
        }
    }
});

// Mouse move - drag, rotate text or update cursor
canvas.addEventListener('mousemove', (e) => {
    if (!currentImage) return;
    
    const mousePos = getMousePos(canvas, e);
    
    if (isRotating && draggedTextId !== null) {
        // Update rotation of text
        const textElement = textElements.find(t => t.id === draggedTextId);
        if (textElement) {
            const dx = mousePos.x - textElement.x;
            const dy = mousePos.y - textElement.y;
            const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
            textElement.rotation = Math.round(currentAngle - rotationStartAngle);
            
            // Keep rotation within 0-360 range
            if (textElement.rotation < 0) textElement.rotation += 360;
            if (textElement.rotation >= 360) textElement.rotation -= 360;
            
            drawMeme();
        }
    } else if (isDragging && draggedTextId !== null) {
        // Update position of dragged text
        const textElement = textElements.find(t => t.id === draggedTextId);
        if (textElement) {
            textElement.x = mousePos.x - dragOffset.x;
            textElement.y = mousePos.y - dragOffset.y;
            drawMeme();
        }
    } else {
        // Update cursor based on hover and shift key
        let hovering = false;
        for (let i = textElements.length - 1; i >= 0; i--) {
            if (isPointInText(mousePos.x, mousePos.y, textElements[i])) {
                hovering = true;
                break;
            }
        }
        
        if (hovering) {
            canvas.style.cursor = e.shiftKey ? 'crosshair' : 'grab';
        } else {
            canvas.style.cursor = 'default';
        }
    }
});

// Mouse up - stop dragging or rotating
canvas.addEventListener('mouseup', () => {
    if (isDragging || isRotating) {
        isDragging = false;
        isRotating = false;
        draggedTextId = null;
        canvas.style.cursor = 'default';
    }
});

// Mouse leave - stop dragging or rotating
canvas.addEventListener('mouseleave', () => {
    if (isDragging || isRotating) {
        isDragging = false;
        isRotating = false;
        draggedTextId = null;
        canvas.style.cursor = 'default';
    }
});

// Download Button
downloadBtn.addEventListener('click', () => {
    if (!currentImage) {
        alert('Please select or upload an image first!');
        return;
    }
    
    // Create a download link
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Initial state - disable download button until image is loaded
downloadBtn.disabled = true;

// Enable download button when image is loaded
const originalDrawMeme = drawMeme;
drawMeme = function() {
    originalDrawMeme();
    if (currentImage) {
        downloadBtn.disabled = false;
    }
};
