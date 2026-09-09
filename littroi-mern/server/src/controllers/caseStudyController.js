import { CaseStudy } from "../models/CaseStudy.js";

export const getCaseStudies = async (req, res, next) => {
  try {
    const { category, search, page, limit, all } = req.query;
    const filter = all === "true" ? {} : { isPublished: true };

    if (category && category !== "all") {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }

    const total = await CaseStudy.countDocuments(filter);
    let query = CaseStudy.find(filter).sort({ createdAt: -1 });

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

      const studies = await query;
      return res.json({
        success: true,
        count: studies.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        data: studies
      });
    }

    const studies = await query;
    res.json({
      success: true,
      count: studies.length,
      total,
      data: studies
    });
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
    if (study.beforeImage) imagesToDelete.push(study.beforeImage);
    if (study.afterImage) imagesToDelete.push(study.afterImage);
    if (Array.isArray(study.images)) imagesToDelete.push(...study.images);
    if (Array.isArray(study.beforeAfter)) {
      study.beforeAfter.forEach((p) => {
        if (p.beforeImage) imagesToDelete.push(p.beforeImage);
        if (p.afterImage) imagesToDelete.push(p.afterImage);
      });
    }
    if (imagesToDelete.length > 0) {
      await deleteFromCloudinary(imagesToDelete);
    }

    res.json({ success: true, message: "Case study and associated Cloudinary media deleted" });
  } catch (error) {
    next(error);
  }
};
