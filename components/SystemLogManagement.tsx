import React, { useState } from 'react';
import DataList from './DataList';
import { Search } from 'lucide-react';

interface AdminLog {
    id: string;
    adminId: string;
    adminName: string;
    actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT';
    target: string; // e.g., 'Member(user_123)', 'Activity(act_55)'
    details: string; // Short description
    ipAddress: string;
    timestamp: string;
}

const MOCK_LOGS: AdminLog[] = [
    { id: 'L1', adminId: 'admin_01', adminName: '김관리', actionType: 'LOGIN', target: '-', details: '로그인 성공', ipAddress: '192.168.0.1', timestamp: '2024-01-13 09:00:00' },
    { id: 'L2', adminId: 'admin_01', adminName: '김관리', actionType: 'UPDATE', target: 'Activity(A1)', details: '액티비티 "기초 퀴즈" 수정', ipAddress: '192.168.0.1', timestamp: '2024-01-13 09:15:00' },
    { id: 'L3', adminId: 'admin_02', adminName: '이운영', actionType: 'CREATE', target: 'Member(user_99)', details: '신규 회원 수동 등록', ipAddress: '192.168.0.2', timestamp: '2024-01-13 10:30:00' },
    { id: 'L4', adminId: 'admin_01', adminName: '김관리', actionType: 'DELETE', target: 'Course(C3)', details: '코스 "폐기된 과정" 삭제', ipAddress: '192.168.0.1', timestamp: '2024-01-13 11:20:00' },
    { id: 'L5', adminId: 'admin_02', adminName: '이운영', actionType: 'EXPORT', target: 'Settlement', details: '정산 내역 엑셀 다운로드', ipAddress: '192.168.0.2', timestamp: '2024-01-13 13:45:00' },
];

const SystemLogManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('ALL');

    const filteredLogs = MOCK_LOGS.filter(log => {
        const matchesSearch =
            log.adminName.includes(searchTerm) ||
            log.adminId.includes(searchTerm) ||
            log.details.includes(searchTerm) ||
            log.target.includes(searchTerm);

        const matchesType = filterType === 'ALL' || log.actionType === filterType;
        return matchesSearch && matchesType;
    });

    const columns = [
        { header: '로그 ID', accessor: 'id' as keyof AdminLog, width: 'w-24 text-center text-gray-400' },
        { header: '시간', accessor: 'timestamp' as keyof AdminLog, width: 'w-40 text-center' },
        { header: '관리자', accessor: (log: AdminLog) => `${log.adminName} (${log.adminId})`, width: 'w-40 text-center font-semibold' },
        {
            header: '활동 유형',
            accessor: (log: AdminLog) => {
                const colorMap: Record<string, string> = {
                    'LOGIN': 'bg-green-100 text-green-700',
                    'LOGOUT': 'bg-gray-100 text-gray-700',
                    'CREATE': 'bg-blue-100 text-blue-700',
                    'UPDATE': 'bg-yellow-100 text-yellow-700',
                    'DELETE': 'bg-red-100 text-red-700',
                    'EXPORT': 'bg-purple-100 text-purple-700',
                };
                return (
                    <span className={`px-2 py-1 rounded text-xs font-bold ${colorMap[log.actionType] || 'bg-gray-100'}`}>
                        {log.actionType}
                    </span>
                );
            },
            width: 'w-24 text-center'
        },
        { header: '대상', accessor: 'target' as keyof AdminLog, width: 'w-32 text-center text-gray-600' },
        { header: '상세 내용', accessor: 'details' as keyof AdminLog, width: 'flex-1' },
        { header: 'IP 주소', accessor: 'ipAddress' as keyof AdminLog, width: 'w-32 text-center text-gray-400 text-xs' },
    ];

    const renderFilter = (
        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100 mb-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-700">검색</span>
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="관리자명, ID, 내용 검색"
                        className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-700">활동 유형</span>
                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm outline-none"
                >
                    <option value="ALL">전체</option>
                    <option value="LOGIN">로그인/로그아웃</option>
                    <option value="CREATE">등록 (CREATE)</option>
                    <option value="UPDATE">수정 (UPDATE)</option>
                    <option value="DELETE">삭제 (DELETE)</option>
                    <option value="EXPORT">다운로드 (EXPORT)</option>
                </select>
            </div>
        </div>
    );

    return (
        <DataList
            title="시스템 설정 > 관리자 활동 로그"
            breadcrumb="시스템 설정 > 관리자 활동 로그"
            data={filteredLogs}
            columns={columns}
            renderFilter={renderFilter}
            onAdd={() => alert('로그는 수동으로 추가할 수 없습니다.')}
            hideAddButton={true} // Add this prop to DataList if supported, or just handle gracefully
        />
    );
};

export default SystemLogManagement;
