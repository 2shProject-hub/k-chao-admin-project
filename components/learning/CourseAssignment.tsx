
import React, { useState, useMemo } from 'react';
import DataList from '../DataList';
import { User, Group, Program, Teacher } from '../../types';
import { MOCK_USERS, MOCK_ORGANIZATIONS, MOCK_TEACHERS } from '../mockData';
// Ah, MOCK_PROGRAMS is inside ProgramManagement and not exported likely. 
// I should define MOCK_PROGRAMS here or better yet, move it to mockData.ts in a future cleanup.
// For now, I'll redefine a simple list or assume I can fetch it (mock).

// Assuming AVAILABLE_PROGRAMS should ideally come from MOCK_PROGRAMS in mockData or API
import { MOCK_PROGRAMS } from '../mockData'; // Import MOCK_PROGRAMS
const AVAILABLE_PROGRAMS = MOCK_PROGRAMS;

interface CourseAssignmentProps { }

const CourseAssignment: React.FC<CourseAssignmentProps> = () => {
    const [activeTab, setActiveTab] = useState<'GROUP' | 'STUDENT'>('GROUP');
    const [groups, setGroups] = useState<Group[]>(MOCK_ORGANIZATIONS.map(o => ({ ...o, assignedProgramId: '1' } as any))); // Type casting for mock
    const [students, setStudents] = useState<User[]>(MOCK_USERS);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // For GROUP Tab: Multi-select Support
    const [targetAssignedProgramIds, setTargetAssignedProgramIds] = useState<string[]>([]);
    const [targetDefaultProgramId, setTargetDefaultProgramId] = useState<string>('');

    // For STUDENT Tab: Single Select
    const [targetStudentProgramId, setTargetStudentProgramId] = useState<string>('');

    // Filter Logic
    const [searchQuery, setSearchQuery] = useState('');

    const filteredGroups = useMemo(() => {
        return groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [groups, searchQuery]);

    // For Filter
    const [selectedOrgId, setSelectedOrgId] = useState<string>('ALL');

    // ... updated filteredStudents ...
    const filteredStudents = useMemo(() => {
        return students.filter(s =>
            (selectedOrgId === 'ALL' || s.organizationId === selectedOrgId) &&
            (s.nickname.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
            s.status !== 'WITHDRAWN'
        );
    }, [students, searchQuery, selectedOrgId]);

    const renderStudentFilter = (
        <div className="flex border-b border-gray-200 text-xs">
            <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">소속(단체)</div>
            <div className="w-48 p-2 border-r border-gray-200">
                <select
                    className="w-full h-8 px-2 border border-gray-300 rounded focus:outline-none"
                    value={selectedOrgId}
                    onChange={e => setSelectedOrgId(e.target.value)}
                >
                    <option value="ALL">전체</option>
                    {MOCK_ORGANIZATIONS.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                </select>
            </div>
            <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">검색</div>
            <div className="flex-1 p-2">
                <input
                    type="text"
                    placeholder="이름, 이메일 검색"
                    className="w-full h-8 px-3 border border-gray-300 rounded focus:outline-none"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );

    const handleOpenGroupEdit = (group: Group) => {
        setSelectedGroup(group);
        // Initialize with group's current assignments or default if none
        setTargetAssignedProgramIds(group.assignedProgramIds || []);
        setTargetDefaultProgramId(group.defaultProgramId || '');
        setIsEditModalOpen(true);
    };

    const handleOpenStudentEdit = (users: User[]) => {
        if (users.length === 0) return;
        setSelectedStudents(users);
        // Default to the first user's program or empty
        setTargetStudentProgramId(users[0].assignedProgramId || '');
        setIsEditModalOpen(true);
    };

    const handleSaveAssignment = () => {
        if (activeTab === 'GROUP' && selectedGroup) {
            // Validation: Default must be in Assigned
            if (!targetAssignedProgramIds.includes(targetDefaultProgramId)) {
                alert('기본 강좌는 배정된 강좌 목록에 포함되어야 합니다.');
                return;
            }

            // Update Group
            setGroups(groups.map(g => g.id === selectedGroup.id ? {
                ...g,
                assignedProgramIds: targetAssignedProgramIds,
                defaultProgramId: targetDefaultProgramId
            } : g));

            // Optional: Update existing students' course if their current one is no longer available?
            // Or just leave them be? Typically, if default changes, new users get new default. 
            // Existing users might keep theirs unless explicitly changed.
        } else if (activeTab === 'STUDENT' && selectedStudents.length > 0) {
            // Update Students
            const studentIds = selectedStudents.map(s => s.id);
            setStudents(students.map(s => {
                if (studentIds.includes(s.id)) {
                    // Add History Entry Logic Here if we were persistent
                    return { ...s, assignedProgramId: targetStudentProgramId };
                }
                return s;
            }));
        }
        setIsEditModalOpen(false);
        setSelectedGroup(null);
        setSelectedStudents([]);
    };

    const getProgramName = (id?: string) => {
        const p = AVAILABLE_PROGRAMS.find(ap => ap.id === id);
        return p ? p.title : '-';
    };

    const getProgramNames = (ids?: string[]) => {
        if (!ids || ids.length === 0) return '-';
        return ids.map(id => getProgramName(id)).join(', ');
    };

    const toggleSelectStudent = (id: string) => {
        if (selectedStudents.find(s => s.id === id)) {
            setSelectedStudents(selectedStudents.filter(s => s.id !== id));
        } else {
            const student = students.find(s => s.id === id);
            if (student) setSelectedStudents([...selectedStudents, student]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents);
        }
    };

    const groupColumns = [
        { header: '단체명', accessor: 'name' as keyof Group, width: 'flex-1' },
        {
            header: '배정된 강좌 (N) / 기본 (Default)',
            accessor: (g: Group) => (
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">배정: {getProgramNames(g.assignedProgramIds)}</span>
                        <span className="font-bold text-indigo-600">기본: {getProgramName(g.defaultProgramId)}</span>
                    </div>
                    <button
                        onClick={() => handleOpenGroupEdit(g)}
                        className="ml-2 px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold hover:bg-gray-50 text-gray-700"
                    >
                        설정
                    </button>
                </div>
            ),
            width: 'w-1/2'
        }
    ];

    const studentColumns = [
        {
            header: (
                <input
                    type="checkbox"
                    checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
            ) as any,
            accessor: (u: User) => (
                <div className="flex justify-center">
                    <input
                        type="checkbox"
                        checked={!!selectedStudents.find(s => s.id === u.id)}
                        onChange={() => toggleSelectStudent(u.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                </div>
            ),
            width: 'w-12 text-center'
        },
        {
            header: '회원 정보',
            accessor: (u: User) => (
                <div>
                    <div className="font-bold">{u.nickname}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                </div>
            ),
            width: 'flex-1'
        },
        { header: '소속', accessor: (u: User) => u.groupName || '-', width: 'w-48' },
        {
            header: '현재 배정 강좌',
            accessor: (u: User) => (
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{getProgramName(u.assignedProgramId)}</span>
                    <button
                        onClick={() => handleOpenStudentEdit([u])}
                        className="ml-2 px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold hover:bg-gray-50 text-gray-700"
                    >
                        변경
                    </button>
                </div>
            ),
            width: 'w-1/3'
        }
    ];

    return (
        <div className="space-y-6">
            {/* ... Tabs ... */}
            <div className="flex space-x-1 border-b border-gray-200">
                <button
                    className={`px-4 py-2 font-bold ${activeTab === 'GROUP' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => { setActiveTab('GROUP'); setSearchQuery(''); setSelectedOrgId('ALL'); }}
                >
                    단체별 배정
                </button>
                <button
                    className={`px-4 py-2 font-bold ${activeTab === 'STUDENT' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => { setActiveTab('STUDENT'); setSearchQuery(''); }}
                >
                    학생별 배정
                </button>
            </div>

            {/* Content */}
            {activeTab === 'GROUP' ? (
                <DataList
                    title=""
                    breadcrumb=""
                    data={filteredGroups}
                    columns={groupColumns}
                    renderFilter={
                        <div className="flex border-b border-gray-200 text-xs">
                            <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">검색</div>
                            <div className="flex-1 p-2">
                                <input
                                    type="text"
                                    placeholder="단체명 검색"
                                    className="w-full h-8 px-3 border border-gray-300 rounded focus:outline-none"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    }
                />
            ) : (
                <DataList
                    title=""
                    breadcrumb=""
                    data={filteredStudents}
                    columns={studentColumns}
                    renderFilter={renderStudentFilter}
                    actions={
                        selectedStudents.length > 0 ? (
                            <button
                                onClick={() => handleOpenStudentEdit(selectedStudents)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-sm"
                            >
                                선택 학생 일괄 변경 ({selectedStudents.length}명)
                            </button>
                        ) : undefined
                    }
                />
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <h3 className="text-lg font-bold mb-4">
                            {activeTab === 'GROUP' ? '단체 강좌 배정 설정' : '학생 강좌 변경'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {activeTab === 'GROUP'
                                ? `'${selectedGroup?.name}' 단체에 제공할 강좌를 모두 선택하고, 신규 회원에게 자동 배정될 기본 강좌를 설정하세요.`
                                : `${selectedStudents.length}명의 학생에 대한 학습 강좌를 변경합니다.`}
                        </p>

                        {activeTab === 'GROUP' ? (
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">제공 가능한 강좌 목록</label>
                                {AVAILABLE_PROGRAMS.map(p => {
                                    const isAssigned = targetAssignedProgramIds.includes(p.id);
                                    return (
                                        <div key={p.id} className={`p-4 border rounded-xl transition-all ${isAssigned ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`prog-${p.id}`}
                                                        checked={isAssigned}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setTargetAssignedProgramIds([...targetAssignedProgramIds, p.id]);
                                                                // If first one, make it default also
                                                                if (targetAssignedProgramIds.length === 0) setTargetDefaultProgramId(p.id);
                                                            } else {
                                                                setTargetAssignedProgramIds(targetAssignedProgramIds.filter(id => id !== p.id));
                                                                // If unticking default, need to change default
                                                                if (targetDefaultProgramId === p.id) setTargetDefaultProgramId('');
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                                                    />
                                                    <label htmlFor={`prog-${p.id}`} className="ml-3 font-medium text-sm cursor-pointer select-none">
                                                        {p.title}
                                                    </label>
                                                </div>

                                                {isAssigned && (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={`default-${p.id}`}
                                                            name="defaultProgram"
                                                            checked={targetDefaultProgramId === p.id}
                                                            onChange={() => setTargetDefaultProgramId(p.id)}
                                                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                        />
                                                        <label htmlFor={`default-${p.id}`} className="ml-2 text-xs font-bold text-indigo-600 cursor-pointer">
                                                            기본(Default)
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">변경할 강좌 선택</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded font-medium"
                                    value={targetStudentProgramId}
                                    onChange={e => setTargetStudentProgramId(e.target.value)}
                                >
                                    <option value="">-- 강좌 선택 --</option>
                                    {/* Only show programs assigned to the student's org if available context implies restrictions */}
                                    {/* Or show all if admin? Requirement says "Group Admin/Teacher can change". */}
                                    {/* For better UX, let's filter based on the first student's organization if multiple selected */}
                                    {(() => {
                                        // Assumption: All selected students belong to same group or we show intersection?
                                        // Or just show all available programs and let backend validate?
                                        // Requirement: "Display N courses of the group and selection function"

                                        // Let's filter available options based on the first student's Org
                                        const studentOrgId = selectedStudents[0]?.organizationId;
                                        const studentOrg = groups.find(g => g.id === studentOrgId);
                                        const allowedIds = studentOrg ? studentOrg.assignedProgramIds : AVAILABLE_PROGRAMS.map(p => p.id); // If no org, maybe allow all

                                        return AVAILABLE_PROGRAMS
                                            .filter(p => allowedIds?.includes(p.id))
                                            .map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.title}
                                                </option>
                                            ));
                                    })()}
                                </select>
                                <p className="text-xs text-slate-500 mt-2">
                                    * 선택된 학생이 소속된 단체({selectedStudents[0]?.groupName || '없음'})에 배정된 강좌 목록입니다.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-2 border-t border-gray-100 pt-4">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 text-sm"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveAssignment}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 text-sm"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseAssignment;
