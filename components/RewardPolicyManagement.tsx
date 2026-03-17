import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { X, Zap, Info, Settings } from 'lucide-react';

interface ExpensePolicy {
    id: string;
    code: string; // API 연동용 코드
    category: 'ACTIVITY' | 'AI';
    name: string; // The specific target, e.g., '한국어 종합 - 초급1 : 어느 나라 사람이에요?'
    isRewardEnabled: boolean; // Whether points are required
    cost: number;
    updatedAt: string;
}

const MOCK_POLICIES: ExpensePolicy[] = [
    { id: '1', code: 'USE-1A2B3C', category: 'ACTIVITY', name: 'AI대화 시 차감', isRewardEnabled: true, cost: 1, updatedAt: '2024-03-01' },
    { id: '2', code: 'USE-4D5E6F', category: 'ACTIVITY', name: 'AI대화 - 사진설명 진행 시 차감', isRewardEnabled: false, cost: 0, updatedAt: '2024-03-10' },
    { id: '3', code: 'USE-7G8H9I', category: 'AI', name: 'AI대화 - 롤플레잉 진행 시 차감', isRewardEnabled: true, cost: 2, updatedAt: '2024-03-12' },
    { id: '4', code: 'USE-A1B2C3', category: 'AI', name: 'AI대화 - 자유대화 진행 시 차감', isRewardEnabled: true, cost: 3, updatedAt: '2024-03-15' },
];

