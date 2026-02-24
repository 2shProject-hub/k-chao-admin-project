import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { RewardItem } from '../types';
import { X, Zap, Flame, Star, Gift, Crown, Trophy, Coins, Diamond } from 'lucide-react';

const ICON_MAP: Record<string, React.FC<any>> = {
    'Zap': Zap,
    'Flame': Flame,
    'Star': Star,
    'Gift': Gift,
    'Crown': Crown,
    'Trophy': Trophy,
    'Coins': Coins,
    'Diamond': Diamond
};

const MOCK_REWARDS: RewardItem[] = [
    {
        id: '1',
        category: 'LIGHTNING',
        name: '일일출석',
        description: '매일 앱에 접속하여 로그인 시 지급',
        points: 5,
        validDays: 7,
        isConsumable: true,
        icon: 'Zap',
        updatedAt: '2024-01-01'
    },
    {
        id: '2',
        category: 'LIGHTNING',
        name: '연속출석',
        description: '7일 연속으로 끊기지 않고 로그인 시 지급',
        points: 10,
        validDays: 7,
        isConsumable: true,
        icon: 'Zap',
        updatedAt: '2024-01-01'
    },
    {
        id: '3',
        category: 'FLAME',
        name: '학습 완료 보상',
        description: '하나의 레슨 학습을 100% 완료 시 지급',
        points: 5,
        validDays: 365,
        isConsumable: false,
        icon: 'Flame',
        updatedAt: '2024-03-15'
    }
];

