import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { Group, GroupStatus, GroupType } from '../types';
import { X, Users, Building, School } from 'lucide-react';

const MOCK_GROUPS: Group[] = [
    {
        id: '1',
        name: 'Samsung Electronics VN',
        type: 'COMPANY',
        businessNumber: '123-45-67890',
        representative: 'Lee Jae Yong',
        adminEmail: 'admin@samsung.com.vn',
        memberCount: 150,
        maxMembers: 200,
        contractStart: '2024-01-01',
        contractEnd: '2025-01-01',
        status: 'ACTIVE',
        createdAt: '2023-12-15'
    },
    {
        id: '2',
        name: 'Hanoi University',
        type: 'SCHOOL',
        representative: 'Nguyen Van A',
        adminEmail: 'contact@hanu.edu.vn',
        memberCount: 450,
        maxMembers: 500,
        contractStart: '2024-03-01',
        contractEnd: '2025-02-28',
        status: 'ACTIVE',
        createdAt: '2024-01-20'
    },
    {
        id: '3',
        name: 'LG Display Haiphong',
        type: 'COMPANY',
        businessNumber: '987-65-43210',
        representative: 'Kim Chul Soo',
        adminEmail: 'hr@lgdisplay.com',
        memberCount: 80,
        maxMembers: 100,
        contractStart: '2023-06-01',
        contractEnd: '2024-05-31',
        status: 'EXPIRED',
        createdAt: '2023-05-01'
    },
    ...Array.from({ length: 15 }).map((_, i) => ({
        id: `temp-${i}`,
        name: `Vietnam Tech High School ${i}`,
        type: (i % 3 === 0 ? 'SCHOOL' : 'COMPANY') as GroupType,
        representative: `Principal ${i}`,
        adminEmail: `admin${i}@school.edu.vn`,
        memberCount: 20 + i,
        maxMembers: 50,
        contractStart: '2024-01-01',
        contractEnd: '2024-12-31',
        status: (i % 5 === 0 ? 'SUSPENDED' : 'ACTIVE') as GroupStatus,
        createdAt: `2023-11-${10 + i}`
    }))
];

