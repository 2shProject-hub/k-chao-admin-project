
import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { User, UserType, LoginMethod } from '../types';
import { MOCK_USERS } from './mockData';
import { Zap, Flame, AlertCircle } from 'lucide-react';
import { ICON_MAP } from '../constants';

const RewardStatus: React.FC = () => {
    const [filterPeriod, setFilterPeriod] = useState('ALL');

    const columns = [
        {
            header: '회원 정보',
            accessor: (u: User) => (
                <div>
                    <div className="font-bold text-gray-900">{u.nickname}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                </div>
            )
        },
        {
            header: '소속',
            accessor: (u: User) => (
                <div className="text-sm text-gray-600">
                    {u.groupName || '-'}
                </div>
            )
        },
        {
            header: '보유 번개 (전체 / 소멸예정)',
            accessor: (u: User) => (
                <div className="flex items-center space-x-2">
                    <div className="flex items-center text-yellow-600 font-bold min-w-[60px]">
                        <Zap size={16} className="mr-1 fill-yellow-500 text-yellow-500" />
                        {u.rewardLightning.toLocaleString()}
                    </div>
                    {(u.expiringLightning || 0) > 0 && (
                        <div className="flex items-center text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            <AlertCircle size={12} className="mr-1" />
                            소멸 {u.expiringLightning?.toLocaleString()}
                        </div>
                    )}
                </div>
            ),
            width: 'w-64'
        },
        {
            header: '보유 불꽃 (전체 / 소멸예정)',
            accessor: (u: User) => (
                <div className="flex items-center space-x-2">
                    <div className="flex items-center text-orange-600 font-bold min-w-[60px]">
                        <Flame size={16} className="mr-1 fill-orange-500 text-orange-500" />
                        {u.rewardFlame.toLocaleString()}
                    </div>
                    {(u.expiringFlame || 0) > 0 && (
                        <div className="flex items-center text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            <AlertCircle size={12} className="mr-1" />
                            소멸 {u.expiringFlame?.toLocaleString()}
                        </div>
                    )}
                </div>
            ),
            width: 'w-64'
        },
        {
            header: '최근 접속',
            accessor: 'lastLoginAt' as keyof User,
            width: 'w-32'
        }
    ];

    // Stats Calculation
    const totals: Record<string, { amount: number, expiring: number }> = {
        'LIGHTNING': { amount: 0, expiring: 0 },
        'FLAME': { amount: 0, expiring: 0 }
    };

    MOCK_USERS.forEach(u => {
        totals['LIGHTNING'].amount += u.rewardLightning;
        totals['LIGHTNING'].expiring += (u.expiringLightning || 0);

        totals['FLAME'].amount += u.rewardFlame;
        totals['FLAME'].expiring += (u.expiringFlame || 0);

        if (u.rewardBalances) {
            Object.entries(u.rewardBalances).forEach(([cat, val]) => {
                const key = cat.toUpperCase();
                if (!totals[key]) totals[key] = { amount: 0, expiring: 0 };
                totals[key].amount += val.amount;
                totals[key].expiring += val.expiring;
            });
        }
    });

    return (
        <div className="space-y-6">
            {/* Dynamic Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(totals).map(([cat, val]) => {
                    // Determine Icon
                    const pascal = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
                    let IconComponent = ICON_MAP[pascal] || ICON_MAP[cat];

                    // Fallback helpers since we know Lightning/Flame mapping might be implicitly Zap/Flame in some contexts but here we map explicitly
                    if (cat === 'LIGHTNING') IconComponent = Zap;
                    if (cat === 'FLAME') IconComponent = Flame;
                    if (!IconComponent) IconComponent = ICON_MAP['Gift']; // Default

                    // Determine Theme
                    let theme = { bg: 'bg-white', text: 'text-gray-900', iconColor: 'text-gray-500', iconBg: 'bg-gray-50' };
                    if (cat === 'LIGHTNING') {
                        theme = { bg: 'bg-white', text: 'text-gray-900', iconColor: 'text-yellow-500', iconBg: 'bg-yellow-50' };
                    } else if (cat === 'FLAME') {
                        theme = { bg: 'bg-white', text: 'text-gray-900', iconColor: 'text-orange-500', iconBg: 'bg-orange-50' };
                    } else {
                        theme = { bg: 'bg-white', text: 'text-gray-900', iconColor: 'text-indigo-500', iconBg: 'bg-indigo-50' };
                    }

                    return (
                        <div key={cat} className={`p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between ${theme.bg}`}>
                            <div>
                                <div className="text-gray-500 text-sm font-bold mb-1">총 발행 {cat === 'LIGHTNING' ? '번개' : (cat === 'FLAME' ? '불꽃' : cat)}</div>
                                <div className="text-3xl font-black text-gray-900 flex items-center">
                                    <IconComponent className={`${theme.iconColor} mr-2`} fill="currentColor" size={24} />
                                    {val.amount.toLocaleString()}
                                </div>
                                <div className="mt-2 text-sm text-gray-500 flex items-center">
                                    <span className="text-red-500 font-bold flex items-center mr-1">
                                        <AlertCircle size={14} className="mr-1" />
                                        {val.expiring.toLocaleString()}
                                    </span>
                                    개가 7일 내 소멸 예정
                                </div>
                            </div>
                            <div className={`w-16 h-16 ${theme.iconBg} rounded-full flex items-center justify-center`}>
                                <IconComponent size={32} className={theme.iconColor} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <DataList
                title="보상 현황"
                breadcrumb="보상 관리 > 보상 현황"
                data={MOCK_USERS}
                columns={columns}
                renderFilter={null}
            />
        </div>
    );
};

export default RewardStatus;
