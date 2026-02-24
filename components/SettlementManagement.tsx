import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { Settlement } from '../types';
import { Download } from 'lucide-react';

const MOCK_SETTLEMENTS: Settlement[] = [
    { id: 'S1', userId: 'user_01', userNickname: '홍길동', planName: '프리미엄 1개월', amount: 9900, currency: 'KRW', platform: 'GOOGLE', status: 'PAID', paymentDate: '2024-01-05 10:00:00', settlementDate: '2024-02-05', transactionId: 'GPA.1234-5678-9012-34567' },
    { id: 'S2', userId: 'user_02', userNickname: '김철수', planName: '프리미엄 1년', amount: 99000, currency: 'KRW', platform: 'APPLE', status: 'PAID', paymentDate: '2024-01-02 14:20:00', settlementDate: '2024-02-05', transactionId: '1000000987654321' },
    { id: 'S3', userId: 'user_03', userNickname: '박영희', planName: '베이직 1개월', amount: 5900, currency: 'KRW', platform: 'WEB', status: 'PAID', paymentDate: '2023-12-28 09:15:00', settlementDate: '2024-01-05', transactionId: 'imp_1234567890' },
    { id: 'S4', userId: 'user_04', userNickname: '최민수', planName: '프리미엄 1개월', amount: 9900, currency: 'KRW', platform: 'GOOGLE', status: 'REFUNDED', paymentDate: '2024-01-10 11:00:00', settlementDate: '-', transactionId: 'GPA.9876-5432-1098-76543' },
    { id: 'S5', userId: 'user_05', userNickname: '이영희', planName: '프리미엄 1개월', amount: 200000, currency: 'VND', platform: 'GOOGLE', status: 'PAID', paymentDate: '2024-01-12 15:30:00', settlementDate: '2024-02-05', transactionId: 'GPA.1111-2222-3333-44444' },
];

const SettlementManagement: React.FC = () => {
    // Determine default month (YYYY-MM)
    const today = new Date();
    const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');

    // Filter Logic
    const filteredData = useMemo(() => {
        return MOCK_SETTLEMENTS.filter(item => {
            const matchesMonth = item.paymentDate.startsWith(selectedMonth);
            const matchesPlatform = selectedPlatform === 'ALL' || item.platform === selectedPlatform;
            return matchesMonth && matchesPlatform;
        });
    }, [selectedMonth, selectedPlatform]);

    // Summary Calculation
    const summary = useMemo(() => {
        let totalKRW = 0;
        let totalVND = 0;
        let totalUSD = 0;
        let count = 0;

        filteredData.forEach(item => {
            if (item.status === 'PAID') {
                if (item.currency === 'KRW') totalKRW += item.amount;
                if (item.currency === 'VND') totalVND += item.amount;
                if (item.currency === 'USD') totalUSD += item.amount;
                count++;
            }
        });

        return { totalKRW, totalVND, totalUSD, count };
    }, [filteredData]);

    const columns = [
        { header: 'No', accessor: (item: Settlement) => filteredData.indexOf(item) + 1, width: 'w-16 text-center text-gray-400' },
        { header: '결제일시', accessor: 'paymentDate' as keyof Settlement, width: 'w-40 text-center' },
        { header: '회원명', accessor: 'userNickname' as keyof Settlement, width: 'w-32 text-center font-medium' },
        { header: '상품명', accessor: 'planName' as keyof Settlement, width: 'flex-1 min-w-[150px]' },
        {
            header: '결제 금액',
            accessor: (item: Settlement) => (
                <span className="font-bold">
                    {item.amount.toLocaleString()} {item.currency}
                </span>
            ),
            width: 'w-32 text-right pr-4'
        },
        {
            header: '플랫폼',
            accessor: (item: Settlement) => {
                const map = { 'GOOGLE': '구글 플레이', 'APPLE': '앱스토어', 'WEB': '웹 결제' };
                return map[item.platform];
            },
            width: 'w-24 text-center'
        },
        {
            header: '상태',
            accessor: (item: Settlement) => {
                const style = item.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    item.status === 'REFUNDED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';
                return <span className={`px-2 py-1 rounded text-xs font-bold ${style}`}>{item.status}</span>;
            },
            width: 'w-24 text-center'
        },
        { header: '정산 예정일', accessor: 'settlementDate' as keyof Settlement, width: 'w-32 text-center text-gray-500' },
    ];

    const renderFilter = (
        <div className="flex flex-col space-y-4 p-5 bg-white rounded-xl border border-gray-100 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-700">조회 기간</span>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-700">플랫폼</span>
                        <select
                            value={selectedPlatform}
                            onChange={e => setSelectedPlatform(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-32"
                        >
                            <option value="ALL">전체</option>
                            <option value="GOOGLE">구글 플레이</option>
                            <option value="APPLE">앱스토어</option>
                            <option value="WEB">웹 결제</option>
                        </select>
                    </div>
                </div>
                <button className="flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                    <Download className="w-4 h-4 mr-1" />
                    엑셀 다운로드
                </button>
            </div>

            {/* Monthly Summary Cards */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-xs text-blue-600 font-bold mb-1">총 결제 건수</p>
                    <p className="text-2xl font-black text-gray-900">{summary.count} <span className="text-sm font-normal text-gray-500">건</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 font-bold mb-1">KRW 합계</p>
                    <p className="text-xl font-bold text-gray-900">₩ {summary.totalKRW.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 font-bold mb-1">VND 합계</p>
                    <p className="text-xl font-bold text-gray-900">₫ {summary.totalVND.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 font-bold mb-1">USD 합계</p>
                    <p className="text-xl font-bold text-gray-900">$ {summary.totalUSD.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );

    return (
        <DataList
            title="구독 및 정산 관리 > 구독 및 정산"
            breadcrumb="구독 및 정산 관리 > 구독 및 정산"
            data={filteredData}
            columns={columns}
            renderFilter={renderFilter}
            onAdd={() => { }}
            hideAddButton={true} // Read-only view mainly
        />
    );
};

export default SettlementManagement;
