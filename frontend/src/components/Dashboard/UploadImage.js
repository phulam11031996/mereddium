// Presentational Component - only present information to users.
import React, { useState } from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ClearIcon from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const UploadImage = (props) => {
    const [isOpen, setOpen] = useState(false);
    const [image, setImage] = useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleSave = (image) => {
        setOpen(false);
        setImage(image[0]);
        props.getImage(image[0]);
    };

    const handleDelete = () => {
        setImage(null);
        props.getImage(null);
    };

    return (
        <Box sx={{ marginBottom: '20px' }}>
            <Button onClick={handleOpen} size="small">
                <UploadFileIcon />
                <Typography variant="overline">
                    {image ? `${image.name}` : 'upload image'}
                </Typography>
            </Button>
            {image && (
                <Button onClick={handleDelete} size="small">
                    <ClearIcon />
                </Button>
            )}
            <DropzoneDialog
                dropzoneClass="dropzone-dialog"
                dropzoneParagraphClass="dropzone-p"
                open={isOpen}
                onSave={handleSave}
                onClose={handleClose}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                filesLimit={1}
                maxFileSize={5000000}
                showPreviews={true}
            />
        </Box>
    );
};
