
import {
  Users, LayoutDashboard, BookOpen,
  UserSquare2, CreditCard, Bell, Zap,
  MessageSquare, Settings, BarChart3, UserCheck, Layers, List, Box, FolderOpen,
  Flame, Star, Gift, Crown, Trophy, Coins, Diamond
} from 'lucide-react';
import { MenuItem } from './types';

export const NAVIGATION: MenuItem[] = [
  { id: 'dashboard', label: '대시보드(홈)', path: '/', icon: 'LayoutDashboard' },
  {
    id: 'members', label: '회원관리', icon: 'Users', children: [
      { id: 'member-status', label: '회원 현황', path: '/members/list' },
      { id: 'member-withdrawn', label: '탈퇴 회원', path: '/members/withdrawn' },
      { id: 'member-dormant', label: '휴면 회원', path: '/members/dormant' },
      { id: 'assign-group', label: '단체 회원', path: '/members/groups' },
    ]
  },
  {
    id: 'assignment', label: '배정 관리', icon: 'UserCheck', children: [
      { id: 'assign-course', label: '강좌 배정', path: '/assignment/course' },
      { id: 'assign-teacher', label: '교사 관리', path: '/learning/teachers' },
      { id: 'assign-student', label: '학생 관리(배정)', path: '/learning/students' },
    ]
  },
  {
    id: 'learning', label: '학습 관리', icon: 'BookOpen', children: [
      { id: 'learn-program', label: '강좌 관리', path: '/learning/programs' },
      { id: 'learn-contents', label: '콘텐츠 관리', path: '/learning/contents' },
      { id: 'learn-template', label: '템플릿 관리', path: '/learning/templates' },
    ]
  },

  {
    id: 'finance', label: '구독 및 정산 관리', icon: 'CreditCard', children: [
      { id: 'fin-settlement', label: '구독 및 정산', path: '/finance/settlement' },
      { id: 'fin-coupon', label: '쿠폰 관리', path: '/finance/coupons' },
      { id: 'fin-giftcard', label: '기프트 카드 관리', path: '/finance/giftcards' },
    ]
  },
  { id: 'push', label: '푸시 관리', icon: 'Bell', path: '/push' },
  {
    id: 'reward', label: '보상 관리', icon: 'Zap', children: [
      { id: 'rew-status', label: '보상 현황', path: '/rewards/status' },
      { id: 'rew-manage', label: '보상 관리', path: '/rewards/manage' },
    ]
  },
  {
    id: 'boards', label: '게시판 관리', icon: 'MessageSquare', children: [
      { id: 'brd-inquiry', label: '문의 관리', path: '/boards/inquiries' },
      { id: 'brd-faq', label: 'FAQ 관리', path: '/boards/faq' },
      { id: 'brd-terms', label: '약관 관리', path: '/boards/terms' },
    ]
  },
  {
    id: 'stats', label: '통계', icon: 'BarChart3', children: [
      { id: 'stat-sub', label: '구독 통계', path: '/stats/subscriptions' },
      { id: 'stat-user', label: '회원 통계', path: '/stats/users' },
    ]
  },
  {
    id: 'personal', label: '개인설정', icon: 'UserSquare2', children: [
      { id: 'per-account', label: '어드민 계정 설정', path: '/personal/account' },
    ]
  },
  {
    id: 'system', label: '시스템 설정', icon: 'Settings', children: [
      { id: 'sys-permission', label: '관리자 권한 관리', path: '/system/permissions' },
      { id: 'sys-version', label: '앱 버전 관리', path: '/system/versions' },

      { id: 'sys-account-manage', label: '관리자 계정 관리', path: '/system/admin-accounts' },
      { id: 'sys-logs', label: '관리자 활동 로그', path: '/system/logs' },
    ]
  },
];

export const ICON_MAP: Record<string, any> = {
  LayoutDashboard, Users, BookOpen,
  UserSquare2, CreditCard, Bell, Zap,
  MessageSquare, Settings, BarChart3, UserCheck, Layers, List, Box, FolderOpen,
  Flame, Star, Gift, Crown, Trophy, Coins, Diamond
};

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [], // All (Handled logically)
  OPERATION_ADMIN: ['members', 'boards', 'stats', 'push', 'reward', 'learning', 'module-activity-manage'],
  GROUP_ADMIN: ['members', 'stats', 'assignment'],
  TEACHER: ['assignment', 'learning'] // Limited scope
};

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: '최고 관리자',
  OPERATION_ADMIN: '운영 관리자',
  GROUP_ADMIN: '단체 관리자',
  TEACHER: '교사'
};
