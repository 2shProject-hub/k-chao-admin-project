
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminAccountManagement from './components/AdminAccountManagement';
import Layout from './components/Layout';
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.08)] w-full max-w-md p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform rotate-12">
            <span className="text-blue-600 font-bold text-4xl -rotate-12">K</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">K-Chao 관리자</h1>
          <p className="text-gray-400 mt-2 font-medium italic">K-Chao Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">아이디</label>
            <input
              type="text"
              value={id}
              onChange={e => { setId(e.target.value); setError(''); }}
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-medium"
              placeholder="영문/숫자 조합 4자 이상"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-medium"
              placeholder="영문+숫자 포함 6자 이상"
            />
          </div>
          {error && (
            <div className="bg-red-50 p-3 rounded-xl flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-red-500 text-xs font-bold">{error}</p>
            </div>
          )}
          <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all shadow-xl shadow-blue-100">
            로그인
          </button>
        </form>
        <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          K-Study Management Portal
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isAdminAuth') === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAdminAuth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <HashRouter>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* 회원관리 */}
          <Route path="/members/list" element={<MemberManagement mode="ACTIVE" />} />
          <Route path="/members/withdrawn" element={<MemberManagement mode="WITHDRAWN" />} />
          <Route path="/members/dormant" element={<MemberManagement mode="DORMANT" />} />
          <Route path="/members/groups" element={<GroupManagement />} />
          <Route path="/assignment/course" element={<CourseAssignment />} />
          <Route path="/learning/programs" element={<ProgramManagement />} />
          <Route path="/learning/teachers" element={<TeacherManagement />} />
          <Route path="/learning/students" element={<StudentAssignment />} />
          <Route path="/learning/contents" element={<ContentManagement />} />
          <Route path="/learning/templates" element={<TemplateManagement />} />
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
    </HashRouter>
  );
};

export default App;