const GroupManagement: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Search/Filter states
    const [searchParams, setSearchParams] = useState({
        status: 'ALL',
        type: 'ALL',
        keyword: ''
    });
    const [appliedParams, setAppliedParams] = useState(searchParams);

    const filteredGroups = useMemo(() => {
        return groups
            .filter(group => {
                const matchStatus = appliedParams.status === 'ALL' || group.status === appliedParams.status;
                const matchType = appliedParams.type === 'ALL' || group.type === appliedParams.type;
                const matchKeyword = appliedParams.keyword === '' ||
                    group.name.toLowerCase().includes(appliedParams.keyword.toLowerCase()) ||
                    group.adminEmail.toLowerCase().includes(appliedParams.keyword.toLowerCase());

                return matchStatus && matchType && matchKeyword;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [groups, appliedParams]);

    const handleOpenModal = (group: Group) => {
        setSelectedGroup(group);
        setIsEditing(false);
    };

    const handleCreateGroup = () => {
        setSelectedGroup({
            id: '',
            name: '',
            type: 'COMPANY',
            representative: '',
            adminEmail: '',
            memberCount: 0,
            maxMembers: 100,
            contractStart: new Date().toISOString().split('T')[0],
            contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            status: 'ACTIVE',
            createdAt: new Date().toISOString().split('T')[0]
        });
        setIsEditing(true);
    };

    const handleCloseModal = () => {
        setSelectedGroup(null);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!selectedGroup) return;

        if (!selectedGroup.id) {
            // Create New
            const newGroup = {
                ...selectedGroup,
                id: `new-${Date.now()}`,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setGroups([newGroup, ...groups]);
        } else {
            // Update Existing
            setGroups(groups.map(g => g.id === selectedGroup.id ? selectedGroup : g));
        }

        handleCloseModal();
    };

    const getStatusLabel = (status: GroupStatus) => {
        switch (status) {
            case 'ACTIVE': return '정상';
            case 'EXPIRED': return '만료';
            case 'SUSPENDED': return '정지';
            default: return '-';
        }
    };

    const getTypeLabel = (type: GroupType) => {
        switch (type) {
            case 'COMPANY': return '기업';
            case 'SCHOOL': return '학교/학원';
            case 'PUBLIC': return '공공기관';
            case 'OTHER': return '기타';
            default: return '-';
        }
    };

    const columns = [
        {
            header: 'No',
            accessor: (item: Group) => filteredGroups.indexOf(item) + 1,
            width: 'w-16 text-center'
        },
        {
            header: '단체명',
            accessor: (item: Group) => (
                <span
                    className="cursor-pointer hover:text-blue-600 hover:underline flex items-center font-medium"
                    onClick={() => handleOpenModal(item)}
                >
                    {item.type === 'COMPANY' && <Building className="w-4 h-4 mr-2 text-gray-400" />}
                    {item.type === 'SCHOOL' && <School className="w-4 h-4 mr-2 text-gray-400" />}
                    {item.name}
                </span>
            ),
            width: 'flex-1'
        },
        { header: '구분', accessor: (item: Group) => getTypeLabel(item.type), width: 'w-24 text-center' },
        { header: '대표자', accessor: 'representative' as keyof Group, width: 'w-32' },
        { header: '관리자 이메일', accessor: 'adminEmail' as keyof Group, width: 'w-48' },
        {
            header: '회원 현황',
            accessor: (item: Group) => (
                <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    <span>{item.memberCount} / {item.maxMembers}</span>
                </div>
            ),
            width: 'w-32 text-center'
        },
        {
            header: '계약 기간',
            accessor: (item: Group) => (
                <div className="text-xs text-gray-500">
                    <div>{item.contractStart} ~</div>
                    <div>{item.contractEnd}</div>
                </div>
            ),
            width: 'w-32 text-center'
        },
        {
            header: '상태',
            accessor: (item: Group) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    item.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {getStatusLabel(item.status)}
                </span>
            ),
            width: 'w-24 text-center'
        },
    ];

    const renderFilter = (
        <div className="flex border-b border-gray-200 text-xs">
            <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">구분</div>
            <div className="w-32 p-2 border-r border-gray-200">
                <select
                    className="w-full h-8 px-2 border border-gray-300 rounded focus:outline-none"
                    value={searchParams.type}
                    onChange={e => setSearchParams({ ...searchParams, type: e.target.value })}
                >
                    <option value="ALL">전체</option>
                    <option value="COMPANY">기업</option>
                    <option value="SCHOOL">학교/학원</option>
                    <option value="PUBLIC">공공기관</option>
                    <option value="OTHER">기타</option>
                </select>
            </div>
            <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">상태</div>
            <div className="w-32 p-2 border-r border-gray-200">
                <select
                    className="w-full h-8 px-2 border border-gray-300 rounded focus:outline-none"
                    value={searchParams.status}
                    onChange={e => setSearchParams({ ...searchParams, status: e.target.value })}
                >
                    <option value="ALL">전체</option>
                    <option value="ACTIVE">정상</option>
                    <option value="EXPIRED">만료</option>
                    <option value="SUSPENDED">정지</option>
                </select>
            </div>
            <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">검색</div>
            <div className="flex-1 p-2">
                <input
                    type="text"
                    placeholder="단체명, 관리자 이메일 검색"
                    className="w-full h-8 px-3 border border-gray-300 rounded focus:outline-none"
                    value={searchParams.keyword}
                    onChange={e => setSearchParams({ ...searchParams, keyword: e.target.value })}
                />
            </div>
        </div>
    );

    return (
        <>
            <DataList
                title="회원 관리 > 단체 회원"
                breadcrumb="회원 관리 > 단체 회원"
                data={filteredGroups}
                columns={columns}
                renderFilter={renderFilter}
                onAdd={handleCreateGroup}
                onSearch={() => setAppliedParams(searchParams)}
                onReset={() => {
                    const reset = { status: 'ALL', type: 'ALL', keyword: '' };
                    setSearchParams(reset);
                    setAppliedParams(reset);
                }}
            />

            {selectedGroup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {selectedGroup.id && selectedGroup.id.startsWith('new-') ? '단체 회원 등록' : '단체 정보 상세'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">단체명</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={selectedGroup.name}
                                            onChange={e => setSelectedGroup({ ...selectedGroup, name: e.target.value })}
                                            placeholder="단체명을 입력하세요"
                                        />
                                    ) : (
                                        <div className="text-gray-900 font-medium text-lg">{selectedGroup.name}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">단체 구분</label>
                                    {isEditing ? (
                                        <select
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={selectedGroup.type}
                                            onChange={e => setSelectedGroup({ ...selectedGroup, type: e.target.value as GroupType })}
                                        >
                                            <option value="COMPANY">기업</option>
                                            <option value="SCHOOL">학교/학원</option>
                                            <option value="PUBLIC">공공기관</option>
                                            <option value="OTHER">기타</option>
                                        </select>
                                    ) : (
                                        <div className="text-gray-900">{getTypeLabel(selectedGroup.type)}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">대표자</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={selectedGroup.representative}
                                            onChange={e => setSelectedGroup({ ...selectedGroup, representative: e.target.value })}
                                            placeholder="대표자 이름"
                                        />
                                    ) : (
                                        <div className="text-gray-900">{selectedGroup.representative}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">사업자등록번호</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={selectedGroup.businessNumber || ''}
                                            onChange={e => setSelectedGroup({ ...selectedGroup, businessNumber: e.target.value })}
                                            placeholder="000-00-00000"
                                        />
                                    ) : (
                                        <div className="text-gray-900">{selectedGroup.businessNumber || '-'}</div>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">관리자 이메일</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={selectedGroup.adminEmail}
                                            onChange={e => setSelectedGroup({ ...selectedGroup, adminEmail: e.target.value })}
                                            placeholder="admin@example.com"
                                        />
                                    ) : (
                                        <div className="text-gray-900">{selectedGroup.adminEmail}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">계약 시작일</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={selectedGroup.contractStart}
                                            onChange={e => setSelectedGroup({ ...selectedGroup, contractStart: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-gray-900">{selectedGroup.contractStart}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">계약 종료일</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={selectedGroup.contractEnd}
                                            onChange={e => setSelectedGroup({ ...selectedGroup, contractEnd: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-gray-900">{selectedGroup.contractEnd}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">최대 회원 수</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={selectedGroup.maxMembers}
                                            onChange={e => setSelectedGroup({ ...selectedGroup, maxMembers: parseInt(e.target.value) })}
                                        />
                                    ) : (
                                        <div className="text-gray-900">{selectedGroup.maxMembers}명</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">상태</label>
                                    {isEditing ? (
                                        <select
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={selectedGroup.status}
                                            onChange={e => setSelectedGroup({ ...selectedGroup, status: e.target.value as GroupStatus })}
                                        >
                                            <option value="ACTIVE">정상</option>
                                            <option value="EXPIRED">만료</option>
                                            <option value="SUSPENDED">정지</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedGroup.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                            selectedGroup.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {getStatusLabel(selectedGroup.status)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {!isEditing && (
                                <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-blue-900">현재 등록된 회원 수</h4>
                                        <p className="text-blue-700 text-sm">최대 {selectedGroup.maxMembers}명 중 {selectedGroup.memberCount}명이 등록되어 있습니다.</p>
                                    </div>
                                    <div className="text-2xl font-black text-blue-600">
                                        {Math.round((selectedGroup.memberCount / selectedGroup.maxMembers) * 100)}%
                                    </div>
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
                                    {selectedGroup.id && selectedGroup.id.startsWith('new-') ? '등록' : '저장'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                                >
                                    수정
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GroupManagement;
