const path = require('path');
const fs = require('fs');
const dataIngestionService = require('../services/dataIngestionService');

/**
 * Upload and process CSV/Excel file
 */
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Set cache in data ingestion service
    const cache = req.app.get('cache');
    dataIngestionService.setCache(cache);

    let result;
    if (fileExt === '.csv') {
      result = await dataIngestionService.processCSV(filePath);
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      result = await dataIngestionService.processExcel(filePath);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Invalidate cache to force refresh (except the uploaded data)
    cache.del('task_stats');
    cache.del('ai_summary');
    cache.del('ai_prediction');

    res.json({
      success: true,
      message: 'Data imported successfully',
      data: result
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};