const RewardManagement: React.FC = () => {
    const [rewards, setRewards] = useState<RewardItem[]>(MOCK_REWARDS);
    const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Search/Filter states
    const [searchParams, setSearchParams] = useState({
        category: 'ALL',
    });
    const [appliedParams, setAppliedParams] = useState(searchParams);

    const categoryOptions = useMemo(() => {
        const categories = new Set(rewards.map(r => r.category));
        return ['ALL', ...Array.from(categories)];
    }, [rewards]);

    const filteredRewards = useMemo(() => {
        return rewards
            .filter(item => {
                const matchCategory = appliedParams.category === 'ALL' || item.category === appliedParams.category;
                return matchCategory;
            })
            .sort((a, b) => a.category.localeCompare(b.category));
    }, [rewards, appliedParams]);

    const handleOpenModal = (item: RewardItem) => {
        setSelectedReward(item);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleAdd = () => {
        setSelectedReward({
            id: Date.now().toString(),
            category: 'LIGHTNING',
            name: '',
            description: '',
            points: 0,
            validDays: 30,
            isConsumable: true,
            icon: 'Zap',
            updatedAt: new Date().toISOString().split('T')[0]
        });
        setIsEditing(true);
        setIsCreating(true);
    };

    const handleCloseModal = () => {
        setSelectedReward(null);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleSave = () => {
        if (!selectedReward) return;

        const newItem = { ...selectedReward, updatedAt: new Date().toISOString().split('T')[0] };

        if (isCreating) {
            setRewards([...rewards, newItem]);
        } else {
            setRewards(rewards.map(item =>
                item.id === selectedReward.id
                    ? newItem
                    : item
            ));
        }
        handleCloseModal();
    };

    const getIconComponent = (iconName: string) => {
        return ICON_MAP[iconName] || Zap;
    };

    const columns = [
        {
            header: 'No',
            accessor: (item: RewardItem) => filteredRewards.indexOf(item) + 1,
            width: 'w-16 text-center'
        },
        {
            header: '카테고리/아이콘',
            accessor: (item: RewardItem) => {
                const Icon = getIconComponent(item.icon);
                return (
                    <div className="flex items-center justify-center space-x-2">
                        <div className={`p-1 rounded-full ${item.category === 'LIGHTNING' ? 'bg-yellow-100 text-yellow-600' : (item.category === 'FLAME' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600')}`}>
                            <Icon size={16} />
                        </div>
                        <span className="font-medium text-xs text-gray-600">{item.category}</span>
                    </div>
                );
            },
            width: 'w-32'
        },
        {
            header: '보상 명',
            accessor: (item: RewardItem) => (
                <div
                    className="cursor-pointer hover:text-blue-600 font-medium flex flex-col"
                    onClick={() => handleOpenModal(item)}
                >
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-400 font-normal truncate">{item.description}</span>
                </div>
            ),
            width: 'flex-1'
        },
        {
            header: '지급 포인트',
            accessor: (item: RewardItem) => (
                <span className="font-bold text-blue-600">{item.points.toLocaleString()} P</span>
            ),
            width: 'w-24 text-center'
        },
        {
            header: '소비 가능',
            accessor: (item: RewardItem) => item.isConsumable
                ? <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">가능</span>
                : <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">불가</span>,
            width: 'w-24 text-center'
        },
        {
            header: '유효 기간',
            accessor: (item: RewardItem) => (
                <span className="text-gray-600">{item.validDays ? `${item.validDays}일` : '무제한'}</span>
            ),
            width: 'w-24 text-center'
        },
        { header: '수정일', accessor: 'updatedAt' as keyof RewardItem, width: 'w-32 text-center' },
    ];

    const renderFilter = (
        <div className="flex border-b border-gray-200 text-xs">
            <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">카테고리</div>
            <div className="flex-1 p-2">
                <select
                    className="w-48 h-8 px-2 border border-gray-300 rounded focus:outline-none"
                    value={searchParams.category}
                    onChange={e => setSearchParams({ ...searchParams, category: e.target.value })}
                >
                    {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat === 'ALL' ? '전체' : cat}</option>
                    ))}
                </select>
            </div>
        </div>
    );

    return (
        <>
            <DataList
                title="보상 관리 > 보상 설정"
                breadcrumb="보상 관리 > 보상 설정"
                data={filteredRewards}
                columns={columns}
                renderFilter={renderFilter}
                onAdd={handleAdd}
                onSearch={() => setAppliedParams(searchParams)}
                onReset={() => {
                    setSearchParams({ category: 'ALL' });
                    setAppliedParams({ category: 'ALL' });
                }}
            />

            {selectedReward && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-gray-800">
                                {isCreating ? '보상 등록' : '보상 정보 상세'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Icon & Name Header */}
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="flex-shrink-0 text-center space-y-2">
                                    <div className={`p-4 rounded-full bg-gray-100 ring-2 ${isEditing ? 'ring-blue-400 ring-offset-2' : 'ring-transparent'}`}>
                                        {React.createElement(getIconComponent(selectedReward.icon), { size: 32, className: "text-gray-700" })}
                                    </div>
                                    {isEditing && (
                                        <div className="relative">
                                            <select
                                                className="w-full text-xs p-1 border rounded appearance-none"
                                                value={selectedReward.icon}
                                                onChange={e => setSelectedReward({ ...selectedReward, icon: e.target.value })}
                                            >
                                                {Object.keys(ICON_MAP).map(key => <option key={key} value={key}>{key}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">보상 명</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold"
                                                value={selectedReward.name}
                                                onChange={e => setSelectedReward({ ...selectedReward, name: e.target.value })}
                                                placeholder="예: 일일 출석 보상"
                                            />
                                        ) : (
                                            <div className="text-xl font-bold">{selectedReward.name}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">카테고리 (유형)</label>
                                        {isEditing ? (
                                            <div className="flex space-x-2">
                                                <select
                                                    className="w-1/2 p-2 border border-gray-300 rounded text-sm"
                                                    value={['LIGHTNING', 'FLAME'].includes(selectedReward.category) ? selectedReward.category : 'custom'}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        if (val !== 'custom') setSelectedReward({ ...selectedReward, category: val });
                                                    }}
                                                >
                                                    <option value="LIGHTNING">LIGHTNING (번개)</option>
                                                    <option value="FLAME">FLAME (불꽃)</option>
                                                    <option value="custom">직접 입력</option>
                                                </select>
                                                {(!['LIGHTNING', 'FLAME'].includes(selectedReward.category) || selectedReward.category === 'custom' || isCreating) && (
                                                    <input
                                                        type="text"
                                                        className="w-1/2 p-2 border border-gray-300 rounded text-sm"
                                                        placeholder="직접 입력"
                                                        value={['LIGHTNING', 'FLAME', 'custom'].includes(selectedReward.category) ? '' : selectedReward.category}
                                                        onChange={e => setSelectedReward({ ...selectedReward, category: e.target.value.toUpperCase() })}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-sm font-medium">{selectedReward.category}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">상세 설명</label>
                                    {isEditing ? (
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            rows={2}
                                            value={selectedReward.description || ''}
                                            onChange={e => setSelectedReward({ ...selectedReward, description: e.target.value })}
                                            placeholder="보상에 대한 설명을 입력하세요."
                                        />
                                    ) : (
                                        <div className="text-gray-700 text-sm whitespace-pre-wrap">{selectedReward.description}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">지급 포인트</label>
                                    {isEditing ? (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                className="w-full p-2 border border-gray-300 rounded text-right font-bold"
                                                value={selectedReward.points}
                                                onChange={e => setSelectedReward({ ...selectedReward, points: parseInt(e.target.value) || 0 })}
                                            />
                                            <span className="text-gray-500 font-bold">P</span>
                                        </div>
                                    ) : (
                                        <div className="text-lg font-bold text-blue-600">{selectedReward.points} P</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">유효 기간</label>
                                    {isEditing ? (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                className="w-full p-2 border border-gray-300 rounded text-right font-bold"
                                                value={selectedReward.validDays}
                                                onChange={e => setSelectedReward({ ...selectedReward, validDays: parseInt(e.target.value) || 0 })}
                                            />
                                            <span className="text-gray-500 font-bold">일</span>
                                        </div>
                                    ) : (
                                        <div className="text-lg font-bold">{selectedReward.validDays}일</div>
                                    )}
                                </div>

                                <div className="col-span-2 mt-2">
                                    <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                            checked={selectedReward.isConsumable}
                                            disabled={!isEditing}
                                            onChange={e => setSelectedReward({ ...selectedReward, isConsumable: e.target.checked })}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-700 text-sm">소비 가능 (재화로 사용 여부)</span>
                                            <span className="text-xs text-gray-400">체크 시 획득한 포인트로 앱 내 아이템 등을 구매할 수 있습니다.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Metadata */}
                            {!isCreating && (
                                <div className="text-xs text-gray-400 text-right mt-4">
                                    최근 수정일: {selectedReward.updatedAt}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                닫기
                            </button>
                            {isEditing ? (
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                >
                                    {isCreating ? '등록' : '저장'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                                >
                                    내용 수정
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RewardManagement;
