import { ContactEnquiry } from "../models/ContactEnquiry.js";

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and message."
      });
    }

    const enquiry = await ContactEnquiry.create({
      name,
      email,
      company,
      message,
      source: "website"
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
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    next(error);
  }
};

export const markEnquiryAsRead = async (req, res, next) => {
  try {
    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
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

