const Template = require('../models/Template');

// @desc    Get all templates
// @route   GET /api/templates
// @access  Private
exports.getAllTemplates = async (req, res) => {
  try {
    // By default, show only public templates and templates created by the user
    let query = { 
      $or: [
        { isPublic: true },
        { creator: req.user._id }
      ]
    };

    // Additional filters
    if (req.query.subject) {
      query.subject = req.query.subject;
    }
    if (req.query.language) {
      query.language = req.query.language;
    }
    if (req.query.gradeLevel) {
      query.gradeLevel = req.query.gradeLevel;
    }

    const templates = await Template.find(query)
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });

    res.json(templates);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all templates created by the logged-in user
// @route   GET /api/templates/my
// @access  Private
exports.getMyTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ creator: req.user._id })
      .sort({ createdAt: -1 });

    res.json(templates);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Private
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate('creator', 'name email');

    if (!template) {
      return res.status(404).json({
        message: 'Template not found'
      });
    }

    // Check if the template is public or belongs to the requesting user
    if (template.isPublic || template.creator._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
      res.json(template);
    } else {
      res.status(403).json({
        message: 'Not authorized to access this template'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create a new template
// @route   POST /api/templates
// @access  Private/Teacher or Admin
exports.createTemplate = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      gradeLevel,
      language,
      components,
      isPublic
    } = req.body;

    const template = await Template.create({
      title,
      description,
      creator: req.user._id,
      subject,
      gradeLevel,
      language: language || req.user.preferredLanguage || 'en',
      components,
      isPublic: isPublic !== undefined ? isPublic : false
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update a template
// @route   PUT /api/templates/:id
// @access  Private
exports.updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        message: 'Template not found'
      });
    }

    // Check if the user is authorized to update the template
    if (template.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to update this template'
      });
    }

    const {
      title,
      description,
      subject,
      gradeLevel,
      language,
      components,
      isPublic
    } = req.body;

    // Update fields
    template.title = title || template.title;
    template.description = description || template.description;
    template.subject = subject || template.subject;
    template.gradeLevel = gradeLevel || template.gradeLevel;
    template.language = language || template.language;
    template.components = components || template.components;
    
    // Only update isPublic if explicitly provided
    if (isPublic !== undefined) {
      template.isPublic = isPublic;
    }

    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete a template
// @route   DELETE /api/templates/:id
// @access  Private
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        message: 'Template not found'
      });
    }

    // Check if the user is authorized to delete the template
    if (template.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to delete this template'
      });
    }

    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template removed' });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
