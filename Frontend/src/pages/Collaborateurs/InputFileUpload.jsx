import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

const BlueIconButton = styled(IconButton)({
  color: '#207cd4', 
});

const InputFileUpload = ({ collaboratorId, onFileUpload }) => { 
  const [selectedFile, setSelectedFile] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log(file.name, file.size, file.type);
      encodeFileBase64(file);
    }
  };

  const encodeFileBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result;
      console.log(base64);
      onFileUpload(base64, collaboratorId); 
    };
    reader.onerror = (error) => {
      console.error("Error encoding file:", error);
    };
  };

  return (
    <BlueIconButton component="label" aria-label="upload">
      <CloudUploadIcon />
      <VisuallyHiddenInput type="file" onChange={onFileChange} />
    </BlueIconButton>
  );
};

export default InputFileUpload;
