
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Search } from 'lucide-react';

// Mock Data matching the user's request for columns
const MOCK_DATA = [
  { date: '2026-01-02', monthly: 12, yearly: 4, ios: 10, aos: 6 },
  { date: '2026-01-03', monthly: 15, yearly: 2, ios: 9, aos: 8 },
  { date: '2026-01-04', monthly: 8, yearly: 8, ios: 11, aos: 5 },
  { date: '2026-01-05', monthly: 20, yearly: 5, ios: 15, aos: 10 },
  { date: '2026-01-06', monthly: 18, yearly: 3, ios: 12, aos: 9 },
  { date: '2026-01-07', monthly: 22, yearly: 6, ios: 16, aos: 12 },
  { date: '2026-01-08', monthly: 14, yearly: 4, ios: 10, aos: 8 },
  { date: '2026-01-09', monthly: 10, yearly: 2, ios: 7, aos: 5 },
];

const SubscriptionStats: React.FC = () => {
  const [startDate, setStartDate] = useState('2026-01-02');
  const [endDate, setEndDate] = useState('2026-01-09');

  return (
    <div className="space-y-6 pb-10">
      {/* Search Header */}
      <div className="bg-white border border-gray-200 p-2 flex items-center space-x-2 shadow-sm">
        <div className="bg-[#F1F3F6] px-4 py-2 text-sm font-bold border-r border-gray-200">기간 설정</div>
        <div className="flex items-center space-x-2 px-2">
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-8 px-2 border border-gray-300 rounded text-xs focus:outline-none"
          />
          <span className="text-gray-400">~</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-8 px-2 border border-gray-300 rounded text-xs focus:outline-none"
          />
          <button className="flex items-center px-4 py-1.5 bg-[#6DC9C1] text-white rounded text-xs font-bold hover:bg-[#5bb7af] transition-colors ml-2">
            <Search className="mr-1 h-3 w-3" /> 검색
          </button>
        </div>
      </div>

      {/* Subscription Stats Chart */}
      <div className="bg-white border border-gray-200 p-6 rounded shadow-sm relative">
        <h3 className="text-xs font-bold text-gray-800 mb-6 text-center uppercase tracking-widest">구독 통계</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={true} tickLine={false} />
              <YAxis tick={{fontSize: 10}} axisLine={true} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
              <Bar name="월간 구독" dataKey="monthly" fill="#42A5F5" barSize={40} />
              <Bar name="연간 구독" dataKey="yearly" fill="#FFA726" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OS Stats Chart */}
      <div className="bg-white border border-gray-200 p-6 rounded shadow-sm relative">
        <h3 className="text-xs font-bold text-gray-800 mb-6 text-center uppercase tracking-widest">OS별 통계</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={true} tickLine={false} />
              <YAxis tick={{fontSize: 10}} axisLine={true} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
              <Bar name="iOS" dataKey="ios" fill="#78909C" barSize={40} />
              <Bar name="AOS" dataKey="aos" fill="#66BB6A" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-[#F1F3F6] border-t-2 border-gray-800 text-xs font-bold text-gray-700">
            <tr>
              <th className="px-4 py-3 border-r border-gray-200">일자</th>
              <th className="px-4 py-3 border-r border-gray-200">월간 구독</th>
              <th className="px-4 py-3 border-r border-gray-200">연간 구독</th>
              <th className="px-4 py-3 border-r border-gray-200">iOS</th>
              <th className="px-4 py-3">AOS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {MOCK_DATA.map((row, idx) => (
              <tr key={idx} className="text-center text-xs text-gray-600 hover:bg-gray-50 h-10">
                <td className="border-r border-gray-200 font-medium">{row.date}</td>
                <td className="border-r border-gray-200">{row.monthly}</td>
                <td className="border-r border-gray-200">{row.yearly}</td>
                <td className="border-r border-gray-200">{row.ios}</td>
                <td>{row.aos}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200 font-bold text-xs text-gray-800 text-center">
            <tr>
              <td className="px-4 py-3 border-r border-gray-200">합계</td>
              <td className="px-4 py-3 border-r border-gray-200">{MOCK_DATA.reduce((acc, curr) => acc + curr.monthly, 0)}</td>
              <td className="px-4 py-3 border-r border-gray-200">{MOCK_DATA.reduce((acc, curr) => acc + curr.yearly, 0)}</td>
              <td className="px-4 py-3 border-r border-gray-200">{MOCK_DATA.reduce((acc, curr) => acc + curr.ios, 0)}</td>
              <td className="px-4 py-3">{MOCK_DATA.reduce((acc, curr) => acc + curr.aos, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionStats;
