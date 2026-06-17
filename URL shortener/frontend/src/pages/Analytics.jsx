import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MousePointerClick, TrendingUp, Link as LinkIcon } from "lucide-react";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);


  
  // Mocking Analytics since the backend doesn't have a time-series endpoint yet
  useEffect(() => {
    setTimeout(() => {
      setData([
        { name: 'Mon', clicks: 12 },
        { name: 'Tue', clicks: 28 },
        { name: 'Wed', clicks: 15 },
        { name: 'Thu', clicks: 45 },
        { name: 'Fri', clicks: 70 },
        { name: 'Sat', clicks: 55 },
        { name: 'Sun', clicks: 30 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy mb-2">Analytics</h1>
          <p className="text-gray-500">Track how your links are performing over time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border shadow-sm rounded-xl">
           <CardContent className="p-6">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Clicks</p>
                    <h3 className="text-3xl font-bold text-navy">255</h3>
                 </div>
                 <div className="p-3 bg-orange-50 rounded-lg">
                    <MousePointerClick className="w-6 h-6 text-orange" />
                 </div>
              </div>
           </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm rounded-xl">
           <CardContent className="p-6">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Links</p>
                    <h3 className="text-3xl font-bold text-navy">24</h3>
                 </div>
                 <div className="p-3 bg-navy/5 rounded-lg">
                    <LinkIcon className="w-6 h-6 text-navy" />
                 </div>
              </div>
           </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-xl">
           <CardContent className="p-6">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">CTR Growth</p>
                    <h3 className="text-3xl font-bold text-navy">+12%</h3>
                 </div>
                 <div className="p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>

      <Card className="col-span-full border-border shadow-sm rounded-xl">
        <CardHeader className="border-b border-gray-100 pb-5">
          <CardTitle>Engagements over time</CardTitle>
          <CardDescription>Click volume across all your active short links</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-100 w-full">
            {loading ? (
               <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium">Loading chart data...</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#718096'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#718096'}} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#ee6123" 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                      activeDot={{ r: 6, fill: '#ee6123' }}
                    />
                </LineChart>
                </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
