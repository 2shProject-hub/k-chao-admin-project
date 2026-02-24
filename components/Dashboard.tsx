
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Users, TrendingUp, DollarSign } from 'lucide-react';



import { MOCK_USERS, MOCK_ORGANIZATIONS, MOCK_TEACHERS } from './mockData';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: '월', users: 120, revenue: 1400 },
  { name: '화', users: 180, revenue: 2398 },
  { name: '수', users: 320, revenue: 3800 },
  { name: '목', users: 278, revenue: 3908 },
  { name: '금', users: 450, revenue: 4800 },
  { name: '토', users: 590, revenue: 6800 },
  { name: '일', users: 640, revenue: 7300 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Calculate Metrics from Mock Data
  const totalUsers = MOCK_USERS.length;
  const activeUsers = MOCK_USERS.filter(u => u.status === 'ACTIVE').length;
  const newJoinersToday = 12; // Dummy for now as mocks don't have detailed dates for today
  const totalGroups = MOCK_ORGANIZATIONS.length;
  const totalTeachers = MOCK_TEACHERS.length;

  const totalLightning = MOCK_USERS.reduce((acc, cur) => acc + cur.rewardLightning, 0);
  const expiringLightning = MOCK_USERS.reduce((acc, cur) => acc + (cur.expiringLightning || 0), 0);
  const totalFlame = MOCK_USERS.reduce((acc, cur) => acc + cur.rewardFlame, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">TODAY 종합 현황</h1>
          <p className="text-gray-400 text-sm mt-1">오늘 하루 서비스의 주요 지표를 확인하세요.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 shadow-sm">
          기준 시각: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main Stats Rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Members */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12명</span>
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase">전체 회원 수</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{totalUsers.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">활동 회원: <span className="text-blue-600 font-bold">{activeUsers.toLocaleString()}</span></div>
        </div>

        {/* Groups */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/members/groups')}>
          <div className="flex justify-between items-start mb-2">
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase">등록 단체 수</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{totalGroups.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">단체 관리 바로가기 &rarr;</div>
        </div>

        {/* Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/learning/teachers')}>
          <div className="flex justify-between items-start mb-2">
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
              <Users size={20} />
            </div>
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase">등록 교사 수</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{totalTeachers.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">교사 관리 바로가기 &rarr;</div>
        </div>

        {/* Revenue (Mock) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-green-50 p-3 rounded-xl text-green-600">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12.4%</span>
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase">당일 매출</div>
          <div className="text-2xl font-black text-gray-900 mt-1">₫ 18.5M</div>
        </div>
      </div>

      {/* Rewards & Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black mb-6 flex items-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            주간 가입 및 매출 추이
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="space-y-6">
          {/* Reward Stats */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">보상 포인트 현황</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 mr-3">
                    <Users size={16} /> {/* Should be Zap but using imported icon */}
                  </div>
                  <span className="text-sm font-bold text-gray-700">총 번개</span>
                </div>
                <span className="text-lg font-black text-gray-900">{totalLightning.toLocaleString()}</span>
              </div>
              {expiringLightning > 0 && (
                <div className="flex justify-between items-center text-xs px-2 text-red-500 font-bold">
                  <span>└ 7일 내 소멸 예정</span>
                  <span>{expiringLightning.toLocaleString()} 개</span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600 mr-3">
                    <Users size={16} /> {/* Should be Flame */}
                  </div>
                  <span className="text-sm font-bold text-gray-700">총 불꽃</span>
                </div>
                <span className="text-lg font-black text-gray-900">{totalFlame.toLocaleString()}</span>
              </div>
              <button
                onClick={() => navigate('/rewards/status')}
                className="w-full py-2 mt-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                보상 현황 전체보기
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">관리 바로가기</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/learning/teachers')} className="p-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 text-left">
                교사 관리
              </button>
              <button onClick={() => navigate('/learning/students')} className="p-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 text-left">
                학생 배정
              </button>
              <button onClick={() => navigate('/rewards/manage')} className="p-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 text-left">
                보상 정책
              </button>
              <button onClick={() => navigate('/members/groups')} className="p-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 text-left">
                단체 관리
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
