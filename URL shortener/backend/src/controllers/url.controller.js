import { URL } from "../model/url.model.js";
import { nanoid } from "nanoid";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customName } = req.body;

    if (!originalUrl || originalUrl.trim() === "") {
      return res.status(400).json({ message: "Original URL is required" });
    }
    let shortID;
    if (customName && customName.trim() !== "") {
      const trimmedName = customName.trim();

      const existing = await URL.findOne({ shortID: trimmedName });

      if (existing) {
        return res
          .status(400)
          .json({ message: "Custom name is already taken" });
      }

      shortID = trimmedName;
    } else {
      let existing;
      do {
        shortID = nanoid(7);
        existing = await URL.findOne({ shortID });
      } while (existing);
    }

    const newUrl = await URL.create({
      shortID,
      originalUrl: originalUrl.trim(),
      userID: req.user._id,
    });

    return res.status(201).json({
      message: "Short URL created successfully",
      newUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortID } = req.params;

    const urlDoc = await URL.findOne({ shortID });

    // console.log(urlDoc);

    if (!urlDoc) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    urlDoc.totalClicks += 1;
    await urlDoc.save();

    return res.redirect(urlDoc.originalUrl);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyUrl = async (req, res) => {
  try {
    const urls = await URL.find({ userID: req.user._id });

    return res.status(200).json({ urls });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const url = await URL.findById(req.params.id);

    if (!url) {
      return res.status(400).json({ message: "Url is not found " });
    }

    if (url.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: Not your url" });
    }

    await url.deleteOne();

    return res.status(200).json({ message: "URL is deleted succfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "somthing went wrong ",
        error: error.message,
        stuck: error.stack,
      });
  }
};

export const updateUrl = async (req, res) => {
  try {
    const { originalUrl, customName } = req.body;

    if (!originalUrl && !customName) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }


    const url = await URL.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (url.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: Not your URL",
      });
    }

    if (originalUrl && originalUrl.trim() !== "") {
      url.originalUrl = originalUrl.trim();
    }

    if (customName && customName.trim() !== "") {
      const trimmedName = customName.trim();

      const existing = await URL.findOne({ shortID: trimmedName });

      if (existing && existing._id.toString() !== url._id.toString()) {
        return res.status(400).json({
          message: "Custom name is already taken",
        });
      }

      url.shortID = trimmedName;
    }

    await url.save();

    return res.status(200).json({
      message: "URL updated successfully",
      url,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

