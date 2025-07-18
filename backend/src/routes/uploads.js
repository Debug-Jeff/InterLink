const express = require('express');
const multer = require('multer');
const path = require('path');
const { supabaseStorage } = require('../config/supabase');
const { logger } = require('../config/logger');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs').promises;
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
  const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${fileExtension} not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  }
});

// Upload single file
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        statusCode: 400
      });
    }

    const { projectId, description } = req.body;
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const originalName = req.file.originalname;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;

    // Read file data
    const fileBuffer = await fs.readFile(filePath);
    
    // Upload to Supabase Storage
    const bucketName = 'project-files';
    const storagePath = `${projectId || 'general'}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabaseStorage
      .storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false
      });

    if (uploadError) {
      logger.error('Supabase storage upload error:', uploadError);
      // Clean up local file
      await fs.unlink(filePath);
      return res.status(500).json({
        error: 'Failed to upload file to storage',
        statusCode: 500
      });
    }

    // Get public URL
    const { data: urlData } = supabaseStorage
      .storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    // Create thumbnail for images
    let thumbnailUrl = null;
    if (mimeType.startsWith('image/')) {
      try {
        const thumbnailBuffer = await sharp(fileBuffer)
          .resize(200, 200, { fit: 'inside' })
          .jpeg({ quality: 80 })
          .toBuffer();

        const thumbnailPath = `${projectId || 'general'}/thumbnails/${fileName}_thumb.jpg`;
        
        const { error: thumbError } = await supabaseStorage
          .storage
          .from(bucketName)
          .upload(thumbnailPath, thumbnailBuffer, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (!thumbError) {
          const { data: thumbUrlData } = supabaseStorage
            .storage
            .from(bucketName)
            .getPublicUrl(thumbnailPath);
          thumbnailUrl = thumbUrlData.publicUrl;
        }
      } catch (thumbError) {
        logger.warn('Failed to create thumbnail:', thumbError);
      }
    }

    // Save file metadata to database (if needed)
    const fileRecord = {
      id: uuidv4(),
      filename: fileName,
      originalName: originalName,
      size: fileSize,
      mimeType: mimeType,
      url: urlData.publicUrl,
      thumbnailUrl: thumbnailUrl,
      projectId: projectId || null,
      description: description || null,
      uploadedBy: req.user.id,
      createdAt: new Date().toISOString()
    };

    // Clean up local file
    await fs.unlink(filePath);

    logger.info(`File uploaded successfully: ${originalName} by user ${req.user.id}`);

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileRecord
    });
  } catch (error) {
    logger.error('Upload error:', error);
    
    // Clean up local file if it exists
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error('Failed to clean up local file:', unlinkError);
      }
    }

    res.status(500).json({
      error: 'Internal server error during file upload',
      statusCode: 500
    });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        statusCode: 400
      });
    }

    const { projectId, description } = req.body;
    const uploadedFiles = [];
    const errors = [];

    for (const file of req.files) {
      try {
        const filePath = file.path;
        const fileName = file.filename;
        const originalName = file.originalname;
        const fileSize = file.size;
        const mimeType = file.mimetype;

        // Read file data
        const fileBuffer = await fs.readFile(filePath);
        
        // Upload to Supabase Storage
        const bucketName = 'project-files';
        const storagePath = `${projectId || 'general'}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabaseStorage
          .storage
          .from(bucketName)
          .upload(storagePath, fileBuffer, {
            contentType: mimeType,
            upsert: false
          });

        if (uploadError) {
          errors.push({ file: originalName, error: uploadError.message });
          await fs.unlink(filePath);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabaseStorage
          .storage
          .from(bucketName)
          .getPublicUrl(storagePath);

        // Create thumbnail for images
        let thumbnailUrl = null;
        if (mimeType.startsWith('image/')) {
          try {
            const thumbnailBuffer = await sharp(fileBuffer)
              .resize(200, 200, { fit: 'inside' })
              .jpeg({ quality: 80 })
              .toBuffer();

            const thumbnailPath = `${projectId || 'general'}/thumbnails/${fileName}_thumb.jpg`;
            
            const { error: thumbError } = await supabaseStorage
              .storage
              .from(bucketName)
              .upload(thumbnailPath, thumbnailBuffer, {
                contentType: 'image/jpeg',
                upsert: false
              });

            if (!thumbError) {
              const { data: thumbUrlData } = supabaseStorage
                .storage
                .from(bucketName)
                .getPublicUrl(thumbnailPath);
              thumbnailUrl = thumbUrlData.publicUrl;
            }
          } catch (thumbError) {
            logger.warn('Failed to create thumbnail:', thumbError);
          }
        }

        const fileRecord = {
          id: uuidv4(),
          filename: fileName,
          originalName: originalName,
          size: fileSize,
          mimeType: mimeType,
          url: urlData.publicUrl,
          thumbnailUrl: thumbnailUrl,
          projectId: projectId || null,
          description: description || null,
          uploadedBy: req.user.id,
          createdAt: new Date().toISOString()
        };

        uploadedFiles.push(fileRecord);
        await fs.unlink(filePath);

      } catch (fileError) {
        errors.push({ file: file.originalname, error: fileError.message });
        if (file.path) {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            logger.error('Failed to clean up local file:', unlinkError);
          }
        }
      }
    }

    logger.info(`Multiple files uploaded: ${uploadedFiles.length} successful, ${errors.length} errors`);

    res.status(201).json({
      message: 'Files upload completed',
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    logger.error('Multiple upload error:', error);
    
    // Clean up any remaining local files
    if (req.files) {
      for (const file of req.files) {
        if (file.path) {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            logger.error('Failed to clean up local file:', unlinkError);
          }
        }
      }
    }

    res.status(500).json({
      error: 'Internal server error during multiple file upload',
      statusCode: 500
    });
  }
});

