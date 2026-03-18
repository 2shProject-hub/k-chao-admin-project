
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import AdminAccountManagement from './components/AdminAccountManagement';
import Layout from './components/Layout';
import { DescriptionProvider } from './components/descriptions';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import GroupManagement from './components/GroupManagement';
import CourseAssignment from './components/learning/CourseAssignment';
import ProgramManagement from './components/learning/ProgramManagement';
import ContentManagement from './components/learning/ContentManagement';
import TemplateManagement from './components/learning/TemplateManagement';
import PushManagement from './components/PushManagement';
import MemberStats from './components/MemberStats';
import AdminPermissions from './components/AdminPermissions';
import SubscriptionStats from './components/SubscriptionStats';
import CouponManagement from './components/CouponManagement';
import GiftCardManagement from './components/GiftCardManagement';
import RewardStatus from './components/RewardStatus';
import RewardManagement from './components/RewardManagement';
import FAQManagement from './components/FAQManagement';
import AppVersionManagement from './components/AppVersionManagement';
import TermsManagement from './components/TermsManagement';
import InquiryManagement from './components/InquiryManagement';
import AdminAccountSettings from './components/AdminAccountSettings';
import SystemLogManagement from './components/SystemLogManagement';
import SettlementManagement from './components/SettlementManagement';
import TeacherManagement from './components/TeacherManagement';
import StudentAssignment from './components/StudentAssignment';
import StudyGroupManagement from './components/StudyGroupManagement';
import AIRoleplayManagement from './components/ai/AIRoleplayManagement';
import AIPhotoManagement from './components/ai/AIPhotoManagement';
import AIFreeTalkManagement from './components/ai/AIFreeTalkManagement';
import AIMissionManagement from './components/ai/AIMissionManagement';

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    const isIdValid = id.length >= 4 && !/^\d+$/.test(id);
    const isPwValid = password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password);

    if (!isIdValid) return '아이디는 4자 이상이며 숫자만 단독으로 사용할 수 없습니다.';
    if (!isPwValid) return '비밀번호는 영문과 숫자를 포함하여 6자 이상이어야 합니다.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* 좌측: 로그인 폼 영역 */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(8,112,184,0.06)] w-full max-w-md p-12 relative overflow-hidden border border-slate-100">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform rotate-12 shadow-sm">
              <span className="text-blue-600 font-black text-4xl -rotate-12">K</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">K-Chao 관리자</h1>
            <p className="text-slate-400 mt-2 font-bold italic text-sm tracking-widest">K-Chao Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Access ID</label>
              <input
                type="text"
                value={id}
                onChange={e => { setId(e.target.value); setError(''); }}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                placeholder="영문/숫자 조합 4자 이상"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Security Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                placeholder="영문+숫자 포함 6자 이상"
              />
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-xl flex items-center space-x-3 border border-red-100">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-500 text-[11px] font-black">{error}</p>
              </div>
            )}

            <button type="submit" className="w-full py-5 bg-[#2563EB] text-white rounded-2xl font-black text-lg hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-100">
              로그인
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center text-[10px] text-slate-300 font-black tracking-[0.3em] uppercase">
            K-Study Management Portal
          </div>
        </div>
      </div>

      {/* 우측: 화면소개 사이드바 (그램1.png 스타일) - 나중에 내용을 추가할 예정이므로 현재는 숨김 처리 */}
      <div className="hidden w-[400px] bg-[#165a72] text-white p-12 flex-col relative overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">
        {/* 미세한 배경 패턴 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" /></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <div className="mb-12">
            <h2 className="text-3xl font-black tracking-tight mb-2">Description</h2>
            <div className="w-12 h-1.5 bg-sky-400 rounded-full"></div>
          </div>

          <div className="space-y-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <section className="group">
              <h3 className="text-lg font-black text-sky-300 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mr-3"></span>
                계정 인증 규칙
              </h3>
              <ul className="text-sm text-sky-50/70 space-y-2 font-semibold">
                <li className="flex items-start">
                  <span className="text-sky-400 mr-2">•</span>
                  <span>ID: 영문/숫자 조합 4자 이상 (숫자만 사용 불가)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-2">•</span>
                  <span>PW: 영문+숫자 포함 6자 이상 필수</span>
                </li>
              </ul>
            </section>

            <section className="group">
              <h3 className="text-lg font-black text-sky-300 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mr-3"></span>
                보안 정책
              </h3>
              <ul className="text-sm text-sky-50/70 space-y-2 font-semibold">
                <li className="flex items-start">
                  <span className="text-sky-400 mr-2">•</span>
                  <span>최초 로그인 시 비밀번호 변경 강제화 프로세스 적용</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-2">•</span>
                  <span>세션 타임아웃 및 다중 접속 제어 로직 구현</span>
                </li>
              </ul>
            </section>

            <section className="group">
              <h3 className="text-lg font-black text-sky-300 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mr-3"></span>
                주요 구현 기능
              </h3>
              <ul className="text-sm text-sky-50/70 space-y-2 font-semibold">
                <li className="flex items-start">
                  <span className="text-sky-400 mr-2">•</span>
                  <span>React State를 활용한 실시간 입력값 유효성 검사</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-2">•</span>
                  <span>LocalStorage 기반의 간이 인증 상태 유지 (isAdminAuth)</span>
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-auto pt-8 border-t border-sky-400/20 text-[11px] text-sky-400/50 font-black tracking-widest uppercase">
            <div className="flex justify-between items-center">
              <span>Security Status</span>
              <span className="text-emerald-400">● Encrypted</span>
            </div>
            <p className="mt-4 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isAdminAuth') === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAdminAuth', 'true');
    setIsAuthenticated(true);
    // Simulate: If the user is 'teacher-1', they MUST change password
    setMustChangePassword(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <DescriptionProvider>
      <HashRouter>
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />

            {/* 회원관리 */}
            <Route path="/members/list" element={<MemberManagement mode="ACTIVE" />} />
            <Route path="/members/withdrawn" element={<MemberManagement mode="WITHDRAWN" />} />
            <Route path="/members/dormant" element={<MemberManagement mode="DORMANT" />} />
            <Route path="/members/groups" element={<GroupManagement />} />
            <Route path="/assignment/classes" element={<StudyGroupManagement />} />
            <Route path="/assignment/course" element={<CourseAssignment />} />
            <Route path="/learning/programs" element={<ProgramManagement />} />
            <Route path="/learning/teachers" element={<TeacherManagement />} />
            <Route path="/learning/students" element={<StudentAssignment />} />
            <Route path="/learning/contents" element={<ContentManagement />} />
          <Route path="/learning/templates" element={<TemplateManagement />} />
          
          {/* AI Learning */}
          <Route path="/ai/mission" element={<AIMissionManagement />} />
          <Route path="/ai/roleplay" element={<AIRoleplayManagement />} />
          <Route path="/ai/photo" element={<AIPhotoManagement />} />
          <Route path="/ai/freetalk" element={<AIFreeTalkManagement />} />

          <Route path="/finance/settlement" element={<SettlementManagement />} />
            <Route path="/finance/coupons" element={<CouponManagement />} />
            <Route path="/finance/giftcards" element={<GiftCardManagement />} />
            <Route path="/push" element={<PushManagement />} />
            <Route path="/rewards/status" element={<RewardStatus />} />
            <Route path="/rewards/manage" element={<RewardManagement />} />
            <Route path="/boards/inquiries" element={<InquiryManagement />} />
            <Route path="/boards/faq" element={<FAQManagement />} />
            <Route path="/boards/terms" element={<TermsManagement />} />

            {/* System Management */}
            <Route path="/system/admin-accounts" element={<AdminAccountManagement />} />
            <Route path="/system/versions" element={<AppVersionManagement />} />
            <Route path="/system/logs" element={<SystemLogManagement />} />
            <Route path="/stats/subscriptions" element={<SubscriptionStats />} />
            <Route path="/stats/users" element={<MemberStats />} />
            <Route path="/system/permissions" element={<AdminPermissions />} />
            <Route path="/personal/account" element={<AdminAccountSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>

        {mustChangePassword && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <ShieldAlert size={40} className="text-amber-500 -rotate-3" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">비밀번호 변경 필요</h2>
              <p className="text-slate-500 font-medium mb-8">
                보안 정책에 따라 <span className="font-bold text-slate-800">최초 로그인 시 비밀번호 변경</span>이 필수입니다. 현재 비밀번호를 변경해주세요.
              </p>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="새 비밀번호 입력"
                  className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                />
                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                />
                <button
                  onClick={() => {
                    alert('비밀번호가 성공적으로 변경되었습니다. 이제 대시보드를 이용하실 수 있습니다.');
                    setMustChangePassword(false);
                  }}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                >
                  비밀번호 변경 및 완료
                </button>
              </div>
            </div>
          </div>
        )}
      </HashRouter>
    </DescriptionProvider>
  );
};

export default App;
