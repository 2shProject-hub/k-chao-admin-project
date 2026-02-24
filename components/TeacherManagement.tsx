
import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { Teacher } from '../types';
import { MOCK_TEACHERS, MOCK_USERS, MOCK_ORGANIZATIONS } from './mockData';
import { Users, GraduationCap, Building2 } from 'lucide-react';

const TeacherManagement: React.FC = () => {
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null); // If null, it's 'add' mode

    // Mock form state (in a real app, this would use react-hook-form or similar)
    const [formData, setFormData] = useState<Partial<Teacher>>({
        name: '',
        email: '',
        organizationId: 'org-1'
    });

    // Reset form when opening/closing
    const openForm = (teacher?: Teacher) => {
        if (teacher) {
            setEditingTeacher(teacher);
            setFormData({ name: teacher.name, email: teacher.email, organizationId: teacher.organizationId });
        } else {
            setEditingTeacher(null);
            setFormData({ name: '', email: '', organizationId: 'org-1' });
        }
        setIsFormOpen(true);
    };

    const handleSave = () => {
        // Logic to save (mock)
        const action = editingTeacher ? '수정' : '등록';
        alert(`교사 [${formData.name}]님이 성공적으로 ${action}되었습니다.\n(서버 DB 연동 필요)`);
        setIsFormOpen(false);
    };

    // Helper to calculate teacher stats
    const teachersWithStats = useMemo(() => {
        return MOCK_TEACHERS.map(teacher => {
            const assignedStudents = MOCK_USERS.filter(u => u.teacherId === teacher.id);
            const studentCount = assignedStudents.length;
            const totalProgress = assignedStudents.reduce((sum, u) => sum + (u.progressRate || 0), 0);
            const avgProgress = studentCount > 0 ? Math.round(totalProgress / studentCount) : 0;
            const orgName = MOCK_ORGANIZATIONS.find(o => o.id === teacher.organizationId)?.name || '-';

            return {
                ...teacher,
                assignedStudentCount: studentCount, // Override mock 0
                avgProgress,
                orgName
            };
        });
    }, []);

    const columns = [
        {
            header: '이름',
            accessor: (t: any) => (
                <span className="font-bold text-gray-900">{t.name}</span>
            )
        },
        {
            header: '소속 (단체/학과)',
            accessor: (t: any) => (
                <div className="flex items-center space-x-2 text-gray-600">
                    <Building2 size={16} />
                    <span>{t.orgName}</span>
                </div>
            )
        },
        {
            header: '담당 학생 수',
            accessor: (t: any) => (
                <div className="flex items-center space-x-2">
                    <Users size={16} className="text-blue-500" />
                    <span className="font-bold">{t.assignedStudentCount} 명</span>
                </div>
            ),
            width: 'w-32'
        },
        {
            header: '평균 진도율',
            accessor: (t: any) => (
                <div className="flex items-center space-x-2">
                    <GraduationCap size={16} className="text-green-500" />
                    <span className="font-bold">{t.avgProgress}%</span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${t.avgProgress}%` }}
                        ></div>
                    </div>
                </div>
            ),
            width: 'w-48'
        },
        {
            header: '관리',
            accessor: (t: any) => (
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedTeacher(t); }}
                        className="px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 font-medium"
                    >
                        상세
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); openForm(t); }}
                        className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded hover:bg-blue-100 font-bold"
                    >
                        수정
                    </button>
                </div>
            ),
            width: 'w-32'
        }
    ];

    const renderHeaderButtons = () => (
        <button
            onClick={() => openForm()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
            <Users size={18} className="mr-2" />
            교사 등록
        </button>
    );

    return (
        <>
            <div className="flex justify-between items-end mb-4">
                <div>{/* Header logic handled in DataList usually but buttons need to be injected or outside. 
                   DataList doesn't seem to support custom header buttons prop based on previous view.
                   I will wrap it or put it above. DataList title prop renders a header. 
                   Let's verify DataList. Actually I'll just put the button above DataList or if DataList allows children?
                   Previous usage: <DataList ... />. No children.
                   I will add the button above the DataList or modify DataList logic? 
                   Actually, looking at StudentAssignment, I created a custom header. 
                   For TeacherManagement, I am using DataList component.
                   I can put the button in a wrapper above DataList if I hide DataList title?
                   Or I can assume DataList is flexible enough.
                   Let's look at DataList usage in MemberManagement. It just passes title.
                   I will just insert a div above DataList with the button, but it might duplicate headers.
                   Alternative: Create a custom header area and pass empty title to DataList?
                   Let's keep it simple: Add the button on top-right absolute or flex.
                */}</div>
            </div>

            <DataList
                title="교사 관리"
                breadcrumb="배정 관리 > 교사 관리"
                data={teachersWithStats}
                columns={columns}
                renderFilter={null}
                actions={renderHeaderButtons()}
            />

            {/* Teacher Detail Modal (View Only) */}
            {selectedTeacher && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col ring-1 ring-slate-900/5">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{selectedTeacher.name} <span className="text-slate-400 font-normal">상세 정보</span></h3>
                                <p className="text-sm text-slate-500 mt-1 font-medium flex items-center">
                                    <Building2 size={14} className="mr-1.5 opacity-70" />
                                    {selectedTeacher.orgName}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <Users className="h-5 w-5 rotate-45" /> {/* Using X icon often implies close, here reusing an icon purely for structure or just standard text X? Let's use standard X from lucide if imported or just unicode. The file imports Users, GraduationCap, Building2. I should probably use a unicode X or add X to imports. Wait, X is not in imports. I'll use Unicode × or 'Close'. Previous code used '×'. */}
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto bg-slate-50 custom-scrollbar">
                            <h4 className="font-bold text-sm text-slate-700 mb-4 flex items-center uppercase tracking-wide">
                                <Users className="mr-2 text-indigo-500" size={18} />
                                담당 학생 목록 <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">{(selectedTeacher as any).assignedStudentCount}명</span>
                            </h4>

                            <div className="overflow-hidden border border-slate-200/60 rounded-xl bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">학생명</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">현재 레벨</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">진도율</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">최근 학습일</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">관리</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-50">
                                        {MOCK_USERS.filter(u => u.teacherId === selectedTeacher.id).map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{u.nickname}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{u.currentLevel || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${(u.progressRate || 0) > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {u.progressRate || 0}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 text-right font-medium">{u.lastStudyDate || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button className="text-rose-500 hover:text-rose-700 text-xs font-bold border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                                                        배정 해제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {MOCK_USERS.filter(u => u.teacherId === selectedTeacher.id).length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                                                    담당하는 학생이 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-white flex justify-end">
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Register/Edit Teacher Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 ring-1 ring-slate-900/5">
                        <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">
                            {editingTeacher ? '교사 정보 수정' : '교사 신규 등록'}
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">소속 단체</label>
                                <select
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium bg-slate-50 text-slate-800 transition-all"
                                    value={formData.organizationId}
                                    onChange={e => setFormData({ ...formData, organizationId: e.target.value })}
                                >
                                    {MOCK_ORGANIZATIONS.map(org => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">이름</label>
                                <input
                                    type="text"
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium bg-slate-50 text-slate-800 placeholder:text-slate-300 transition-all"
                                    placeholder="교사 성함 입력"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">이메일 (계정)</label>
                                <input
                                    type="email"
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium bg-slate-50 text-slate-800 placeholder:text-slate-300 transition-all"
                                    placeholder="example@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-8 pt-4 border-t border-slate-100">
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                            >
                                {editingTeacher ? '저장하기' : '등록하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeacherManagement;
