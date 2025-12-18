# JPG to PDF Converter - Setup Instructions

## Installation

Run the following commands to install all dependencies:

```bash
# Install all dependencies
npm install

# Install Capacitor CLI globally (optional, but recommended)
npm install -g @capacitor/cli
```

## Development

```bash
# Start development server
npm run dev
```

## Building for Production

```bash
# Build the app
npm run build
```

## Capacitor Setup (Android)

```bash
# Initialize Capacitor (if not already done)
npx cap init

# Add Android platform
npx cap add android

# Sync web assets to native project
npm run cap:sync

# Open Android Studio
npm run cap:open
```

## Key Features

- **Google Keep Style UI**: Minimalist design with off-white background and masonry grid
- **Camera Integration**: Capture photos directly from the app
- **PDF Conversion**: Automatically converts captured images to PDF with proper sizing
- **File Management**: Saves PDFs to device Documents directory
- **Share Integration**: Opens PDF viewer after conversion

## Important Notes

- The `savePdfToDevice` function handles proper binary-to-base64 conversion to prevent corrupt file errors
- PDF page size automatically matches image dimensions (no stretching)
- All PDFs are saved to the Documents directory with timestamped filenames










