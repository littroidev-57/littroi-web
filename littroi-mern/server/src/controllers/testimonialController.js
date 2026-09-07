import { Testimonial } from "../models/Testimonial.js";

export const getTestimonials = async (req, res, next) => {
  try {
    const { search, page, limit, all } = req.query;
    const filter = all === "true" ? {} : { isActive: true };

    if (search) {
      filter.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { quote: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Testimonial.countDocuments(filter);
    let query = Testimonial.find(filter).sort({ order: 1, createdAt: -1 });

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

      const testimonials = await query;
      return res.json({
        success: true,
        count: testimonials.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        data: testimonials
      });
    }

    const testimonials = await query;
    res.json({
      success: true,
      count: testimonials.length,
      total,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    // Automatically remove Cloudinary avatar
    if (testimonial.avatar) {
      const { deleteFromCloudinary } = await import("../config/cloudinary.js");
      await deleteFromCloudinary(testimonial.avatar);
    }

    res.json({ success: true, message: "Testimonial and avatar deleted" });
  } catch (error) {
    next(error);
  }
};
