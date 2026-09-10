import { Project } from "../models/Project.js";

export const getProjects = async (req, res, next) => {
  try {
    const { category, featured, search, page, limit, all } = req.query;
    const filter = all === "true" ? {} : { isActive: true };

    if (category && category !== "all") {
      filter.category = category;
    }
    if (featured === "true") {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Project.countDocuments(filter);
    const sortOptions = req.query.sort === "latest" ? { createdAt: -1 } : { order: 1, createdAt: -1 };
    let query = Project.find(filter).sort(sortOptions);

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

      const projects = await query;
      return res.json({
        success: true,
        count: projects.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        data: projects
      });
    }

    const projects = await query;
    res.json({
      success: true,
      count: projects.length,
      total,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const targetOrder =
      req.body.order !== undefined && req.body.order !== null && !isNaN(Number(req.body.order))
        ? Number(req.body.order)
        : 1;

    const category = req.body.category || "our-projects";

    // Shift all existing projects in this category with order >= targetOrder up by +1
    // so any newly added video automatically becomes #1 (first) on the website
    await Project.updateMany(
      { category, order: { $gte: targetOrder } },
      { $inc: { order: 1 } }
    );

    const project = await Project.create({
      ...req.body,
      order: targetOrder
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const category = req.body.category || existing.category;
    const hasOrderChange =
      req.body.order !== undefined &&
      req.body.order !== null &&
      !isNaN(Number(req.body.order)) &&
      Number(req.body.order) !== existing.order;

    if (hasOrderChange) {
      const oldOrder = existing.order;
      const newOrder = Math.max(1, Number(req.body.order));

      if (category === existing.category) {
        // Shift within this specific category only
        if (newOrder < oldOrder) {
          await Project.updateMany(
            { _id: { $ne: existing._id }, category, order: { $gte: newOrder, $lt: oldOrder } },
            { $inc: { order: 1 } }
          );
        } else if (newOrder > oldOrder) {
          await Project.updateMany(
            { _id: { $ne: existing._id }, category, order: { $gt: oldOrder, $lte: newOrder } },
            { $inc: { order: -1 } }
          );
        }
      } else {
        // Category changed: shift in new category
        await Project.updateMany(
          { _id: { $ne: existing._id }, category, order: { $gte: newOrder } },
          { $inc: { order: 1 } }
        );
      }
      req.body.order = newOrder;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};