const RewardPolicyManagement: React.FC = () => {
    const [policies, setPolicies] = useState<ExpensePolicy[]>(MOCK_POLICIES);
    const [selectedPolicy, setSelectedPolicy] = useState<ExpensePolicy | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Filter states
    const [searchParams, setSearchParams] = useState({ category: 'ALL' });
    const [appliedParams, setAppliedParams] = useState(searchParams);

    const filteredPolicies = useMemo(() => {
        return policies.filter(item => {
            if (appliedParams.category !== 'ALL' && item.category !== appliedParams.category) return false;
            return true;
        }).sort((a, b) => a.category.localeCompare(b.category));
    }, [policies, appliedParams]);

    const handleOpenModal = (item: ExpensePolicy) => {
        setSelectedPolicy(item);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleAdd = () => {
        const newCode = 'USE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setSelectedPolicy({
            id: Date.now().toString(),
            code: newCode,
            category: 'ACTIVITY',
            name: '',
            isRewardEnabled: true,
            cost: 1,
            updatedAt: new Date().toISOString().split('T')[0]
        });
        setIsEditing(true);
        setIsCreating(true);
    };

    const handleCloseModal = () => {
        setSelectedPolicy(null);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleSave = () => {
        if (!selectedPolicy) return;

        // Force reset cost if disabled, or enforce minimum cost if enabled
        const finalPolicy = {
            ...selectedPolicy,
            cost: selectedPolicy.isRewardEnabled ? Math.max(1, selectedPolicy.cost) : 0,
            updatedAt: new Date().toISOString().split('T')[0]
        };

        if (isCreating) {
            setPolicies([...policies, finalPolicy]);
        } else {
            setPolicies(policies.map(item => item.id === finalPolicy.id ? finalPolicy : item));
        }
        handleCloseModal();
    };

    const columns = [
        {
            header: 'No',
            accessor: (item: ExpensePolicy) => filteredPolicies.indexOf(item) + 1,
            width: 'w-16 text-center'
        },
        {
            header: '연동 코드',
            accessor: (item: ExpensePolicy) => (
                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">{item.code}</span>
            ),
            width: 'w-28 text-center'
        },
        {
            header: '분류',
            accessor: (item: ExpensePolicy) => (
                <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${item.category === 'ACTIVITY' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                    {item.category === 'ACTIVITY' ? '일반 학습' : 'AI 대화'}
                </span>
            ),
            width: 'w-32 text-center'
        },
        {
            header: '내용(차감)',
            accessor: (item: ExpensePolicy) => (
                <div
                    className="cursor-pointer hover:text-blue-600 font-bold transition-colors"
                    onClick={() => handleOpenModal(item)}
                >
                    {item.name}
                </div>
            ),
            width: 'flex-1'
        },
        {
            header: '사용 여부',
            accessor: (item: ExpensePolicy) => item.isRewardEnabled ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">사용</span>
            ) : (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">미사용</span>
            ),
            width: 'w-24 text-center'
        },
        {
            header: '차감 수량',
            accessor: (item: ExpensePolicy) => item.isRewardEnabled ? (
                <div className="flex items-center justify-center space-x-1 font-bold text-amber-600">
                    <Zap size={14} />
                    <span>{item.cost}</span>
                </div>
            ) : <span className="text-gray-400">-</span>,
            width: 'w-24 text-center'
        },
        { header: '최근 수정일', accessor: 'updatedAt' as keyof ExpensePolicy, width: 'w-32 text-center' },
    ];

    const renderFilter = (
        <div className="flex border-b border-gray-200 text-xs">
            <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">분류</div>
            <div className="flex-1 p-2">
                <select
                    className="w-48 h-8 px-2 border border-gray-300 rounded focus:outline-none"
                    value={searchParams.category}
                    onChange={e => setSearchParams({ ...searchParams, category: e.target.value })}
                >
                    <option value="ALL">전체</option>
                    <option value="ACTIVITY">일반 학습 (Activity)</option>
                    <option value="AI">AI 대화</option>
                </select>
            </div>
        </div>
    );

    return (
        <>
            <DataList
                title="보상 사용 설정 (차감)"
                data={filteredPolicies}
                columns={columns}
                renderFilter={renderFilter}
                onAdd={handleAdd}
                onSearch={() => setAppliedParams(searchParams)}
                onReset={() => {
                    setSearchParams({ category: 'ALL' });
                    setAppliedParams({ category: 'ALL' });
                }}
            />

            {selectedPolicy && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
                            <h3 className="text-lg font-black text-slate-800 flex items-center">
                                <Settings className="mr-2 text-blue-500" size={20} />
                                {isCreating ? '보상 사용처(차감) 설정 등록' : '차감 설정 상세 정보'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto">
                            <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl justify-between border border-slate-100">
                                <span className="text-sm font-bold text-slate-500">API 연동 코드 (자동 생성)</span>
                                <span className="text-base font-mono font-black text-slate-800 tracking-wider">{selectedPolicy.code}</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">분류</label>
                                    {isEditing ? (
                                        <select
                                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                            value={selectedPolicy.category}
                                            onChange={e => setSelectedPolicy({ ...selectedPolicy, category: e.target.value as 'ACTIVITY' | 'AI' })}
                                        >
                                            <option value="ACTIVITY">일반 학습 (Activity)</option>
                                            <option value="AI">AI 대화 (롤플레잉/프리토킹 등)</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-bold ${selectedPolicy.category === 'ACTIVITY' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {selectedPolicy.category === 'ACTIVITY' ? '일반 학습 (Activity)' : 'AI 대화'}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">설정명 (주제 / 레슨명 등 대상 지정)</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                                            value={selectedPolicy.name}
                                            onChange={e => setSelectedPolicy({ ...selectedPolicy, name: e.target.value })}
                                            placeholder="예: 단어 학습 전체 적용, 또는 특정 레슨명"
                                        />
                                    ) : (
                                        <div className="text-lg font-bold text-slate-800">{selectedPolicy.name}</div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="flex items-center space-x-3 cursor-pointer bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                            checked={selectedPolicy.isRewardEnabled}
                                            disabled={!isEditing}
                                            onChange={e => setSelectedPolicy({ ...selectedPolicy, isRewardEnabled: e.target.checked })}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 text-sm">재화(번개) 차감 사용 여부</span>
                                            <span className="text-xs text-slate-500 mt-0.5">체크 해제 시 이용에 재화가 차감되지 않습니다. (무료 적용)</span>
                                        </div>
                                    </label>
                                </div>

                                <div className={`col-span-2 transition-opacity duration-300 ${selectedPolicy.isRewardEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">필요 수량 (차감량)</label>
                                    {isEditing ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="relative flex-1 max-w-[200px]">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Zap size={16} className="text-amber-500" />
                                                </div>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-full pl-9 pr-4 py-2.5 border border-amber-200 rounded-xl text-left font-black text-amber-700 bg-amber-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                                    value={selectedPolicy.cost}
                                                    onChange={e => setSelectedPolicy({ ...selectedPolicy, cost: parseInt(e.target.value) || 1 })}
                                                    disabled={!selectedPolicy.isRewardEnabled}
                                                />
                                            </div>
                                            <span className="text-slate-500 font-bold text-sm">개 차감 / 회당</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2 text-xl font-black text-amber-600">
                                            <Zap size={24} className="text-amber-500" />
                                            <span>{selectedPolicy.cost} 개</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div className="text-xs text-slate-400 font-medium ml-2">
                                {!isCreating && `마지막 수정: ${selectedPolicy.updatedAt}`}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"
                                >
                                    닫기
                                </button>
                                {isEditing ? (
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-black text-sm shadow-lg shadow-blue-200 transition-transform active:scale-95"
                                    >
                                        {isCreating ? '등록하기' : '저장하기'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-black text-sm shadow-lg shadow-slate-200 transition-transform active:scale-95"
                                    >
                                        정보 수정
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RewardPolicyManagement;
