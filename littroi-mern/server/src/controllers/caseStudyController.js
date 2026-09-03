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
    res.json({ success: true, message: "Case study deleted" });
  } catch (error) {
    next(error);
  }
};
