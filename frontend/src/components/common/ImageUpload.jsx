import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress, alpha, useTheme, Avatar } from '@mui/material';
import { CloudUpload, Delete, Image as ImageIcon, PhotoCamera } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({
    onUpload,
    multiple = false,
    title = "Upload Image",
    value = null,
    aspectRatio = "1/1",
    maxSizeMB = 5,
    isAvatar = false
}) => {
    const theme = useTheme();
    const [previews, setPreviews] = useState([]);
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Sync previews with value prop
    useEffect(() => {
        if (value) {
            setPreviews(Array.isArray(value) ? value : [value]);
        } else {
            setPreviews([]);
            setFiles([]);
        }
    }, [value]);

    const handleFiles = (incomingFiles) => {
        const fileList = Array.from(incomingFiles);
        if (fileList.length === 0) return;

        // Validation: Size limit
        const invalidSizeFiles = fileList.filter(file => file.size > maxSizeMB * 1024 * 1024);
        if (invalidSizeFiles.length > 0) {
            alert(`Some files exceed the ${maxSizeMB}MB limit.`);
            return;
        }

        // Validation: Type limit
        const invalidTypeFiles = fileList.filter(file => !file.type.startsWith('image/'));
        if (invalidTypeFiles.length > 0) {
            alert("Only image files are allowed.");
            return;
        }

        const newPreviews = fileList.map(file => URL.createObjectURL(file));

        if (multiple) {
            const updatedFiles = [...files, ...fileList];
            setFiles(updatedFiles);
            setPreviews(prev => [...prev, ...newPreviews]);
            onUpload(updatedFiles);
        } else {
            setFiles([fileList[0]]);
            setPreviews([newPreviews[0]]);
            onUpload(fileList[0]);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeImage = (index) => {
        if (multiple) {
            const updatedPreviews = [...previews];
            updatedPreviews.splice(index, 1);
            setPreviews(updatedPreviews);

            const updatedFiles = [...files];
            updatedFiles.splice(index, 1);
            setFiles(updatedFiles);

            onUpload(updatedFiles);
        } else {
            setPreviews([]);
            setFiles([]);
            onUpload(null);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('blob:') || path.startsWith('http')) return path;
        return `http://localhost:9090${path}`;
    };

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            {title && (
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                    {title}
                </Typography>
            )}

            <Box
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current.click()}
                sx={{
                    position: 'relative',
                    width: '100%',
                    minHeight: isAvatar ? 120 : 160,
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: isDragging ? 'primary.main' : alpha(theme.palette.divider, 0.2),
                    bgcolor: isDragging ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.background.paper, 0.5),
                    transition: 'all 0.2s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                    }
                }}
            >
                <input
                    type="file"
                    multiple={multiple}
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={(e) => handleFiles(e.target.files)}
                />

                {previews.length === 0 ? (
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                        {isAvatar ? (
                            <Avatar sx={{ width: 64, height: 64, mb: 1, mx: 'auto', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                <PhotoCamera color="primary" />
                            </Avatar>
                        ) : (
                            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1, opacity: 0.7 }} />
                        )}
                        <Typography variant="body2" color="text.secondary">
                            Drag & drop or click to upload
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                            JPG, PNG or WEBP (Max {maxSizeMB}MB)
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        p: 1.5,
                        width: '100%',
                        justifyContent: multiple ? 'flex-start' : 'center'
                    }}>
                        <AnimatePresence>
                            {previews.map((preview, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{ position: 'relative' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Box
                                        component="img"
                                        src={getImageUrl(preview)}
                                        sx={{
                                            width: multiple ? 100 : (isAvatar ? 100 : '100%'),
                                            height: multiple ? 100 : (isAvatar ? 100 : 'auto'),
                                            maxHeight: 250,
                                            borderRadius: isAvatar ? '50%' : 2,
                                            objectFit: 'cover',
                                            boxShadow: 2,
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => removeImage(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                            backdropFilter: 'blur(4px)'
                                        }}
                                    >
                                        <Delete sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {multiple && (
                            <Box
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 2,
                                    border: '2px dashed',
                                    borderColor: alpha(theme.palette.divider, 0.2),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': { borderColor: 'primary.main' }
                                }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <CloudUpload color="disabled" />
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ImageUpload;
