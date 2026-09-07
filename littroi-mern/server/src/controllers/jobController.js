import { Job } from "../models/Job.js";

export const getJobs = async (req, res, next) => {
  try {
    const { department, search, page, limit, all } = req.query;
    const filter = all === "true" ? {} : { isActive: true };

    if (department && department !== "all") {
      filter.department = department;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Job.countDocuments(filter);
    let query = Job.find(filter).sort({ createdAt: -1 });

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

      const jobs = await query;
      return res.json({
        success: true,
        count: jobs.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        data: jobs
      });
    }

    const jobs = await query;
    res.json({
      success: true,
      count: jobs.length,
      total,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    next(error);
  }
};
