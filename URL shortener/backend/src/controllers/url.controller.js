import { URL } from "../model/url.model.js";
import { nanoid } from "nanoid";
import { trackClick } from "../services/tracking.service.js";
import { Click } from "../model/click.model.js";
import QRCode from "qrcode";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customName, qrcode } = req.body;

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

    if (qrcode === true) {
      const shortUrl = `http://localhost:8000/api/v1/url/${shortID}`;
      const qr = await QRCode.toDataURL(shortUrl);
      const newUrl = await URL.create({
        shortID,
        originalUrl: originalUrl.trim(),
        userID: req.user._id,
        Qrcode: qr,
      });
      return res.status(201).json({
        message: "Short URL created successfully",
        newUrl,
      });
    } else {
      const newUrl = await URL.create({
        shortID,
        originalUrl: originalUrl.trim(),
        userID: req.user._id,
      });
      return res.status(201).json({
        message: "Short URL created successfully",
        newUrl,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortID } = req.params;

    const urlDoc = await URL.findOne({ shortID });



    if (!urlDoc) {
      return res.status(404).json({ message: "Short URL not found" });
    }
    await trackClick(urlDoc, req);

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
    return res.status(500).json({
      message: "somthing went wrong ",
      error: error.message,
      stuck: error.stack,
    });
  }
};

export const updateUrl = async (req, res) => {
  try {
    const { originalUrl, customName, qrcode } = req.body;

    if (!originalUrl && !customName && !qrcode) {
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

    if (qrcode === "true") {
      const shortUrl = `http://localhost:8000/api/v1/url/${url.shortID}`;
      const qr = await QRCode.toDataURL(shortUrl);
      url.Qrcode = qr;
    }

    if (qrcode === "false") {
      url.Qrcode = undefined;
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

export const Urlinfo = async (req, res) => {
  try {
    const urlinfo = await Click.find({ urlId: req.params.id });

    if (!urlinfo) {
      return res.status(400).json({ message: "URL information is not found " });
    }

    return res.status(200).json({ urlinfo });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Server error",
        error: error.message,
        stack: error.stack,
      });
  }
};

export const serchUrl = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const url = await URL.find(
      {
        userID: req.user._id, // VERY IMPORTANT (security)
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" }, // relevance score
      },
    ).sort({
      score: { $meta: "textScore" }, // sort by relevance
    });

    return res.status(200).json({
      count: url.length,
      url,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};
