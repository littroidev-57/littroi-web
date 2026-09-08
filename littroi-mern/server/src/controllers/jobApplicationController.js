import { JobApplication } from "../models/JobApplication.js";

export const submitApplication = async (req, res, next) => {
  try {
    const { jobId, jobTitle, name, email, phone, portfolioUrl, resumeUrl, experience, coverLetter } = req.body;

    const trimmedName = (name || "").trim();
    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedJobTitle = (jobTitle || "").trim();
    const trimmedPhone = (phone || "").trim();
    const trimmedPortfolio = (portfolioUrl || "").trim();
    const trimmedResume = (resumeUrl || "").trim();
    const trimmedExperience = (experience || "").trim();
    const trimmedCover = (coverLetter || "").trim();

    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter your full name (minimum 2 characters)."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address (e.g. name@example.com)."
      });
    }

    if (!trimmedJobTitle) {
      return res.status(400).json({
        success: false,
        message: "Please specify the job position you are applying for."
      });
    }

    const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;

    if (!trimmedPhone || trimmedPhone.replace(/\D/g, "").length < 7) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number (minimum 7 digits)."
      });
    }

    if (!trimmedExperience) {
      return res.status(400).json({
        success: false,
        message: "Please select your experience level."
      });
    }

    if (!trimmedResume) {
      return res.status(400).json({
        success: false,
        message: "Resume / CV link is required."
      });
    } else if (!urlRegex.test(trimmedResume)) {
      return res.status(400).json({
        success: false,
        message: "Resume URL must start with http:// or https:// (e.g. https://drive.google.com/...)."
      });
    }

    // Portfolio URL (optional)
    if (trimmedPortfolio && !urlRegex.test(trimmedPortfolio)) {
      return res.status(400).json({
        success: false,
        message: "Portfolio URL must start with http:// or https:// (e.g. https://vimeo.com/...)."
      });
    }

    const application = await JobApplication.create({
      jobId: jobId || null,
      jobTitle: trimmedJobTitle,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      portfolioUrl: trimmedPortfolio,
      resumeUrl: trimmedResume,
      experience: trimmedExperience,
      coverLetter: trimmedCover,
      status: "New",
      isRead: false
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully! Our talent team will review your reel and experience.",
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const { status, search, jobId, page, limit } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (jobId) {
      filter.jobId = jobId;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { portfolioUrl: { $regex: search, $options: "i" } }
      ];
    }

    const total = await JobApplication.countDocuments(filter);
    let query = JobApplication.find(filter).sort({ createdAt: -1 });

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

      const applications = await query;
      return res.json({
        success: true,
        count: applications.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        data: applications
      });
    }

    const applications = await query;
    res.json({
      success: true,
      count: applications.length,
      total,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, isRead } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (isRead !== undefined) updateFields.isRead = isRead;

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Job application not found" });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Job application not found" });
    }

    res.json({ success: true, message: "Job application deleted successfully" });
  } catch (error) {
    next(error);
  }
};
