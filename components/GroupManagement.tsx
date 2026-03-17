import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { Group, GroupStatus, GroupType, GroupCode, GroupAuthPreReg } from '../types';
import { X, Users, Building, School, Key, FileText, CheckCircle, Plus, Trash2, Calendar, Target } from 'lucide-react';

const MOCK_PROGRAMS = [
    { id: 'prog-1', name: '기본 한국어 학습', levels: ['입문', '초급1', '초급2', '중급1', '중급2', '고급1', '고급2'] },
    { id: 'prog-2', name: '비즈니스 실무 한국어', levels: ['기본', '심화'] },
    { id: 'prog-3', name: 'TOPIK 대비반', levels: ['I', 'II'] },
];

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
    ...Array.from({ length: 7 }).map((_, i) => ({
        id: `temp-${i}`,
        name: `Vietnam Tech High School ${i}`,
        type: (i % 3 === 0 ? 'SCHOOL' : 'COMPANY') as GroupType,
        representative: `Principal ${i}`,
        adminEmail: `admin${i}@school.edu.vn`,
        memberCount: 20 + i,
        maxMembers: 50,
        contractStart: '2024-01-01',
        contractEnd: '2024-12-31',
        status: (i % 5 === 0 ? 'SUSPENDED' : i % 4 === 0 ? 'PENDING' : 'ACTIVE') as GroupStatus,
        createdAt: `2023-11-${10 + i}`
    }))
];