// Delete file
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { projectId } = req.query;

    const bucketName = 'project-files';
    const storagePath = `${projectId || 'general'}/${filename}`;

    // Delete from Supabase Storage
    const { error: deleteError } = await supabaseStorage
      .storage
      .from(bucketName)
      .remove([storagePath]);

    if (deleteError) {
      logger.error('Supabase storage delete error:', deleteError);
      return res.status(500).json({
        error: 'Failed to delete file from storage',
        statusCode: 500
      });
    }

    // Delete thumbnail if it exists
    const thumbnailPath = `${projectId || 'general'}/thumbnails/${filename}_thumb.jpg`;
    await supabaseStorage
      .storage
      .from(bucketName)
      .remove([thumbnailPath]);

    logger.info(`File deleted: ${filename} by user ${req.user.id}`);

    res.json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({
      error: 'Internal server error during file deletion',
      statusCode: 500
    });
  }
});

// Get file info
router.get('/:filename/info', async (req, res) => {
  try {
    const { filename } = req.params;
    const { projectId } = req.query;

    const bucketName = 'project-files';
    const storagePath = `${projectId || 'general'}/${filename}`;

    // Get file info from Supabase Storage
    const { data: fileData, error: fileError } = await supabaseStorage
      .storage
      .from(bucketName)
      .list(projectId || 'general', {
        search: filename
      });

    if (fileError || !fileData || fileData.length === 0) {
      return res.status(404).json({
        error: 'File not found',
        statusCode: 404
      });
    }

    const file = fileData[0];
    const { data: urlData } = supabaseStorage
      .storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    res.json({
      file: {
        name: file.name,
        size: file.metadata?.size || 0,
        lastModified: file.updated_at,
        url: urlData.publicUrl
      }
    });
  } catch (error) {
    logger.error('Get file info error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// List files for project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const bucketName = 'project-files';

    const { data: files, error } = await supabaseStorage
      .storage
      .from(bucketName)
      .list(projectId, {
        limit: 100,
        offset: 0
      });

    if (error) {
      logger.error('Error listing project files:', error);
      return res.status(500).json({
        error: 'Failed to list project files',
        statusCode: 500
      });
    }

    const fileList = files.map(file => {
      const { data: urlData } = supabaseStorage
        .storage
        .from(bucketName)
        .getPublicUrl(`${projectId}/${file.name}`);

      return {
        name: file.name,
        size: file.metadata?.size || 0,
        lastModified: file.updated_at,
        url: urlData.publicUrl
      };
    });

    res.json({
      files: fileList
    });
  } catch (error) {
    logger.error('List project files error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;