
import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { User } from '../types';
import { MOCK_USERS, MOCK_TEACHERS, MOCK_ORGANIZATIONS } from './mockData';
import { UserPlus, Filter, CheckSquare, Search } from 'lucide-react';

const StudentAssignment: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ALL' | 'ASSIGNED' | 'UNASSIGNED'>('ALL');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [targetTeacherId, setTargetTeacherId] = useState('');

    const [filters, setFilters] = useState({
        keyword: '',
        orgId: 'ALL'
    });

    const filteredStudents = useMemo(() => {
        return MOCK_USERS.filter(u => {
            // 1. Tab Filter
            if (activeTab === 'ASSIGNED' && !u.teacherId) return false;
            if (activeTab === 'UNASSIGNED' && u.teacherId) return false;

            // 2. Keyword Filter
            if (filters.keyword &&
                !u.nickname.includes(filters.keyword) &&
                !u.email.includes(filters.keyword)) return false;

            // 3. Org Filter
            if (filters.orgId !== 'ALL' && u.organizationId !== filters.orgId) return false;

            // Ensure we only show Active users (usually) or all? 
            // Let's exclude Withdrawn users from assignment
            if (u.status === 'WITHDRAWN') return false;

            return true;
        });
    }, [activeTab, filters]);

    const toggleSelection = (id: string) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const getTeacherName = (tId?: string | null) => {
        if (!tId) return <span className="text-red-400 font-medium">미배정</span>;
        const t = MOCK_TEACHERS.find(teacher => teacher.id === tId);
        return t ? <span className="text-blue-600 font-bold">{t.name}</span> : '-';
    };

    const currentOrgTeachers = useMemo(() => {
        if (!selectedStudents.length) return [];
        // Assume we can only assign students of the SAME organization to a teacher OF THAT organization.
        // Or allow cross-org if logically sound (e.g. external tutor).
        // For safety, let's just show ALL teachers grouped by Org.
        return MOCK_TEACHERS;
    }, [selectedStudents]);

    const columns = [
        {
            header: (
                <input
                    type="checkbox"
                    onChange={(e) => {
                        if (e.target.checked) setSelectedStudents(filteredStudents.map(u => u.id));
                        else setSelectedStudents([]);
                    }}
                    checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                />
            ),
            accessor: (u: User) => (
                <input
                    type="checkbox"
                    checked={selectedStudents.includes(u.id)}
                    onChange={() => toggleSelection(u.id)}
                />
            ),
            width: 'w-12'
        },
        {
            header: '학생 정보',
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
                    {u.groupName || <span className="text-gray-400">-</span>}
                </div>
            )
        },
        {
            header: '담당 교사',
            accessor: (u: User) => getTeacherName(u.teacherId)
        },
        {
            header: '학습 현황',
            accessor: (u: User) => (
                <div className="text-xs">
                    <div>Lv: {u.currentLevel || '입문'}</div>
                    <div className="font-bold text-green-600">{u.progressRate || 0}%</div>
                </div>
            )
        },
        {
            header: '관리',
            accessor: (u: User) => (
                <button
                    onClick={() => {
                        setSelectedStudents([u.id]);
                        setTargetTeacherId(u.teacherId || '');
                        setShowAssignModal(true);
                    }}
                    className="px-2 py-1 text-xs font-bold border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                >
                    {u.teacherId ? '변경' : '배정'}
                </button>
            ),
            width: 'w-16 text-center'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end pb-4 border-b border-gray-200">
                <div>
                    {/* Header removed */}
                </div>
                <div className="flex space-x-2">
                    <button
                        disabled={selectedStudents.length === 0}
                        onClick={() => setShowAssignModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-blue-200"
                    >
                        <UserPlus size={18} className="mr-2" />
                        일괄 배정 / 변경 ({selectedStudents.length})
                    </button>
                </div>
            </div>

            {/* Tabs & Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['ALL', 'ASSIGNED', 'UNASSIGNED'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === tab
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab === 'ALL' ? '전체 학생' : tab === 'ASSIGNED' ? '배정 완료' : '미배정 학생'}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3">
                        <select
                            className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
                            value={filters.orgId}
                            onChange={(e) => setFilters(prev => ({ ...prev, orgId: e.target.value }))}
                        >
                            <option value="ALL">소속 전체</option>
                            {MOCK_ORGANIZATIONS.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </select>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="이름/이메일 검색"
                                className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm w-64"
                                value={filters.keyword}
                                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Area (Reusing DataList or custom table? Custom simplified table for checkbox logic) */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${col.width || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <tr key={student.id} className={`hover:bg-blue-50 transition-colors ${selectedStudents.includes(student.id) ? 'bg-blue-50/50' : ''}`}>
                                    {columns.map((col, idx) => (
                                        <td key={idx} className="px-6 py-4 whitespace-nowrap">
                                            {/* @ts-ignore */}
                                            {typeof col.accessor === 'function' ? col.accessor(student) : student[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-400">
                                    조건에 맞는 학생이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">담당 교사 배정 / 변경</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            선택한 <span className="font-bold text-blue-600">{selectedStudents.length}명</span>의 학생에 대한 담당 교사를 설정합니다.
                        </p>

                        <div className="space-y-4 mb-6">
                            <label className="block text-sm font-bold text-gray-700">교사 선택</label>
                            <select
                                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={targetTeacherId}
                                onChange={(e) => setTargetTeacherId(e.target.value)}
                            >
                                <option value="">교사를 선택하세요</option>
                                {MOCK_TEACHERS.map(t => (
                                    <option key={t.id} value={t.id}>
                                        [{MOCK_ORGANIZATIONS.find(o => o.id === t.organizationId)?.name}] {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                            >
                                취소
                            </button>
                            <button
                                disabled={!targetTeacherId}
                                onClick={() => {
                                    alert(`선택한 ${selectedStudents.length}명의 학생이 성공적으로 배정되었습니다.`);
                                    setShowAssignModal(false);
                                    setSelectedStudents([]);
                                }}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                배정 / 변경 확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAssignment;
