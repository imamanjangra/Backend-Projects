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

