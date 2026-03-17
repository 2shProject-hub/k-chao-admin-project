
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, LogOut, Menu, UserCircle, Bell, Globe } from 'lucide-react';
import { NAVIGATION, ICON_MAP } from '../constants';
import { MenuItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const findActiveMenu = (pathname: string, items: MenuItem[], parent?: MenuItem): { item: MenuItem; parent?: MenuItem } | null => {
  for (const item of items) {
    if (item.path === pathname) {
      return { item, parent };
    }
    if (item.children) {
      const found = findActiveMenu(pathname, item.children, item);
      if (found) return found;
    }
  }
  return null;
};

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['members', 'learning', 'finance']);
  const [language, setLanguage] = useState<'ko' | 'vn'>('ko');
  const location = useLocation();

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const NavItem: React.FC<{ item: MenuItem; depth?: number }> = ({ item, depth = 0 }) => {
    const Icon = item.icon ? ICON_MAP[item.icon] : null;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = location.pathname === item.path;

    return (
      <div>
        {item.path ? (
          <Link
            to={item.path}
            className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${isActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-gray-800'
              } ${depth > 0 ? 'pl-10 text-xs' : ''}`}
          >
            {Icon && <Icon className="mr-3 h-4 w-4" />}
            {item.label}
          </Link>
        ) : (
          <button
            onClick={() => toggleMenu(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors ${depth > 0 ? 'pl-10' : ''}`}
          >
            <span className="flex items-center">
              {Icon && <Icon className="mr-3 h-4 w-4" />}
              {item.label}
            </span>
            {hasChildren && (isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
          </button>
        )}
        {hasChildren && isExpanded && (
          <div className="bg-black/20">
            {item.children?.map(child => (
              <NavItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden">
      {/* Sidebar - Dark theme for standard admin feel */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-[#1E293B] transition-all duration-300 overflow-y-auto z-30 shrink-0`}>
        <div className="p-5 border-b border-gray-700 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-black">K</span>
          </div>
          <span className="text-sm font-bold text-white tracking-tight uppercase">Korean Admin</span>
        </div>
        <nav className="mt-2 pb-10">
          {NAVIGATION.map(item => <NavItem key={item.id} item={item} />)}
        </nav>
      </aside>

      {/* Main Content + Description Sidebar Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Column: Header + Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-100 rounded">
              <Menu className="h-5 w-5 text-gray-500" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
                <Globe className="h-4 w-4 text-gray-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ko' | 'vn')}
                  className="text-xs font-bold text-gray-600 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="ko">한국어</option>
                  <option value="vn">Tiếng Việt</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">슈퍼 관리자</span>
                <span className="text-xs font-semibold text-gray-700">admin01</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors text-xs font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-5 pb-20">
            {(() => {
              const activeInfo = findActiveMenu(location.pathname, NAVIGATION);
              if (activeInfo && activeInfo.item.path !== '/') {
                const { item, parent } = activeInfo;
                const title = item.label;
                const breadcrumb = parent ? `${parent.label} > ${item.label}` : item.label;

                return (
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{breadcrumb}</div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            {children}
          </main>
        </div>

        {/* Right Sidebar: Description (그램1.png 스타일 고도화) - 나중에 내용을 추가할 예정이므로 현재는 숨김 처리 */}
        <aside className="hidden w-[320px] bg-[#165a72] text-white flex-col shrink-0 overflow-hidden border-l border-white/5 shadow-[-10px_0_40px_rgba(0,0,0,0.1)]">
          <div className="p-8 border-b border-white/10 bg-[#124d61]">
            <h2 className="text-2xl font-black tracking-tight mb-2">Description</h2>
            <div className="w-10 h-1 bg-sky-400 rounded-full"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-sidebar-scroll space-y-8">
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-16 h-16 border-2 border-dashed border-sky-300/30 rounded-3xl mb-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase">Content Waiting</p>
              <p className="text-[10px] mt-2 text-sky-100/50">화면별 기능 상세 설명이<br />준비 중입니다.</p>
            </div>
          </div>

          <div className="p-6 bg-[#0e3f4f] text-[10px] text-sky-400/40 font-black tracking-[0.2em] uppercase border-t border-white/5">
            Admin Management OS v1.2
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;
