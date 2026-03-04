
import React, { useState, useMemo } from 'react';
import { StudyGroup, User, AdminAccount } from '../types';
import { MOCK_STUDY_GROUPS, MOCK_USERS, MOCK_TEACHERS } from './mockData';
import {
    Users, Plus, Search, MoreVertical, Edit2, Trash2,
    UserPlus, X, Check, AlertCircle, Shield, UserCheck
} from 'lucide-react';

const StudyGroupManagement: React.FC = () => {
    const [groups, setGroups] = useState<StudyGroup[]>(MOCK_STUDY_GROUPS);
    const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');

    // Mock current user role for demonstration (would typically come from context)
    // role: 'GROUP_ADMIN' | 'TEACHER'
    const currentUser = {
        role: 'GROUP_ADMIN',
        organizationId: 'org-1',
        id: 'group-admin-1'
    };

    const filteredGroups = useMemo(() => {
        let result = groups;
        if (currentUser.role === 'TEACHER') {
            result = result.filter(g => g.teacherId === currentUser.id);
        } else if (currentUser.role === 'GROUP_ADMIN') {
            result = result.filter(g => g.organizationId === currentUser.organizationId);
        }

        if (searchTerm) {
            result = result.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return result;
    }, [groups, searchTerm]);

    const handleCreateGroup = () => {
        setSelectedGroup({
            id: `sg-${Date.now()}`,
            organizationId: currentUser.organizationId,
            name: '',
            teacherId: currentUser.role === 'TEACHER' ? currentUser.id : '',
            studentIds: [],
            createdAt: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const handleEditGroup = (group: StudyGroup) => {
        setSelectedGroup({ ...group });
        setIsModalOpen(true);
    };

    const handleSaveGroup = () => {
        if (!selectedGroup || !selectedGroup.name || !selectedGroup.teacherId) {
            alert('클래스명과 담당 교사를 선택해주세요.');
            return;
        }

        const exists = groups.find(g => g.id === selectedGroup.id);
        if (exists) {
            setGroups(groups.map(g => g.id === selectedGroup.id ? selectedGroup : g));
        } else {
            setGroups([...groups, selectedGroup]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteGroup = (id: string) => {
        if (window.confirm('클래스를 삭제하시겠습니까? 소속 학생 데이터는 유지되지만 클래스 정보는 사라집니다.')) {
            setGroups(groups.filter(g => g.id !== id));
        }
    };

    // Student Assignment Logic
    const [assigningGroupId, setAssigningGroupId] = useState<string | null>(null);
    const availableStudents = useMemo(() => {
        // Students of the same organization who are PAID_GROUP members
        // and NOT already in ANY class (except the current one if editing)
        return MOCK_USERS.filter(u =>
            u.organizationId === currentUser.organizationId &&
            u.type === 'PAID_GROUP' &&
            (!groups.some(g => g.studentIds.includes(u.id)) ||
                groups.find(g => g.id === assigningGroupId)?.studentIds.includes(u.id))
        );
    }, [groups, assigningGroupId]);

    const handleAssignStudents = (groupId: string) => {
        setAssigningGroupId(groupId);
        setIsAssignModalOpen(true);
    };

    const toggleStudentInGroup = (studentId: string) => {
        if (!assigningGroupId) return;

        const group = groups.find(g => g.id === assigningGroupId);
        if (!group) return;

        let newStudentIds = [...group.studentIds];
        if (newStudentIds.includes(studentId)) {
            newStudentIds = newStudentIds.filter(id => id !== studentId);
        } else {
            if (newStudentIds.length >= 30) {
                alert('클래스당 정원은 최대 30명입니다.');
                return;
            }
            newStudentIds.push(studentId);
        }

        setGroups(groups.map(g => g.id === assigningGroupId ? { ...g, studentIds: newStudentIds } : g));
    };

    const getTeacherName = (tid: string) => {
        const teacher = MOCK_TEACHERS.find(t => t.id === tid);
        return teacher ? teacher.name : tid;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <div className="relative w-72">
                    <input
                        type="text"
                        placeholder="클래스 이름 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>
                <button
                    onClick={handleCreateGroup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>신규 클래스 등록</span>
                </button>
            </div>

            {/* Grid of Classes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map(group => (
                    <div key={group.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{group.name}</h3>
                                    <div className="flex items-center text-xs text-slate-400 mt-1 space-x-2">
                                        <span className="flex items-center tracking-wider">
                                            <Shield size={12} className="mr-1" />
                                            {getTeacherName(group.teacherId)} 교사
                                        </span>
                                        <span>•</span>
                                        <span>{group.createdAt} 생성</span>
                                    </div>
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditGroup(group)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteGroup(group.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center mb-6">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">소속 인원</div>
                                    <div className="flex items-baseline space-x-1">
                                        <span className={`text-2xl font-black ${group.studentIds.length >= 30 ? 'text-rose-500' : 'text-blue-600'}`}>
                                            {group.studentIds.length}
                                        </span>
                                        <span className="text-slate-400 font-bold text-sm">/ 30명</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                                    <Users size={20} className="text-slate-400" />
                                </div>
                            </div>

                            <button
                                onClick={() => handleAssignStudents(group.id)}
                                className="w-full py-2.5 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-bold text-sm border border-slate-100 transition-all flex items-center justify-center space-x-2"
                            >
                                <UserPlus size={16} />
                                <span>학생 배정 및 이동</span>
                            </button>
                        </div>
                        {group.studentIds.length >= 30 && (
                            <div className="bg-rose-50 px-5 py-2 flex items-center space-x-2 border-t border-rose-100 text-rose-600 text-xs font-bold">
                                <AlertCircle size={14} />
                                <span>클래스 정원이 가득 찼습니다.</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredGroups.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-slate-500 font-bold">등록된 클래스가 없습니다.</h3>
                    <p className="text-slate-400 text-sm mt-1">새로운 클래스를 생성하여 학생들을 배정하세요.</p>
                </div>
            )}

            {/* Edit/Create Modal */}
            {isModalOpen && selectedGroup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden shadow-slate-900/10">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">클래스 정보 관리</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">클래스 이름</label>
                                <input
                                    type="text"
                                    value={selectedGroup.name}
                                    onChange={(e) => setSelectedGroup({ ...selectedGroup, name: e.target.value })}
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="예: 한국어 기초 A반"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">담당 교사</label>
                                <select
                                    value={selectedGroup.teacherId}
                                    onChange={(e) => setSelectedGroup({ ...selectedGroup, teacherId: e.target.value })}
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    disabled={currentUser.role === 'TEACHER'}
                                >
                                    <option value="">교사 선택</option>
                                    {MOCK_TEACHERS.filter(t => t.organizationId === currentUser.organizationId).map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                                    ))}
                                </select>
                                {currentUser.role === 'TEACHER' && <p className="text-[10px] text-slate-400 mt-1">* 교사 관리자는 본인 계정만 생성 가능합니다.</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">설명 (선택)</label>
                                <textarea
                                    value={selectedGroup.description || ''}
                                    onChange={(e) => setSelectedGroup({ ...selectedGroup, description: e.target.value })}
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
                                />
                            </div>
                        </div>
                        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700">취소</button>
                            <button onClick={handleSaveGroup} className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {isAssignModalOpen && assigningGroupId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">학생 배정 및 클래스 이동</h2>
                                <p className="text-sm text-slate-400 font-medium">단체를 인증한 '단체 유료 회원'만 배정 가능하며, 중복 배정은 불가합니다.</p>
                            </div>
                            <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={28} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableStudents.map(student => {
                                    const currentGroup = groups.find(g => g.id === assigningGroupId);
                                    const isSelected = currentGroup?.studentIds.includes(student.id);
                                    const otherGroup = groups.find(g => g.studentIds.includes(student.id) && g.id !== assigningGroupId);

                                    return (
                                        <div
                                            key={student.id}
                                            onClick={() => toggleStudentInGroup(student.id)}
                                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all relative group shadow-sm ${isSelected
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200'
                                                    : otherGroup
                                                        ? 'bg-amber-50 border-amber-200 border-dashed opacity-70 grayscale'
                                                        : 'bg-white border-slate-100 hover:border-blue-400'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    {student.nickname.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className={`font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>{student.nickname}</div>
                                                    <div className={`text-[10px] truncate ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>{student.email}</div>
                                                </div>
                                                <div className={`transition-all ${isSelected ? 'scale-110 opacity-100' : 'scale-75 opacity-0'}`}>
                                                    <div className="bg-white text-blue-600 rounded-full p-1"><Check size={14} strokeWidth={4} /></div>
                                                </div>
                                            </div>
                                            {otherGroup && (
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-200/50 px-2 py-0.5 rounded-full flex items-center">
                                                        <AlertCircle size={10} className="mr-1" />
                                                        타 클래스 소속
                                                    </span>
                                                    <span className="text-[10px] font-black text-amber-800">{otherGroup.name}</span>
                                                </div>
                                            )}
                                            {!otherGroup && !isSelected && (
                                                <div className="mt-3 flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                                                    배정 가능
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
                            <div className="flex items-center space-x-6">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">현재 배정 인원</div>
                                    <div className="text-xl font-black text-blue-600">
                                        {groups.find(g => g.id === assigningGroupId)?.studentIds.length || 0} <span className="text-slate-300 text-sm font-bold">/ 30명</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all"
                            >
                                배정 완료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyGroupManagement;
