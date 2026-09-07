import { ContactEnquiry } from "../models/ContactEnquiry.js";

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, message, source } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and message."
      });
    }

    const enquiry = await ContactEnquiry.create({
      name,
      email,
      phone: phone || "",
      company: company || "",
      message,
      source: source || "website",
      status: "New"
    });

    res.status(201).json({
      success: true,
      message: "Your inquiry has been received. Our team will follow up within 12 hours.",
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, search, page, limit } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const total = await ContactEnquiry.countDocuments(filter);
    let query = ContactEnquiry.find(filter).sort({ createdAt: -1 });

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

      const enquiries = await query;
      return res.json({
        success: true,
        count: enquiries.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        data: enquiries
      });
    }

    const enquiries = await query;
    res.json({
      success: true,
      count: enquiries.length,
      total,
      data: enquiries
    });
  } catch (error) {
    next(error);
  }
};

export const markEnquiryAsRead = async (req, res, next) => {
  try {
    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      { isRead: true, status: "Reviewed" },
      { new: true }
    );
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, isRead } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (isRead !== undefined) updateFields.isRead = isRead;

    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    next(error);
  }
};
