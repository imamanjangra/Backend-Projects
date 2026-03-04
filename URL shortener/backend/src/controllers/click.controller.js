import { Click } from "../model/click.model.js";
import mongoose from "mongoose";
export const Urlstats = async (req, res) => {
  try {
const year = new Date().getFullYear();
const stats = await Click.aggregate([
  {
    $match: {
      urlId: new mongoose.Types.ObjectId(req.params.id)
    }
  },
  {
    $facet: {
      totalClicks: [
        { $count: "count" }
      ],
      browserStats: [
        {
          $group: {
            _id: "$browser",
            count: { $sum: 1 }
          }
        }
      ],
      osStats: [
        {
          $group: {
            _id: "$os",
            count: { $sum: 1 }
          }
        }
      ],
      deviceStats: [
        {
          $group: {
            _id: "$device",
            count: { $sum: 1 }
          }
        }
      ],
      cpuStats : [
        {
            $group : {
                _id : "$cpu",
                count : {$sum : 1}
            }
        }
      ],
      totalMonthlystats : [
        {
          $match : {
            createdAt : {
              $gte : new Date(year , 0 , 1),
              $lte : new Date(year , 11 , 31)
            }
          }
        },
        {
          $group : {
            _id : {$month : "$createdAt"},
            totalClicks : {$sum : 1}
          }
        },
        {
          $sort : {
            _id : 1
          }
        }
      ]
    }
  }
]);
  const result = stats[0];
  return res.status(200).json({
    totalClicks : result.totalClicks[0]?.count || 0,
    browserStats : result.browserStats,
    osStats : result.osStats,
    deviceStats : result.deviceStats,
    cpuStats : result.cpuStats,
    totalMonthlystats : result.totalMonthlystats,
  })
  } catch (error) {
    return res.status(500).json({message : "somthing went wrong " , error : error.message , stack : error.stack})
  }
};

