import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Fab, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Camera as CameraIcon, Delete as DeleteIcon, PhotoLibrary as PhotoLibraryIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import jsPDF from 'jspdf';

// Material Design 3 Theme - Material You
const theme = createTheme({
  palette: {
    primary: {
      main: '#6750A4',
      light: '#9A82DB',
      dark: '#4F378B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71',
      light: '#958DA5',
      dark: '#463E52',
    },
    background: {
      default: '#FDFBFF',
      paper: '#FFFFFF',
    },
    surface: {
      main: '#F7F2FA',
      variant: '#E7E0EC',
    },
    text: {
      primary: '#1C1B1F',
      secondary: '#49454F',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 28, // Pill shape for buttons
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    '0 3px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
    '0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
    '0 5px 10px rgba(0,0,0,0.18), 0 3px 6px rgba(0,0,0,0.12)',
    '0 6px 12px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.15)',
    '0 8px 16px rgba(0,0,0,0.22), 0 6px 12px rgba(0,0,0,0.18)',
    '0 10px 20px rgba(0,0,0,0.24), 0 8px 16px rgba(0,0,0,0.2)',
    '0 12px 24px rgba(0,0,0,0.26), 0 10px 20px rgba(0,0,0,0.22)',
    '0 14px 28px rgba(0,0,0,0.28), 0 12px 24px rgba(0,0,0,0.24)',
    '0 16px 32px rgba(0,0,0,0.3), 0 14px 28px rgba(0,0,0,0.26)',
    '0 18px 36px rgba(0,0,0,0.32), 0 16px 32px rgba(0,0,0,0.28)',
    '0 20px 40px rgba(0,0,0,0.34), 0 18px 36px rgba(0,0,0,0.3)',
    '0 22px 44px rgba(0,0,0,0.36), 0 20px 40px rgba(0,0,0,0.32)',
    '0 24px 48px rgba(0,0,0,0.38), 0 22px 44px rgba(0,0,0,0.34)',
    '0 26px 52px rgba(0,0,0,0.4), 0 24px 48px rgba(0,0,0,0.36)',
    '0 28px 56px rgba(0,0,0,0.42), 0 26px 52px rgba(0,0,0,0.38)',
    '0 30px 60px rgba(0,0,0,0.44), 0 28px 56px rgba(0,0,0,0.4)',
    '0 32px 64px rgba(0,0,0,0.46), 0 30px 60px rgba(0,0,0,0.42)',
    '0 34px 68px rgba(0,0,0,0.48), 0 32px 64px rgba(0,0,0,0.44)',
    '0 36px 72px rgba(0,0,0,0.5), 0 34px 68px rgba(0,0,0,0.48)',
    '0 38px 76px rgba(0,0,0,0.52), 0 36px 72px rgba(0,0,0,0.5)',
    '0 40px 80px rgba(0,0,0,0.54), 0 38px 76px rgba(0,0,0,0.52)',
  ],
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    },
  },
});

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [renameDialog, setRenameDialog] = useState({ open: false, pdfDoc: null, imageId: '', defaultName: '', imageData: null });
  const [pdfFilename, setPdfFilename] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [pressingItem, setPressingItem] = useState(null);

  // Load saved images on mount
  useEffect(() => {
    loadSavedImages();
    
    // Listen for shared images from other apps
    const handleSharedImage = async (event) => {
      try {
        if (event.detail) {
          await processSharedImage(event);
        }
      } catch (error) {
        console.error('Error handling shared image:', error);
        showSnackbar('Failed to process shared image', 'error');
      }
    };

    // Listen for custom event from native
    window.addEventListener('sharedImage', handleSharedImage);

    // Also listen for app state changes (when app comes to foreground with shared content)
    const handleAppState = async () => {
      try {
        const { state } = await CapacitorApp.getState();
        if (state === 'active') {
          // Check if there's a shared intent
          // This is a fallback - the main handling is via the custom event
        }
      } catch (error) {
        console.error('Error checking app state:', error);
      }
    };

    CapacitorApp.addListener('appStateChange', handleAppState);

    return () => {
      window.removeEventListener('sharedImage', handleSharedImage);
      CapacitorApp.removeAllListeners();
    };
  }, []);

  const loadSavedImages = async () => {
    try {
      // In a real app, you might want to store image metadata
      // For now, we'll just keep them in state
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const processPhoto = async (photo) => {
    try {
      if (!photo || !photo.base64String) {
        throw new Error('Invalid photo data received');
      }

      const imageData = {
        id: Date.now().toString(),
        base64: photo.base64String,
        format: photo.format || 'jpeg',
        timestamp: new Date().toISOString(),
        pdfFilename: null, // Will be set after PDF conversion
        pdfUri: null, // Will be set after PDF is saved
      };

      setImages(prev => [imageData, ...prev]);
      showSnackbar('Photo added successfully!');
      
      // Automatically convert to PDF
      await convertToPdf(imageData);
    } catch (error) {
      console.error('Error processing photo:', error);
      showSnackbar('Failed to process photo. Please try again.', 'error');
      setLoading(false);
    }
  };

  const capturePhoto = async () => {
    try {
      setLoading(true);
      
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      await processPhoto(photo);
    } catch (error) {
      console.error('Error capturing photo:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      if (errorMessage !== 'User cancelled photos app' && errorMessage !== 'User cancelled' && !errorMessage.includes('cancel')) {
        showSnackbar('Failed to capture photo. Please check camera permissions and try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const pickPhotoFromStorage = async () => {
    try {
      setLoading(true);
      
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      await processPhoto(photo);
    } catch (error) {
      console.error('Error picking photo:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      if (errorMessage !== 'User cancelled photos app' && errorMessage !== 'User cancelled' && !errorMessage.includes('cancel')) {
        showSnackbar('Failed to pick photo. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const processSharedImage = async (event) => {
    try {
      setLoading(true);
      
      const { base64, format } = event.detail || {};
      
      if (!base64) {
        throw new Error('No image data received');
      }

      // Create photo object similar to Camera plugin
      const photo = {
        base64String: base64,
        format: format || 'jpeg',
      };

      await processPhoto(photo);
    } catch (error) {
      console.error('Error processing shared image:', error);
      showSnackbar('Failed to process shared image. Please try again.', 'error');
      setLoading(false);
    }
  };

  const convertToPdf = async (imageData) => {
    try {
      setLoading(true);
      
      // Create image element to get dimensions
      const img = new Image();
      img.src = `data:image/${imageData.format};base64,${imageData.base64}`;
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create PDF with image dimensions (in mm)
      // Convert pixels to mm (1 inch = 25.4mm, assuming 96 DPI)
      const widthInMm = (img.width * 25.4) / 96;
      const heightInMm = (img.height * 25.4) / 96;
      
      // Create PDF document with image dimensions
      const pdf = new jsPDF({
        orientation: widthInMm > heightInMm ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [widthInMm, heightInMm],
      });

      // Add image to PDF (fit to page)
      pdf.addImage(
        `data:image/${imageData.format};base64,${imageData.base64}`,
        imageData.format.toUpperCase(),
        0,
        0,
        widthInMm,
        heightInMm
      );

      // Show rename dialog before saving PDF
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); // Remove milliseconds
      const defaultName = `PDF_${timestamp}`;
      setPdfFilename(defaultName);
      setRenameDialog({ 
        open: true, 
        pdfDoc: pdf, 
        imageId: imageData.id,
        defaultName: defaultName,
        imageData: imageData
      });
    } catch (error) {
      console.error('Error converting to PDF:', error);
      showSnackbar('Failed to convert to PDF: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * CRITICAL: Save PDF to device with proper binary-to-base64 conversion
   * This prevents "corrupt file" or "invalid file format" errors on Android
   */
  const savePdfToDevice = async (pdfDoc, filename, imageData) => {
    try {
      // Ensure filename has .pdf extension
      let finalFilename = filename.trim();
      if (!finalFilename.toLowerCase().endsWith('.pdf')) {
        finalFilename += '.pdf';
      }
      
      // Remove invalid characters from filename
      finalFilename = finalFilename.replace(/[<>:"/\\|?*]/g, '_');
      
      if (!finalFilename || finalFilename === '.pdf') {
        finalFilename = renameDialog.defaultName + '.pdf';
      }

      // Generate PDF as arraybuffer (binary data)
      const pdfArrayBuffer = pdfDoc.output('arraybuffer');
      
      // Convert arraybuffer to Uint8Array
      const uint8Array = new Uint8Array(pdfArrayBuffer);
      
      // Convert to base64 string manually (clean, no prefix)
      let base64String = '';
      const chunkSize = 8192; // Process in chunks to avoid memory issues
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        base64String += String.fromCharCode.apply(null, chunk);
      }
      
      // Convert to base64 using btoa
      const base64 = btoa(base64String);
      
      // Save to Documents directory
      // Note: For binary files (PDFs), we write the base64 string directly
      // Capacitor will handle the base64 to binary conversion
      const result = await Filesystem.writeFile({
        path: finalFilename,
        data: base64,
        directory: Directory.Documents,
      });

      // Update imageData with PDF filename and URI
      if (imageData) {
        setImages(prev => prev.map(img => 
          img.id === imageData.id 
            ? { ...img, pdfFilename: finalFilename, pdfUri: result.uri }
            : img
        ));
      }

      showSnackbar(`PDF saved as: ${finalFilename}`);
      
      // Open/share the PDF
      await openPdf(result.uri, finalFilename);
      
    } catch (error) {
      console.error('Error saving PDF:', error);
      showSnackbar('Failed to save PDF: ' + error.message, 'error');
      throw error;
    }
  };

  const handleRenameDialogClose = () => {
    setRenameDialog({ open: false, pdfDoc: null, imageId: '', defaultName: '', imageData: null });
    setPdfFilename('');
    setLoading(false);
  };

  const handleRenameDialogSave = async () => {
    if (renameDialog.pdfDoc) {
      try {
        setLoading(true);
        await savePdfToDevice(
          renameDialog.pdfDoc, 
          pdfFilename || renameDialog.defaultName,
          renameDialog.imageData
        );
        handleRenameDialogClose();
      } catch (error) {
        console.error('Error in rename dialog save:', error);
      }
    }
  };

  const openPdf = async (fileUri, filename) => {
    try {
      // Use Share plugin to open the PDF
      if (await Share.canShare()) {
        await Share.share({
          title: 'Open PDF',
          text: filename,
          url: fileUri,
          dialogTitle: 'Open PDF',
        });
      } else {
        showSnackbar(`PDF saved to: ${filename}`, 'info');
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      // Don't show error for share, just inform user where file is saved
      showSnackbar(`PDF saved to Documents/${filename}`, 'info');
    }
  };

  const deleteImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    showSnackbar('Image removed');
  };

  const handleLongPress = (imageId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
    // Haptic feedback (if available)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const startLongPress = (imageId) => {
    if (selectedItems.size > 0) return;
    
    setPressingItem(imageId);
    const timer = setTimeout(() => {
      handleLongPress(imageId);
      setPressingItem(null);
    }, 400); // Reduced from 500ms for faster response
    
    setLongPressTimer(timer);
  };

  const cancelLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setPressingItem(null);
  };

  const handleItemClick = async (imageId) => {
    if (selectedItems.size > 0) {
      // If selection mode is active, toggle selection
      handleLongPress(imageId);
    } else {
      // If not in selection mode, open the PDF
      const image = images.find(img => img.id === imageId);
      if (image) {
        if (image.pdfFilename) {
          console.log('Opening PDF for image:', image.id, image.pdfFilename);
          await openPdfFile(image);
        } else {
          showSnackbar('PDF is still being processed. Please wait...', 'info');
        }
      }
    }
  };

  const openPdfFile = async (image) => {
    try {
      if (!image.pdfFilename) {
        showSnackbar('PDF not ready yet. Please wait...', 'info');
        return;
      }

      console.log('Opening PDF:', image.pdfFilename);
      
      // Try to get the file URI
      let fileUri = image.pdfUri;
      
      if (!fileUri) {
        // Try to get the file URI using stat
        try {
          const fileInfo = await Filesystem.stat({
            path: image.pdfFilename,
            directory: Directory.Documents,
          });
          fileUri = fileInfo.uri;
          console.log('File URI from stat:', fileUri);
          
          // Update the image with the URI for future use
          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, pdfUri: fileUri }
              : img
          ));
        } catch (error) {
          console.error('Error getting file info:', error);
          // Try to construct URI manually
          try {
            // For Android, try to get URI using getUri
            const uriResult = await Filesystem.getUri({
              path: image.pdfFilename,
              directory: Directory.Documents,
            });
            fileUri = uriResult.uri;
            console.log('File URI from getUri:', fileUri);
            
            // Update the image with the URI
            setImages(prev => prev.map(img => 
              img.id === image.id 
                ? { ...img, pdfUri: fileUri }
                : img
            ));
          } catch (uriError) {
            console.error('Error getting URI:', uriError);
            showSnackbar('PDF file not found. It may have been deleted.', 'error');
            return;
          }
        }
      }

      console.log('Using file URI:', fileUri);

      // On Android, use native method to open PDF directly
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
        try {
          // Get proper URI for Android
          if (!fileUri.startsWith('content://') && !fileUri.startsWith('file://')) {
            try {
              const uriResult = await Filesystem.getUri({
                path: image.pdfFilename,
                directory: Directory.Documents,
              });
              fileUri = uriResult.uri;
              console.log('Updated file URI for Android:', fileUri);
            } catch (uriError) {
              console.error('Error getting Android URI:', uriError);
            }
          }

          // Call native method via JavaScript interface
          if (window.AndroidOpenPdf && typeof window.AndroidOpenPdf.openPdfFile === 'function') {
            console.log('Calling native openPdfFile method');
            window.AndroidOpenPdf.openPdfFile(fileUri);
          } else {
            // Fallback: try to use Share plugin
            console.log('JavaScript interface not available, using Share plugin');
            if (await Share.canShare()) {
              await Share.share({
                title: 'Open PDF',
                text: image.pdfFilename,
                url: fileUri,
                dialogTitle: 'Open PDF with...',
              });
            } else {
              showSnackbar(`PDF: ${image.pdfFilename}`, 'info');
            }
          }
        } catch (error) {
          console.error('Error opening PDF on Android:', error);
          showSnackbar('Failed to open PDF. Please try again.', 'error');
        }
      } else {
        // For web or other platforms, use Share plugin
        try {
          if (await Share.canShare()) {
            await Share.share({
              title: 'Open PDF',
              text: image.pdfFilename,
              url: fileUri,
              dialogTitle: 'Open PDF with...',
            });
          } else {
            showSnackbar(`PDF: ${image.pdfFilename}`, 'info');
          }
        } catch (shareError) {
          console.error('Share error:', shareError);
          showSnackbar(`PDF: ${image.pdfFilename}`, 'info');
        }
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      showSnackbar('Failed to open PDF. Please try again.', 'error');
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return;
    
    setImages(prev => prev.filter(img => !selectedItems.has(img.id)));
    showSnackbar(`${selectedItems.size} item(s) deleted`);
    setSelectedItems(new Set());
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
  };

  // Spring animation config
  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springConfig}
        sx={{
          minHeight: '100vh',
          backgroundColor: '#FDFBFF',
          padding: { xs: '16px', sm: '24px' },
          paddingBottom: { xs: '140px', sm: '160px' }, // Space for floating action island
          paddingTop: { xs: '80px', sm: '100px' }, // Space for sticky header
        }}
      >
      {/* Selection Mode Navigation Bar */}
      <AnimatePresence>
        {selectedItems.size > 0 && (
          <Box
            component={motion.div}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={springConfig}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              background: 'linear-gradient(135deg, #6750A4 0%, #4F378B 100%)',
              color: 'white',
              padding: { xs: '16px', sm: '20px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(103, 80, 164, 0.3)',
            }}
          >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              letterSpacing: '0.01em',
            }}
          >
            {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDeleteSelected}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleClearSelection}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
              }}
            >
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 600 }}>✕</Typography>
            </IconButton>
          </Box>
        </Box>
        )}
      </AnimatePresence>

      {/* Transparent Blurry Sticky Header */}
      <AnimatePresence>
        {selectedItems.size === 0 && (
          <Box
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={springConfig}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              background: 'rgba(253, 251, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(103, 80, 164, 0.1)',
              padding: { xs: '20px 16px', sm: '24px 24px' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                maxWidth: 1200,
                mx: 'auto',
              }}
            >
              <Box
                component={motion.div}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.96 }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6750A4 0%, #4F378B 100%)',
                  flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(103, 80, 164, 0.3)',
                }}
              >
                <CameraIcon 
                  sx={{ 
                    fontSize: { xs: 24, sm: 28 },
                    color: 'white',
                  }} 
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: '#1C1B1F',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                  }}
                >
                  JPG to PDF
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#49454F',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    mt: 0.5,
                    fontWeight: 400,
                  }}
                >
                  Convert photos to PDF instantly
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </AnimatePresence>

      {/* Animated Empty State */}
      <AnimatePresence mode="wait">
        {images.length === 0 ? (
          <Box
            component={motion.div}
            key="empty"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={springConfig}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
            }}
          >
            <Box
              component={motion.div}
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                width: { xs: 120, sm: 160 },
                height: { xs: 120, sm: 160 },
                borderRadius: '32px',
                background: 'linear-gradient(135deg, #EADDFF 0%, #D0BCFF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
                boxShadow: '0 8px 32px rgba(103, 80, 164, 0.2)',
              }}
            >
              <CameraIcon 
                sx={{ 
                  fontSize: { xs: 56, sm: 80 },
                  color: '#6750A4',
                }} 
              />
            </Box>
            <Typography 
              variant="h5"
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                textAlign: 'center',
                px: 2,
                color: '#1C1B1F',
                fontWeight: 500,
                mb: 1,
              }}
            >
              No photos yet
            </Typography>
            <Typography 
              variant="body1"
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textAlign: 'center',
                px: 2,
                color: '#49454F',
                maxWidth: 400,
              }}
            >
              Tap the buttons below to capture or choose a photo
            </Typography>
          </Box>
        ) : (
        <Box
          component={motion.div}
          key="list"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={springConfig}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 2.5 },
          }}
        >
          <AnimatePresence>
          {images.map((image, index) => {
            const isSelected = selectedItems.has(image.id);
            return (
            <Card
              component={motion.div}
              key={image.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ ...springConfig, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onTouchStart={(e) => {
                if (selectedItems.size > 0) return;
                startLongPress(image.id);
              }}
              onTouchEnd={(e) => {
                cancelLongPress();
                if (selectedItems.size === 0 && !pressingItem) {
                  handleItemClick(image.id);
                }
              }}
              onTouchCancel={cancelLongPress}
              onMouseDown={(e) => {
                if (selectedItems.size > 0 || e.button !== 0) return;
                startLongPress(image.id);
              }}
              onMouseUp={(e) => {
                cancelLongPress();
                if (selectedItems.size === 0 && !pressingItem && e.button === 0) {
                  handleItemClick(image.id);
                }
              }}
              onMouseLeave={cancelLongPress}
              onClick={(e) => {
                // Prevent click if long press was triggered
                if (pressingItem === image.id) {
                  e.preventDefault();
                  return;
                }
                if (selectedItems.size === 0) {
                  handleItemClick(image.id);
                }
              }}
              sx={{
                borderRadius: '24px',
                boxShadow: isSelected 
                  ? '0 0 0 3px #6750A4, 0 8px 24px rgba(103, 80, 164, 0.2)' 
                  : '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                backgroundColor: isSelected 
                  ? 'rgba(103, 80, 164, 0.08)' 
                  : '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
                border: isSelected ? '3px solid #6750A4' : 'none',
              }}
            >
              <CardContent
                sx={{
                  padding: { xs: '16px', sm: '20px' } + ' !important',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  minHeight: { xs: 80, sm: 90 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                    minWidth: { xs: 56, sm: 64 },
                    minHeight: { xs: 56, sm: 64 },
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(156, 39, 176, 0.15)',
                  }}
                >
                  <PdfIcon 
                    sx={{ 
                      fontSize: { xs: 32, sm: 40 },
                      color: '#9C27B0',
                    }} 
                  />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: '#202124',
                      fontSize: { xs: '0.9375rem', sm: '1rem' },
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {image.pdfFilename || 'Processing...'}
                  </Typography>
                  {image.pdfFilename && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#5f6368',
                        fontSize: '0.75rem',
                      }}
                    >
                      PDF Document
                    </Typography>
                  )}
                </Box>
                {isSelected && (
                  <Box
                    component={motion.div}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={springConfig}
                    sx={{
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6750A4 0%, #4F378B 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '3px solid white',
                      boxShadow: '0 4px 16px rgba(103, 80, 164, 0.4)',
                    }}
                  >
                    <Typography sx={{ color: 'white', fontSize: '1rem', fontWeight: 700 }}>✓</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
            );
          })}
          </AnimatePresence>
        </Box>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springConfig}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(28, 27, 31, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Box
              component={motion.div}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={springConfig}
              sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
              }}
            >
              <CircularProgress size={56} sx={{ color: '#6750A4' }} />
              <Typography variant="h6" sx={{ color: '#1C1B1F', fontWeight: 500 }}>
                Processing...
              </Typography>
            </Box>
          </Box>
        )}
      </AnimatePresence>

      {/* Floating Action Island */}
      <Box
        component={motion.div}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springConfig}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 24 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          gap: 2,
          maxWidth: { xs: 'calc(100% - 32px)', sm: 600 },
          width: '100%',
        }}
      >
        <Button
          component={motion.button}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.96 }}
          variant="contained"
          startIcon={<CameraIcon sx={{ fontSize: 24 }} />}
          onClick={capturePhoto}
          disabled={loading}
          sx={{
            flex: 1,
            minHeight: { xs: 56, sm: 64 },
            fontSize: { xs: '1rem', sm: '1.125rem' },
            fontWeight: 600,
            backgroundColor: '#6750A4',
            borderRadius: '28px',
            textTransform: 'none',
            boxShadow: '0 8px 24px rgba(103, 80, 164, 0.4)',
            '&:hover': {
              backgroundColor: '#4F378B',
              boxShadow: '0 12px 32px rgba(103, 80, 164, 0.5)',
            },
            '&:disabled': {
              backgroundColor: '#CAC4D0',
            },
          }}
        >
          Take Photo
        </Button>
        <Button
          component={motion.button}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.96 }}
          variant="contained"
          startIcon={<PhotoLibraryIcon sx={{ fontSize: 24 }} />}
          onClick={pickPhotoFromStorage}
          disabled={loading}
          sx={{
            flex: 1,
            minHeight: { xs: 56, sm: 64 },
            fontSize: { xs: '1rem', sm: '1.125rem' },
            fontWeight: 600,
            backgroundColor: '#6750A4',
            borderRadius: '28px',
            textTransform: 'none',
            boxShadow: '0 8px 24px rgba(103, 80, 164, 0.4)',
            '&:hover': {
              backgroundColor: '#4F378B',
              boxShadow: '0 12px 32px rgba(103, 80, 164, 0.5)',
            },
            '&:disabled': {
              backgroundColor: '#CAC4D0',
            },
          }}
        >
          Choose Photo
        </Button>
      </Box>

      {/* Rename PDF Dialog */}
      <AnimatePresence>
        {renameDialog.open && (
          <Dialog
            open={renameDialog.open}
            onClose={handleRenameDialogClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              component: motion.div,
              initial: { scale: 0.9, opacity: 0, y: 20 },
              animate: { scale: 1, opacity: 1, y: 0 },
              exit: { scale: 0.9, opacity: 0, y: 20 },
              transition: springConfig,
              sx: {
                borderRadius: '28px',
                padding: '8px',
              }
            }}
          >
            <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 600, pb: 1, color: '#1C1B1F' }}>
              Save PDF
            </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="File Name"
            type="text"
            fullWidth
            variant="outlined"
            value={pdfFilename}
            onChange={(e) => setPdfFilename(e.target.value)}
            placeholder={renameDialog.defaultName}
            helperText="Enter a name for your PDF file (extension will be added automatically)"
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '1rem',
              },
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleRenameDialogSave();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '20px 24px', gap: 2 }}>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleRenameDialogClose}
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#49454F',
              borderRadius: '20px',
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(103, 80, 164, 0.08)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleRenameDialogSave}
            variant="contained"
            disabled={loading}
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: '#6750A4',
              borderRadius: '20px',
              px: 3,
              boxShadow: '0 4px 12px rgba(103, 80, 164, 0.3)',
              '&:hover': {
                backgroundColor: '#4F378B',
                boxShadow: '0 6px 16px rgba(103, 80, 164, 0.4)',
              },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
        )}
      </AnimatePresence>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          bottom: { xs: 100, sm: 120 },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </ThemeProvider>
  );
}

export default App;
