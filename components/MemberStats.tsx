
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Search } from 'lucide-react';

// Mock Data matching the image visuals
const joinData = [
  { name: '2026-01-04', count: 2 },
];

const hourlyVisitorData = [
  { hour: '00-04시', visitors: 1.2 },
  { hour: '04-08시', visitors: 0.5 },
  { hour: '08-12시', visitors: 5.5 },
  { hour: '12-16시', visitors: 2.1 },
  { hour: '16-20시', visitors: 1.5 },
  { hour: '20-24시', visitors: 3.2 },
];

const dailyAccessData = [
  { date: '2026-01-02', count: 3 },
  { date: '2026-01-04', count: 2.2 },
  { date: '2026-01-05', count: 1 },
  { date: '2026-01-06', count: 1 },
  { date: '2026-01-07', count: 3.2 },
  { date: '2026-01-08', count: 2.1 },
  { date: '2026-01-09', count: 0.9 },
];

const accountPieData = [
  { name: '구글', value: 1, color: '#1E88E5' },
  { name: '페이스북', value: 1, color: '#1877F2' },
  { name: '애플', value: 0, color: '#4CAF50' },
];

const withdrawalData = [
  { name: '1', count: 0 },
  { name: '2', count: 0 },
  { name: '3', count: 0 },
  { name: '4', count: 0 },
  { name: '5', count: 0 },
];

const MemberStats: React.FC = () => {
  const [startDate, setStartDate] = useState('2026-01-02');
  const [endDate, setEndDate] = useState('2026-01-09');

  return (
    <div className="space-y-6 pb-10">
      {/* Search Header */}
      <div className="bg-white border border-gray-200 p-2 flex items-center space-x-2">
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

      {/* Top Section: Summary & Join Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-[#F1F6FA] p-8 flex flex-col justify-center items-center rounded">
          <div className="grid grid-cols-2 w-full gap-4 text-center">
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase">총 회원 수</p>
              <p className="text-3xl font-bold text-gray-800 tracking-tighter">237</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase">오늘 가입자 수</p>
              <p className="text-3xl font-bold text-gray-800 tracking-tighter">0</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 bg-white border border-gray-200 p-4 rounded min-h-[200px] relative">
          <h3 className="text-xs font-bold text-gray-800 mb-4 text-center uppercase tracking-widest">가입 통계</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={joinData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#F06030" barSize={380} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Section: Hourly Visitors */}
      <div className="bg-white border border-gray-200 p-6 rounded relative">
        <h3 className="text-xs font-bold text-gray-800 mb-6 text-center uppercase tracking-widest">시간대별 앱 접속자 수</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyVisitorData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="hour" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="#FFD2B2" 
                fill="#FFD2B2" 
                fillOpacity={0.8} 
                strokeWidth={0}
                label={{ position: 'top', fontSize: 10, fontWeight: 'bold', fill: '#FF8A3D' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Access Stats */}
      <div className="bg-white border border-gray-200 p-6 rounded relative">
        <h3 className="text-xs font-bold text-gray-800 mb-6 text-center uppercase tracking-widest">일별 접속 통계</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyAccessData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" fill="#FFC107" barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Account Stats & Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account stats pie chart */}
        <div className="bg-white border border-gray-200 p-6 rounded">
          <h3 className="text-xs font-bold text-gray-800 mb-6 text-center uppercase tracking-widest">계정별 가입 통계</h3>
          <div className="flex items-center justify-between">
            <div className="w-1/2 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accountPieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {accountPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-400 font-bold">총</span>
                <span className="text-lg font-bold text-gray-800">2</span>
              </div>
            </div>
            <div className="w-1/2 flex flex-wrap gap-2 justify-center">
              {accountPieData.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] text-gray-500 font-bold">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account detailed count box */}
        <div className="bg-[#F1F6FA] rounded flex items-center justify-around p-8">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-500 mb-2">구글</p>
            <p className="text-2xl font-bold text-gray-800">1</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-gray-500 mb-2">페이스북</p>
            <p className="text-2xl font-bold text-gray-800">1</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-gray-500 mb-2 text-gray-300">애플</p>
            <p className="text-2xl font-bold text-gray-300">0</p>
          </div>
        </div>
      </div>

      {/* Withdrawal Statistics */}
      <div className="bg-white border border-gray-200 p-6 rounded relative">
        <h3 className="text-xs font-bold text-gray-800 mb-6 text-center uppercase tracking-widest">탈퇴 통계</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={withdrawalData}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={true} tickLine={false} />
              <YAxis tick={{fontSize: 10}} axisLine={true} tickLine={false} domain={[0, 5]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MemberStats;