const GroupManagement: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'BASIC' | 'CODES' | 'AUTH'>('BASIC');

    const [newAuthReg, setNewAuthReg] = useState({ name: '', email: '', groupCode: '' });

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
            status: 'PENDING',
            createdAt: new Date().toISOString().split('T')[0]
        });
        setIsEditing(true);
    };

    const handleCloseModal = () => {
        setSelectedGroup(null);
        setIsEditing(false);
        setActiveTab('BASIC');
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

    const handleCreateCode = () => {
        if (!selectedGroup) return;
        const newCode: GroupCode = {
            id: `code-${Date.now()}`,
            groupId: selectedGroup.id,
            code: 'GRP-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            assignedLevels: ['전체'],
            startDate: selectedGroup.contractStart || new Date().toISOString().split('T')[0],
            endDate: selectedGroup.contractEnd || new Date().toISOString().split('T')[0],
            status: 'ACTIVE',
            createdAt: new Date().toISOString().split('T')[0]
        };
        setSelectedGroup({
            ...selectedGroup,
            groupCodes: [...(selectedGroup.groupCodes || []), newCode]
        });
    };

    const handleUpdateCode = (codeId: string, updates: Partial<GroupCode>) => {
        if (!selectedGroup) return;
        
        let finalUpdates = { ...updates };
        if (finalUpdates.endDate && selectedGroup.contractEnd) {
            if (new Date(finalUpdates.endDate) > new Date(selectedGroup.contractEnd)) {
                alert(`단체 코드의 종료일은 단체 계약 종료일(${selectedGroup.contractEnd})을 초과할 수 없습니다.`);
                finalUpdates.endDate = selectedGroup.contractEnd;
            }
        }
        if (finalUpdates.assignedProgramId) {
            const prog = MOCK_PROGRAMS.find(p => p.id === finalUpdates.assignedProgramId);
            if (prog) {
                finalUpdates.assignedLevels = [...prog.levels]; // 기본으로 전체 선택
            }
        }

        setSelectedGroup({
            ...selectedGroup,
            groupCodes: (selectedGroup.groupCodes || []).map(code => 
                code.id === codeId ? { ...code, ...finalUpdates } : code
            )
        });
    };

    const handleDeleteCode = (codeId: string) => {
        if (!selectedGroup) return;
        setSelectedGroup({
            ...selectedGroup,
            groupCodes: (selectedGroup.groupCodes || []).filter(code => code.id !== codeId)
        });
    };

    const handleAddAuthReg = () => {
        if (!selectedGroup) return;
        if (!newAuthReg.name || !newAuthReg.email || !newAuthReg.groupCode) {
            alert('대상자 정보를 모두 입력하고 코드를 선택해주세요.');
            return;
        }
        const newReg: GroupAuthPreReg = {
            id: `auth-${Date.now()}`,
            groupId: selectedGroup.id,
            groupCode: newAuthReg.groupCode,
            email: newAuthReg.email,
            name: newAuthReg.name,
            isUsed: false
        };
        setSelectedGroup({
            ...selectedGroup,
            authPreRegs: [newReg, ...(selectedGroup.authPreRegs || [])]
        });
        setNewAuthReg({ ...newAuthReg, name: '', email: '' });
    };

    const handleMockExcelUpload = () => {
        if (!selectedGroup) return;
        if (!newAuthReg.groupCode) {
            alert('일괄 업로드할 대상자들에게 매칭될 "단체 코드"를 먼저 선택해주세요.');
            return;
        }
        const mockRegs: GroupAuthPreReg[] = Array.from({ length: 5 }).map((_, idx) => ({
            id: `auth-bulk-${Date.now()}-${idx}`,
            groupId: selectedGroup.id,
            groupCode: newAuthReg.groupCode,
            email: `bulk_user${Date.now()}_${idx}@example.com`,
            name: `일괄등록자${idx + 1}`,
            isUsed: false
        }));
        setSelectedGroup({
            ...selectedGroup,
            authPreRegs: [...mockRegs, ...(selectedGroup.authPreRegs || [])]
        });
        alert('엑셀 파일에서 5명의 대상자가 일괄 등록되었습니다.');
    };

    const getStatusLabel = (status: GroupStatus) => {
        switch (status) {
            case 'PENDING': return '대기';
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
                    item.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
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
                    <option value="PENDING">대기</option>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col ring-1 ring-slate-900/5 overflow-hidden">
                        {/* Header */}
                        <div className="flex-none px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                                    {selectedGroup.id && !selectedGroup.id.startsWith('new-') ? '단체 정보 상세' : '단체 회원 등록'}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1 font-medium">{selectedGroup.name || '신규 단체 등록'}</p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex-none px-6 border-b border-slate-100 bg-white flex space-x-6">
                            <button
                                onClick={() => setActiveTab('BASIC')}
                                className={`py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'BASIC' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                기본 정보
                            </button>
                            <button
                                onClick={() => setActiveTab('CODES')}
                                className={`py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'CODES' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                단체 코드 관리
                            </button>
                            <button
                                onClick={() => setActiveTab('AUTH')}
                                className={`py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'AUTH' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                인증 대상자 관리
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">
                            <div className="max-w-4xl mx-auto space-y-6">

                                {activeTab === 'BASIC' && (
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <h4 className="text-xs font-bold text-slate-400 mb-6 uppercase flex items-center tracking-wider">
                                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>기본 계약 정보
                                        </h4>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5">단체명</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={selectedGroup.name}
                                                        onChange={e => setSelectedGroup({ ...selectedGroup, name: e.target.value })}
                                                        placeholder="단체명을 입력하세요"
                                                    />
                                                ) : (
                                                    <div className="font-bold text-slate-800 text-lg py-2">{selectedGroup.name}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5">단체 구분</label>
                                                {isEditing ? (
                                                    <select
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={selectedGroup.type}
                                                        onChange={e => setSelectedGroup({ ...selectedGroup, type: e.target.value as GroupType })}
                                                    >
                                                        <option value="COMPANY">기업</option>
                                                        <option value="SCHOOL">학교/학원</option>
                                                        <option value="PUBLIC">공공기관</option>
                                                        <option value="OTHER">기타</option>
                                                    </select>
                                                ) : (
                                                    <div className="font-bold text-slate-800 text-lg py-2">{getTypeLabel(selectedGroup.type)}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5">대표자</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={selectedGroup.representative}
                                                        onChange={e => setSelectedGroup({ ...selectedGroup, representative: e.target.value })}
                                                    />
                                                ) : (
                                                    <div className="font-bold text-slate-800 py-2">{selectedGroup.representative}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5">사업자번호</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={selectedGroup.businessNumber || ''}
                                                        onChange={e => setSelectedGroup({ ...selectedGroup, businessNumber: e.target.value })}
                                                    />
                                                ) : (
                                                    <div className="font-bold text-slate-800 py-2">{selectedGroup.businessNumber || '-'}</div>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5">관리자 이메일</label>
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={selectedGroup.adminEmail}
                                                        onChange={e => setSelectedGroup({ ...selectedGroup, adminEmail: e.target.value })}
                                                    />
                                                ) : (
                                                    <div className="font-bold text-slate-800 py-2">{selectedGroup.adminEmail}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5">계약 시작일</label>
                                                {isEditing ? (
                                                    <input type="date" className="w-full h-10 px-3 border border-slate-200 rounded-xl" value={selectedGroup.contractStart} onChange={e => setSelectedGroup({ ...selectedGroup, contractStart: e.target.value })} />
                                                ) : (<div className="font-bold text-slate-800 py-2">{selectedGroup.contractStart}</div>)}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5">계약 종료일</label>
                                                {isEditing ? (
                                                    <input type="date" className="w-full h-10 px-3 border border-slate-200 rounded-xl" value={selectedGroup.contractEnd} onChange={e => setSelectedGroup({ ...selectedGroup, contractEnd: e.target.value })} />
                                                ) : (<div className="font-bold text-slate-800 py-2">{selectedGroup.contractEnd}</div>)}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5">최대 허용 인원</label>
                                                {isEditing ? (
                                                    <input type="number" className="w-full h-10 px-3 border border-slate-200 rounded-xl" value={selectedGroup.maxMembers} onChange={e => setSelectedGroup({ ...selectedGroup, maxMembers: parseInt(e.target.value) })} />
                                                ) : (<div className="font-bold text-slate-800 py-2">{selectedGroup.maxMembers}명</div>)}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5">계약 상태</label>
                                                {isEditing ? (
                                                    <select className="w-full h-10 px-3 border border-slate-200 rounded-xl" value={selectedGroup.status} onChange={e => setSelectedGroup({ ...selectedGroup, status: e.target.value as any })}>
                                                        <option value="PENDING">대기</option>
                                                        <option value="ACTIVE">정상</option>
                                                        <option value="EXPIRED">만료</option>
                                                        <option value="SUSPENDED">정지</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold mt-2 ${selectedGroup.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : selectedGroup.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                                                        {getStatusLabel(selectedGroup.status)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'CODES' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center tracking-wider">
                                                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>단체 코드 목록
                                                </h4>
                                                {isEditing && (
                                                    <button 
                                                        className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                                        onClick={handleCreateCode}
                                                    >
                                                        <Plus size={14} />
                                                        <span>코드 생성</span>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedGroup.groupCodes?.map(code => (
                                                    <div key={code.id} className="p-5 border border-slate-100 rounded-2xl bg-white hover:border-indigo-200 transition-all group relative">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                                                    <Key size={18} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-lg font-black text-slate-800 tracking-wide">{code.code}</div>
                                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">Created: {code.createdAt}</div>
                                                                </div>
                                                            </div>
                                                            {isEditing && (
                                                                <button 
                                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-400 hover:text-rose-600 transition-all"
                                                                    onClick={() => handleDeleteCode(code.id)}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-500 mb-1">사용 기간 설정 (계약기간 이내)</label>
                                                                {isEditing ? (
                                                                    <div className="flex items-center space-x-2">
                                                                        <input type="date" className="flex-1 text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-indigo-400" value={code.startDate} onChange={e => handleUpdateCode(code.id, { startDate: e.target.value })} />
                                                                        <span className="text-slate-400 text-xs">~</span>
                                                                        <input type="date" className="flex-1 text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-indigo-400" value={code.endDate} onChange={e => handleUpdateCode(code.id, { endDate: e.target.value })} />
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center text-xs font-medium text-slate-600">
                                                                        <Calendar size={14} className="mr-2 text-slate-400" />
                                                                        {code.startDate} ~ {code.endDate}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-500 mb-1">구독 권한 (강좌 및 코스)</label>
                                                                {isEditing ? (
                                                                    <div className="space-y-2">
                                                                        <select 
                                                                            className="w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-indigo-400"
                                                                            value={code.assignedProgramId || ''}
                                                                            onChange={e => handleUpdateCode(code.id, { assignedProgramId: e.target.value })}
                                                                        >
                                                                            <option value="">강좌를 선택하세요</option>
                                                                            {MOCK_PROGRAMS.map(p => (
                                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                                            ))}
                                                                        </select>
                                                                        {code.assignedProgramId && (
                                                                            <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50/80 rounded border border-slate-100">
                                                                                {MOCK_PROGRAMS.find(p => p.id === code.assignedProgramId)?.levels.map(lvl => (
                                                                                    <label key={lvl} className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                                                                                        <input 
                                                                                            type="checkbox" 
                                                                                            className="rounded text-indigo-500 focus:ring-indigo-500 border-slate-300"
                                                                                            checked={code.assignedLevels.includes(lvl)}
                                                                                            onChange={e => {
                                                                                                const updated = e.target.checked 
                                                                                                    ? [...code.assignedLevels, lvl] 
                                                                                                    : code.assignedLevels.filter(x => x !== lvl);
                                                                                                handleUpdateCode(code.id, { assignedLevels: updated });
                                                                                            }}
                                                                                        />
                                                                                        <span>{lvl}</span>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-1.5 mt-1">
                                                                        <div className="text-xs font-bold text-indigo-600">
                                                                            {code.assignedProgramId ? MOCK_PROGRAMS.find(p => p.id === code.assignedProgramId)?.name : '지정되지 않음 (전체)'}
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {code.assignedLevels.map(lvl => (
                                                                                <span key={lvl} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md flex items-center">
                                                                                    <Target size={10} className="mr-1" />
                                                                                    {lvl}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!selectedGroup.groupCodes || selectedGroup.groupCodes.length === 0) && (
                                                    <div className="col-span-2 py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                                        <div className="max-w-xs mx-auto text-slate-400">
                                                            <Key size={32} className="mx-auto mb-3 opacity-20" />
                                                            <p className="text-sm font-medium">등록된 단체 코드가 없습니다.</p>
                                                            <p className="text-xs mt-1">단체 회원 유치를 위해 유니크한 코드를 생성하세요.</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'AUTH' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                                            <div className="p-6 border-b border-slate-100 flex flex-col space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center tracking-wider">
                                                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>인증 대상자 명단 (사전 등록 정보)
                                                    </h4>
                                                </div>
                                                
                                                {isEditing && (
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                        <div className="flex flex-wrap items-end gap-3">
                                                            <div className="flex-1 min-w-[200px]">
                                                                <label className="block text-[10px] font-bold text-slate-500 mb-1">매칭할 단체 코드 선택</label>
                                                                <select 
                                                                    className="w-full h-9 px-2 text-xs border border-slate-200 rounded outline-none"
                                                                    value={newAuthReg.groupCode}
                                                                    onChange={e => setNewAuthReg({ ...newAuthReg, groupCode: e.target.value })}
                                                                >
                                                                    <option value="">코드를 선택하세요</option>
                                                                    {selectedGroup.groupCodes?.map(c => (
                                                                        <option key={c.id} value={c.code}>{c.code}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="flex-1 min-w-[150px]">
                                                                <label className="block text-[10px] font-bold text-slate-500 mb-1">성명</label>
                                                                <input 
                                                                    type="text" 
                                                                    className="w-full h-9 px-2 text-xs border border-slate-200 rounded outline-none"
                                                                    placeholder="홍길동"
                                                                    value={newAuthReg.name}
                                                                    onChange={e => setNewAuthReg({ ...newAuthReg, name: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-[200px]">
                                                                <label className="block text-[10px] font-bold text-slate-500 mb-1">이메일</label>
                                                                <input 
                                                                    type="email" 
                                                                    className="w-full h-9 px-2 text-xs border border-slate-200 rounded outline-none"
                                                                    placeholder="user@example.com"
                                                                    value={newAuthReg.email}
                                                                    onChange={e => setNewAuthReg({ ...newAuthReg, email: e.target.value })}
                                                                />
                                                            </div>
                                                            <button 
                                                                onClick={handleAddAuthReg}
                                                                className="h-9 px-4 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                                                            >
                                                                개별 등록
                                                            </button>
                                                            <button 
                                                                onClick={handleMockExcelUpload}
                                                                className="h-9 px-4 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded text-xs font-bold hover:bg-indigo-100 transition-colors shadow-sm flex items-center"
                                                            >
                                                                <FileText size={14} className="mr-1" /> 엑셀 파일 업로드(일괄)
                                                            </button>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-2">※ 엑셀 파일(CSV, XLSX)을 업로드하여 다수의 대상자를 코드로 한 번에 매칭할 수 있습니다. (테스트용 버튼)</p>
                                                    </div>
                                                )}
                                            </div>

                                            <table className="min-w-full divide-y divide-slate-100">
                                                <thead className="bg-slate-50/50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">성명</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">이메일</th>
                                                        <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">매칭 코드</th>
                                                        <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">상태</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {selectedGroup.authPreRegs?.map(reg => (
                                                        <tr key={reg.id} className="hover:bg-slate-50/50">
                                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{reg.name}</td>
                                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{reg.email}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded border border-amber-100">
                                                                    {reg.groupCode}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                {reg.isUsed ? (
                                                                    <div className="flex items-center justify-center text-emerald-600 font-bold text-[10px]">
                                                                        <CheckCircle size={14} className="mr-1" />
                                                                        ✅ 인증완료 ({reg.usedAt || '-'})
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-slate-400 font-bold text-[10px]">미인증</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {(!selectedGroup.authPreRegs || selectedGroup.authPreRegs.length === 0) && (
                                                        <tr>
                                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                                <FileText size={32} className="mx-auto mb-3 text-slate-200" />
                                                                <p className="text-sm text-slate-400 font-medium">등록된 인증 대상자가 없습니다.</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-white flex justify-end space-x-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
                            >
                                닫기
                            </button>
                            {isEditing ? (
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-black text-sm shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                                >
                                    {selectedGroup.id && !selectedGroup.id.startsWith('new-') ? '정보 저장' : '단체 등록'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-8 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-black text-sm shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5"
                                >
                                    정보 수정
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
