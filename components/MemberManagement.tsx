
import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { User, UserType, LoginMethod, UserStatus, RewardHistory } from '../types';
import { ICON_MAP } from '../constants';
import { Chrome, Facebook, Apple, Calendar, X, ChevronLeft, ChevronRight, Zap, Flame } from 'lucide-react';
import { MOCK_USERS, MOCK_TEACHERS, MOCK_ORGANIZATIONS, generateMockRewardHistory } from './mockData';
import { getMockRewardTransactions, getMockLearningHistory } from './mockDataHelpers';

interface MemberManagementProps {
  mode: UserStatus;
}



const MemberDetailModal = ({ user, onClose }: { user: User; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'BASIC' | 'LEARNING' | 'REWARD'>('BASIC');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Data
  const rewardTransactions = useMemo(() => getMockRewardTransactions(user.id), [user.id]);
  const learningHistory = useMemo(() => getMockLearningHistory(user.id), [user.id]);

  // Reset pagination on tab change
  React.useEffect(() => setPage(1), [activeTab]);

  const teacherName = user.teacherId ? MOCK_TEACHERS.find(t => t.id === user.teacherId)?.name : '-';

  // Pagination Logic
  const getCurrentData = () => {
    if (activeTab === 'REWARD') return rewardTransactions;
    if (activeTab === 'LEARNING') return learningHistory;
    return [];
  };
  const currentData = getCurrentData();
  const paginatedData = currentData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col ring-1 ring-slate-900/5 overflow-hidden">
        {/* Header */}
        <div className="flex-none px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">회원 상세 정보</h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">{user.nickname} <span className="text-slate-300 mx-1">|</span> {user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-none px-6 border-b border-slate-100 bg-white flex space-x-6">
          <button
            onClick={() => setActiveTab('BASIC')}
            className={`py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'BASIC' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            기본 정보
          </button>
          <button
            onClick={() => setActiveTab('LEARNING')}
            className={`py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'LEARNING' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            학습 현황
          </button>
          <button
            onClick={() => setActiveTab('REWARD')}
            className={`py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'REWARD' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            보상 현황
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">
          <div className="max-w-4xl mx-auto">

            {/* TAB: BASIC INFO */}
            {activeTab === 'BASIC' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="text-xs font-bold text-slate-400 mb-6 uppercase flex items-center tracking-wider">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>기본 정보
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">닉네임</label>
                    <div className="font-bold text-slate-800 text-base">{user.nickname}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">회원 계정</label>
                    <div className="font-bold text-slate-800 text-base truncate" title={user.email}>{user.email}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">소속 단체</label>
                    <div className="font-bold text-slate-800 text-base">{user.groupName || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">담당 교사</label>
                    <div className="font-bold text-slate-800 text-base">{teacherName}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">회원 구분</label>
                    <div className="font-bold text-slate-800 text-base">
                      {user.type === 'FREE' ? '무료' : user.type === 'PAID_INDIVIDUAL' ? '개인유료' : '단체유료'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">상태</label>
                    <div className={`font-bold text-base inline-flex items-center ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {user.status === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div>}
                      {user.status === 'ACTIVE' ? '회원' : user.status === 'WITHDRAWN' ? '탈퇴' : '휴면'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">가입일</label>
                    <div className="font-bold text-slate-800 text-base">{user.joinedAt}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">최근 접속</label>
                    <div className="font-bold text-slate-800 text-base">{user.lastLoginAt}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LEARNING STATUS */}
            {activeTab === 'LEARNING' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Current Status Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 mb-6 uppercase flex items-center tracking-wider">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>현재 학습 정보
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="w-24 text-xs font-bold text-slate-500 uppercase">강좌 (Program)</span>
                      <span className="font-bold text-slate-800">한국어 종합 교육 프로그램</span>
                    </div>
                    <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="w-24 text-xs font-bold text-slate-500 uppercase">현재 위치</span>
                      <div className="flex flex-wrap items-center text-sm font-medium text-slate-700">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded mx-1">초급 1</span>
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded mx-1">Unit 3</span>
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded mx-1">Lesson 2</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="block text-xs font-bold text-slate-500 uppercase mb-1">총 진도율</span>
                        <span className="text-2xl font-black text-blue-600">{user.progressRate}%</span>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="block text-xs font-bold text-slate-500 uppercase mb-1">최근 학습일</span>
                        <span className="text-2xl font-black text-slate-700">{user.lastStudyDate || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center tracking-wider">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>일자별 학습 이력
                    </h4>
                  </div>
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">일자</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">학습 내용 (Lesson &gt; Activity)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">학습 시간</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">진도율</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginatedData.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{item.lessonTitle}</span>
                              <span className="text-xs text-slate-500">{item.moduleTitle} &gt; {item.activityTitle}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-slate-600">{item.studyTimeMinutes}분</td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-blue-600">{item.progressRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: REWARD STATUS */}
            {activeTab === 'REWARD' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Summary Cards - Dynamic */}
                <div className="grid grid-cols-2 gap-5">
                  {(() => {
                    const balances = [
                      { category: 'LIGHTNING', amount: user.rewardLightning, expiring: user.expiringLightning || 0 },
                      { category: 'FLAME', amount: user.rewardFlame, expiring: user.expiringFlame || 0 },
                    ];
                    if (user.rewardBalances) {
                      Object.entries(user.rewardBalances).forEach(([cat, val]) => {
                        if (cat !== 'LIGHTNING' && cat !== 'FLAME') {
                          balances.push({ category: cat, amount: val.amount, expiring: val.expiring });
                        }
                      });
                    }

                    return balances.map((b) => {
                      const getRewardIcon = (cat: string) => {
                        if (cat === 'LIGHTNING') return ICON_MAP['Zap'];
                        if (cat === 'FLAME') return ICON_MAP['Flame'];
                        const pascal = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
                        return ICON_MAP[pascal] || ICON_MAP[cat] || ICON_MAP['Gift'];
                      };
                      const IconCmp = getRewardIcon(b.category);

                      // Theme Logic
                      let theme = { bg: 'from-indigo-50 to-blue-50', border: 'border-indigo-100', text: 'text-indigo-600', icon: 'text-indigo-500', ring: 'ring-indigo-100' };
                      if (b.category === 'LIGHTNING') theme = { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-100', text: 'text-amber-600', icon: 'text-amber-500', ring: 'ring-amber-100' };
                      if (b.category === 'FLAME') theme = { bg: 'from-orange-50 to-red-50', border: 'border-orange-100', text: 'text-orange-600', icon: 'text-orange-500', ring: 'ring-orange-100' };

                      return (
                        <div key={b.category} className={`bg-gradient-to-br ${theme.bg} p-6 rounded-2xl border ${theme.border} flex items-center space-x-5 shadow-sm`}>
                          <div className={`p-4 bg-white rounded-xl ${theme.icon} shadow-sm ring-1 ${theme.ring}`}>
                            <IconCmp size={28} fill="currentColor" />
                          </div>
                          <div>
                            <div className={`text-xs ${theme.text}/80 font-bold mb-1 uppercase tracking-wider`}>{b.category === 'LIGHTNING' ? '보유 번개' : (b.category === 'FLAME' ? '보유 불꽃' : b.category)}</div>
                            <div className="text-4xl font-black text-slate-800">{b.amount.toLocaleString()}</div>
                            <div className={`text-xs ${theme.text}/60 mt-2 font-medium`}>소멸 예정: {b.expiring}</div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* History Table */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center tracking-wider">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>보상 내역 (획득/사용/소멸)
                    </h4>
                  </div>
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">일시</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">구분</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">보상 종류</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">내용</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">수량</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginatedData.map((item: any) => {
                        const getRewardIcon = (cat: string) => {
                          if (cat === 'LIGHTNING') return ICON_MAP['Zap'];
                          if (cat === 'FLAME') return ICON_MAP['Flame'];
                          const pascal = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
                          return ICON_MAP[pascal] || ICON_MAP[cat] || ICON_MAP['Gift'];
                        };
                        const IconCmp = getRewardIcon(item.category);
                        const isLightning = item.category === 'LIGHTNING';
                        const isFlame = item.category === 'FLAME';
                        const iconColor = isLightning ? 'text-amber-500' : (isFlame ? 'text-orange-500' : 'text-indigo-500');

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold
                                                ${item.type === 'ACQUIRED' ? 'bg-emerald-100 text-emerald-700' :
                                  item.type === 'USED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                {item.type === 'ACQUIRED' ? '획득' : item.type === 'USED' ? '사용' : '소멸'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                              <div className="flex items-center">
                                <IconCmp size={14} className={`${iconColor} mr-1 fill-current`} />
                                {isLightning ? '번개' : (isFlame ? '불꽃' : item.category)}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{item.description}</td>
                            <td className={`px-6 py-4 text-right text-sm font-bold ${item.type === 'ACQUIRED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {item.type === 'ACQUIRED' ? '+' : '-'}{item.amount}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Footer / Pagination for History Tabs */}
        {activeTab !== 'BASIC' && (
          <div className="flex-none flex items-center justify-between p-4 bg-slate-50 border-t border-slate-200">
            <div className="text-xs text-slate-500 font-medium">
              총 <span className="font-bold text-slate-700">{currentData.length}</span>건
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-500 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-bold text-slate-600 px-2">{page} / {totalPages || 1}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-500 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MemberManagement: React.FC<MemberManagementProps> = ({ mode }) => {
  const today = new Date().toISOString().split('T')[0];
  const ninetyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 90)).toISOString().split('T')[0];

  const [searchParams, setSearchParams] = useState({
    nickname: '',
    loginMethod: 'ALL',
    userType: 'ALL',
    organizationId: 'ALL', // New Filter
    teacherId: 'ALL',      // New Filter
    startDate: ninetyDaysAgo,
    endDate: today
  });

  const [appliedParams, setAppliedParams] = useState(searchParams);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Available Teachers based on selected Organization
  const availableTeachers = useMemo(() => {
    if (searchParams.organizationId === 'ALL') return [];
    return MOCK_TEACHERS.filter(t => t.organizationId === searchParams.organizationId);
  }, [searchParams.organizationId]);

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => {
      if (user.status !== mode) return false;

      const matchNickname = appliedParams.nickname === '' || user.nickname.includes(appliedParams.nickname);
      const matchMethod = appliedParams.loginMethod === 'ALL' || user.loginMethod === appliedParams.loginMethod;
      const matchType = appliedParams.userType === 'ALL' || user.type === appliedParams.userType;

      // Hierarchy Filter Logic
      const matchOrg = appliedParams.organizationId === 'ALL' || user.organizationId === appliedParams.organizationId;
      const matchTeacher = appliedParams.teacherId === 'ALL'
        ? true // If ALL, show all in Org
        : appliedParams.teacherId === 'NONE'
          ? user.teacherId === null || user.teacherId === undefined // Show directly managed
          : user.teacherId === appliedParams.teacherId; // Show specific teacher's

      const joinDate = user.joinedAt;
      const matchDate = joinDate >= appliedParams.startDate && joinDate <= appliedParams.endDate;

      return matchNickname && matchMethod && matchType && matchDate && matchOrg && matchTeacher;
    });
  }, [appliedParams, mode]);

  const getUserTypeLabel = (type: UserType) => {
    switch (type) {
      case 'FREE': return '무료';
      case 'PAID_INDIVIDUAL': return '개인유료';
      case 'PAID_GROUP': return '단체유료';
      default: return '-';
    }
  };

  const getTeacherName = (id?: string | null) => {
    if (!id) return '-';
    const teacher = MOCK_TEACHERS.find(t => t.id === id);
    return teacher ? teacher.name : '-';
  };

  const columns = [
    {
      header: '회원코드',
      accessor: (u: User) => (
        <span
          className="text-blue-600 cursor-pointer hover:underline font-bold"
          onClick={() => setSelectedUser(u)}
        >
          {u.memberCode}
        </span>
      ),
      width: 'w-32'
    },
    {
      header: '닉네임',
      accessor: (u: User) => (
        <span
          className="cursor-pointer hover:text-blue-600 hover:underline font-medium"
          onClick={() => setSelectedUser(u)}
        >
          {u.nickname}
        </span>
      )
    },
    {
      header: '소속', // New Column for Hierarchy
      accessor: (u: User) => (
        <div className="flex flex-col text-xs">
          {u.groupName ? (
            <>
              <span className="font-bold text-gray-700">{u.groupName}</span>
              {u.teacherId ? (
                <span className="text-gray-500">교사: {getTeacherName(u.teacherId)}</span>
              ) : (
                <span className="text-blue-500">단체 직속</span>
              )}
            </>
          ) : '-'}
        </div>
      ),
      width: 'w-36'
    },
    {
      header: '회원 계정', accessor: (u: User) => {
        const provider = u.loginMethod.charAt(0) + u.loginMethod.slice(1).toLowerCase();
        return (
          <div className="flex items-center justify-center space-x-2">
            {u.loginMethod === 'GOOGLE' && <Chrome className="h-3 w-3 text-red-500" />}
            {u.loginMethod === 'FACEBOOK' && <Facebook className="h-3 w-3 text-blue-600" />}
            {u.loginMethod === 'APPLE' && <Apple className="h-3 w-3 text-black" />}
            <span>{provider}</span>
          </div>
        )
      }
    },
    { header: '구분', accessor: (u: User) => getUserTypeLabel(u.type) },
    {
      header: '보유 번개',
      accessor: (u: User) => (
        <div className="flex flex-col text-xs">
          <div className="flex items-center space-x-1">
            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="font-bold">{u.rewardLightning.toLocaleString()}</span>
          </div>
          {(u.expiringLightning || 0) > 0 && (
            <span className="text-red-500 text-[10px]">
              (소멸 {u.expiringLightning})
            </span>
          )}
        </div>
      ),
      width: 'w-24'
    },
    {
      header: '보유 불꽃',  // Added Flame column explicit if not there or ensure it matches
      accessor: (u: User) => (
        <div className="flex flex-col text-xs">
          <div className="flex items-center space-x-1">
            <Flame size={14} className="text-orange-500 fill-orange-500" />
            <span className="font-bold">{u.rewardFlame.toLocaleString()}</span>
          </div>
          {(u.expiringFlame || 0) > 0 && (
            <span className="text-red-500 text-[10px]">
              (소멸 {u.expiringFlame})
            </span>
          )}
        </div>
      ),
      width: 'w-24'
    },
    {
      header: '현재 레벨',
      accessor: (u: User) => (
        <span className="text-sm text-gray-700">{u.currentLevel || '-'}</span>
      ),
      width: 'w-24'
    },
    {
      header: '진도율',
      accessor: (u: User) => (
        <div className="flex items-center space-x-1">
          <span className="text-sm font-bold text-gray-900">{u.progressRate || 0}%</span>
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${u.progressRate || 0}%` }}
            ></div>
          </div>
        </div>
      ),
      width: 'w-32'
    },
    { header: '가입일시', accessor: 'joinedAt' as keyof User },
    ...(mode === 'ACTIVE' ? [{ header: '최근 접속일시', accessor: 'lastLoginAt' as keyof User }] : []),
    ...(mode === 'WITHDRAWN' ? [{ header: '탈퇴일시', accessor: 'withdrawnAt' as keyof User }] : []),
    ...(mode === 'DORMANT' ? [{ header: '휴면일시', accessor: 'dormantAt' as keyof User }] : []),
  ];

  const renderFilter = (
    <div className="flex flex-col text-xs space-y-2">
      {/* Hierarchy Filter */}
      <div className="flex border-b border-gray-200">
        <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">소속 단체</div>
        <div className="flex-1 p-2 border-r border-gray-200">
          <select
            className="w-full h-8 px-2 border border-gray-300 rounded focus:outline-none"
            value={searchParams.organizationId}
            onChange={e => setSearchParams({ ...searchParams, organizationId: e.target.value, teacherId: 'ALL' })}
          >
            <option value="ALL">전체</option>
            {MOCK_ORGANIZATIONS.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
        <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">담당 교사</div>
        <div className="flex-1 p-2">
          <select
            className="w-full h-8 px-2 border border-gray-300 rounded focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            value={searchParams.teacherId}
            onChange={e => setSearchParams({ ...searchParams, teacherId: e.target.value })}
            disabled={searchParams.organizationId === 'ALL'}
          >
            <option value="ALL">전체</option>
            <option value="NONE">담당 교사 없음 (단체 직속)</option>
            {availableTeachers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">계정 구분</div>
        <div className="flex-1 p-2 border-r border-gray-200">
          <select
            className="w-full h-8 px-2 border border-gray-300 rounded focus:outline-none"
            value={searchParams.loginMethod}
            onChange={e => setSearchParams({ ...searchParams, loginMethod: e.target.value })}
          >
            <option value="ALL">전체</option>
            <option value="GOOGLE">Google</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="APPLE">Apple</option>
          </select>
        </div>
        <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">회원 구분</div>
        <div className="flex-1 p-2">
          <select
            className="w-full h-8 px-2 border border-gray-300 rounded focus:outline-none"
            value={searchParams.userType}
            onChange={e => setSearchParams({ ...searchParams, userType: e.target.value })}
          >
            <option value="ALL">전체</option>
            <option value="FREE">무료</option>
            <option value="PAID_INDIVIDUAL">개인유료</option>
            <option value="PAID_GROUP">단체유료</option>
          </select>
        </div>
      </div>
      <div className="flex border-b border-gray-200">
        <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">가입 일시</div>
        <div className="flex-1 p-2 flex items-center space-x-2 border-r border-gray-200">
          <input
            type="date"
            className="h-8 px-2 border border-gray-300 rounded focus:outline-none flex-1"
            value={searchParams.startDate}
            min={ninetyDaysAgo}
            max={today}
            onChange={e => setSearchParams({ ...searchParams, startDate: e.target.value })}
          />
          <span>~</span>
          <input
            type="date"
            className="h-8 px-2 border border-gray-300 rounded focus:outline-none flex-1"
            value={searchParams.endDate}
            min={ninetyDaysAgo}
            max={today}
            onChange={e => setSearchParams({ ...searchParams, endDate: e.target.value })}
          />
        </div>
        <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">닉네임</div>
        <div className="flex-1 p-2">
          <input
            type="text"
            placeholder="닉네임 입력"
            className="w-full h-8 px-3 border border-gray-300 rounded focus:outline-none"
            value={searchParams.nickname}
            onChange={e => setSearchParams({ ...searchParams, nickname: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const titles = { ACTIVE: '회원 현황', WITHDRAWN: '탈퇴 회원', DORMANT: '휴면 회원' };
  const breadcrumbs = { ACTIVE: '회원 관리 > 회원 현황', WITHDRAWN: '회원 관리 > 탈퇴 회원', DORMANT: '회원 관리 > 휴면 회원' };

  return (
    <>
      <DataList
        title={titles[mode]}
        breadcrumb={breadcrumbs[mode]}
        data={filteredUsers}
        columns={columns}
        renderFilter={renderFilter}
        onSearch={() => setAppliedParams(searchParams)}
        onReset={() => {
          const reset = { nickname: '', loginMethod: 'ALL', userType: 'ALL', startDate: ninetyDaysAgo, endDate: today, organizationId: 'ALL', teacherId: 'ALL' };
          setSearchParams(reset);
          setAppliedParams(reset);
        }}
      />

      {selectedUser && (
        <MemberDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </>
  );
};

export default MemberManagement;
