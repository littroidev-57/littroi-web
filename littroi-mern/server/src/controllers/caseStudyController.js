import { CaseStudy } from "../models/CaseStudy.js";

export const getCaseStudies = async (req, res, next) => {
  try {
    const studies = await CaseStudy.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: studies.length, data: studies });
  } catch (error) {
    next(error);
  }
};

export const getCaseStudyBySlug = async (req, res, next) => {
  try {
    const study = await CaseStudy.findOne({ slug: req.params.slug, isPublished: true });
    if (!study) {
      return res.status(404).json({ success: false, message: "Case study not found" });
    }
    res.json({ success: true, data: study });
  } catch (error) {
    next(error);
  }
};

export const createCaseStudy = async (req, res, next) => {
  try {
    const study = await CaseStudy.create(req.body);
    res.status(201).json({ success: true, data: study });
  } catch (error) {
    next(error);
  }
};

export const updateCaseStudy = async (req, res, next) => {
  try {
    const study = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!study) {
      return res.status(404).json({ success: false, message: "Case study not found" });
    }
    res.json({ success: true, data: study });
  } catch (error) {
    next(error);
  }
};

export const deleteCaseStudy = async (req, res, next) => {
  try {
    const study = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!study) {
      return res.status(404).json({ success: false, message: "Case study not found" });
    }

    // Automatically remove Cloudinary assets
    const { deleteFromCloudinary } = await import("../config/cloudinary.js");
    const imagesToDelete = [];
    if (study.coverImage) imagesToDelete.push(study.coverImage);
    if (Array.isArray(study.images)) imagesToDelete.push(...study.images);
    if (imagesToDelete.length > 0) {
      await deleteFromCloudinary(imagesToDelete);
    }

    res.json({ success: true, message: "Case study and associated Cloudinary media deleted" });
  } catch (error) {
    next(error);
  }
};
