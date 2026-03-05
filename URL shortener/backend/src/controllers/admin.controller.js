import { User } from "../model/user.model.js";

import { URL } from "../model/url.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const [userStats, urlStats] = await Promise.all([
      User.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            monthly: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(year, 0, 1),
                    $lt: new Date(year + 1, 0, 1),
                  },
                },
              },
              {
                $group: {
                  _id: { $month: "$createdAt" },
                  total: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ]),
      URL.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            monthly: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(year, 0, 1),
                    $lt: new Date(year + 1, 0, 1),
                  },
                },
              },
              {
                $group: {
                  _id: { $month: "$createdAt" },
                  total: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ]),
    ]);

    const userResult = userStats[0];
    const urlResult = urlStats[0];

    return res.status(200).json({
      totalUser: userResult.total[0]?.count || 0,
      monthlyUser: userResult.monthly,
      totalUrl: urlResult.total[0]?.count || 0,
      monthlyUrl: urlResult.monthly,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const TotalUser = async (req, res) => {
  try {
    const user = await User.find()
      .sort({ createdAt: -1 })
      .select("-password -refreshToken");

    return res.status(200).json({ user, count: user.length });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const TotalURL = async (req, res) => {
  try {
    const url = await URL.find()
      .sort({ createdAt: -1 })
     

    return res.status(200).json({ url, count: url.length });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};


export const updateUserInfo = async (req, res) => {
  try {
    const { FullName, email } = req.body;

    if (!FullName && !email) {
      return res.status(401).json({ message: "Enter data for update " });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          FullName,
          email,
        },
      },
      {
        new: true,
      },
    ).select("-password");

    res.status(200).json({ message: "user detail is update" }, user);
  } catch (error) {
    res.status(400).json({ message: "somthing went wrong" }, error);
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

