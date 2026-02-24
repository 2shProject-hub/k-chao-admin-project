import React, { useState } from 'react';
import DataList from './DataList';
import { X } from 'lucide-react';

import { AdminAccount, AdminRoleType } from '../types';
import { MOCK_ORGANIZATIONS, MOCK_TEACHERS } from './mockData';
import { ROLE_PERMISSIONS, ROLE_LABELS } from '../constants';

const MOCK_ADMINS: AdminAccount[] = [
    {
        id: 'admin',
        name: '관리자',
        group: '슈퍼',
        role: 'SUPER_ADMIN',
        useYn: 'Y',
        registrant: 'system',
        registeredAt: '2024.01.01',
        modifier: '',
        modifiedAt: '',
        permissions: []
    },
];

const AdminAccountManagement: React.FC = () => {
    const [admins, setAdmins] = useState<AdminAccount[]>(MOCK_ADMINS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);

    // Form State
    const [formId, setFormId] = useState('');
    const [formName, setFormName] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formRole, setFormRole] = useState<AdminRoleType>('SUPER_ADMIN');
    const [formReferenceId, setFormReferenceId] = useState('');
    const [formUseYn, setFormUseYn] = useState<'Y' | 'N'>('Y');

    const [formEmail, setFormEmail] = useState('');
    const [formContact, setFormContact] = useState('');
    const [formEmergencyContact, setFormEmergencyContact] = useState('');

    // Open Modal
    const openModal = (admin?: AdminAccount) => {
        if (admin) {
            setCurrentAdmin(admin);
            setFormId(admin.id);
            setFormName(admin.name);
            setFormName(admin.name);
            setFormPassword('');
            setFormRole(admin.role as AdminRoleType);
            setFormReferenceId(admin.referenceId || '');
            setFormUseYn(admin.useYn);
            setFormEmail(admin.email || '');
            setFormContact(admin.contact || '');
            setFormEmergencyContact(admin.emergencyContact || '');
        } else {
            setCurrentAdmin(null);
            setFormId('');
            setFormName('');
            setFormPassword('');
            setFormRole('SUPER_ADMIN');
            setFormReferenceId('');
            setFormUseYn('Y');
            setFormEmail('');
            setFormContact('');
            setFormEmergencyContact('');
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formId || !formName) {
            alert('필수 항목(사용자ID, 사용자명)을 입력해주세요.');
            return;
        }

        if (currentAdmin) {
            // Edit
            setAdmins(admins.map(item =>
                item.id === currentAdmin.id
                    ? {
                        ...item,
                        name: formName,
                        role: formRole,
                        group: ROLE_LABELS[formRole], // Auto-update group name base on role
                        referenceId: formReferenceId,
                        useYn: formUseYn,
                        email: formEmail,
                        contact: formContact,
                        emergencyContact: formEmergencyContact,
                        modifier: 'admin',
                        modifiedAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
                        // Reset permissions based on new role if role changed? Or keep?
                        // For MVP: Update default permissions for role
                        permissions: ROLE_PERMISSIONS[formRole]
                    }
                    : item
            ));
        } else {
            // Create
            const newItem: AdminAccount = {
                id: formId,
                name: formName,
                role: formRole,
                group: ROLE_LABELS[formRole],
                referenceId: formReferenceId,
                useYn: formUseYn,
                registrant: 'admin',
                registeredAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
                modifier: '',
                modifiedAt: '',
                email: formEmail,
                contact: formContact,
                emergencyContact: formEmergencyContact,
                password: formPassword,
                permissions: ROLE_PERMISSIONS[formRole]
            };
            setAdmins([...admins, newItem]);
        }
        setIsModalOpen(false);
    };

    const columns = [
        { header: '사용자ID', accessor: 'id' as keyof AdminAccount, width: 'w-24' },
        { header: '사용자명', accessor: 'name' as keyof AdminAccount, width: 'w-24' },
        { header: '그룹(역할)', accessor: 'group' as keyof AdminAccount, width: 'w-24' },
        { header: '사용', accessor: 'useYn' as keyof AdminAccount, width: 'w-16' },
        { header: '등록자', accessor: 'registrant' as keyof AdminAccount, width: 'w-24' },
        { header: '등록일', accessor: 'registeredAt' as keyof AdminAccount, width: 'w-24' },
        { header: '수정자', accessor: 'modifier' as keyof AdminAccount, width: 'w-24' },
        { header: '수정일', accessor: 'modifiedAt' as keyof AdminAccount, width: 'w-24' },
        {
            header: '관리',
            accessor: (item: AdminAccount) => (
                <button
                    onClick={() => openModal(item)}
                    className="px-2 py-1 border border-red-500 text-red-500 rounded text-xs hover:bg-red-50"
                >
                    수정
                </button>
            ),
            width: 'w-16'
        },
    ];

    const renderFilter = (
        <div className="flex border-b border-gray-200 text-xs">
            <div className="flex items-center">
                <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">
                    관리자 ID
                </div>
                <div className="p-2">
                    <select className="h-8 border border-gray-300 rounded px-2 focus:outline-none min-w-[100px]">
                        <option>관리자 ID</option>
                    </select>
                </div>
            </div>
            <div className="flex-1 p-2 flex items-center space-x-2">
                <input
                    type="text"
                    className="h-8 border border-gray-300 rounded px-3 w-64 focus:outline-none"
                />
                <button
                    className="px-4 py-1.5 bg-[#B22222] text-white rounded text-sm font-bold hover:bg-[#9a1d1d]"
                >
                    조회
                </button>
            </div>
        </div>
    );

    return (
        <>
            <DataList
                title="관리자 계정 관리"
                breadcrumb="시스템 관리 > 시스템 관리자 계정 관리"
                data={admins}
                columns={columns}
                renderFilter={renderFilter}
                onSearch={() => { }} // Using custom search button in filter for now to match design
                onAdd={() => openModal()}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-slate-900/5">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                    {currentAdmin ? '관리자 계정 수정' : '새 관리자 등록'}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">시스템 관리자 계정 정보를 입력하세요.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-8 bg-slate-50 custom-scrollbar overflow-y-auto">
                            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 space-y-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">기본 정보</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* ID */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            사용자 ID <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formId}
                                            onChange={(e) => setFormId(e.target.value)}
                                            readOnly={!!currentAdmin}
                                            className={`w-full h-11 px-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium transition-all ${currentAdmin ? 'bg-slate-100 text-slate-500' : 'bg-white text-slate-800'}`}
                                            placeholder="User ID"
                                        />
                                    </div>
                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            사용자명 <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium bg-white text-slate-800 transition-all"
                                            placeholder="User Name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Password */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            암호 <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={formPassword}
                                            onChange={(e) => setFormPassword(e.target.value)}
                                            className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium bg-white text-slate-800 transition-all"
                                            placeholder="*******"
                                        />
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            이메일
                                        </label>
                                        <input
                                            type="email"
                                            value={formEmail}
                                            onChange={(e) => setFormEmail(e.target.value)}
                                            className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium bg-white text-slate-800 transition-all"
                                            placeholder="admin@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Contact */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            연락처
                                        </label>
                                        <input
                                            type="text"
                                            value={formContact}
                                            onChange={(e) => setFormContact(e.target.value)}
                                            className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium bg-white text-slate-800 transition-all"
                                            placeholder="010-1234-5678"
                                        />
                                    </div>
                                </div>

                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pt-4 border-b border-slate-100 pb-2">권한 및 상태</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* UseYn */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            사용 여부 <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            value={formUseYn}
                                            onChange={(e) => setFormUseYn(e.target.value as 'Y' | 'N')}
                                            className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium bg-white text-slate-800 transition-all cursor-pointer"
                                        >
                                            <option value="Y">사용 (Active)</option>
                                            <option value="N">미사용 (Inactive)</option>
                                        </select>
                                    </div>
                                    {/* Role Selection */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            관리자 역할 (Role) <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            value={formRole}
                                            onChange={(e) => {
                                                setFormRole(e.target.value as AdminRoleType);
                                                setFormReferenceId(''); // Reset reference on role change
                                            }}
                                            className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-medium bg-white text-slate-800 transition-all cursor-pointer"
                                        >
                                            <option value="SUPER_ADMIN">최고 관리자 (Super Admin)</option>
                                            <option value="OPERATION_ADMIN">운영 관리자 (Operation Admin)</option>
                                            <option value="GROUP_ADMIN">단체 관리자 (Group Admin)</option>
                                            <option value="TEACHER">교사 (Teacher)</option>
                                        </select>
                                    </div>

                                    {/* Conditional Scope Input */}
                                    {formRole === 'GROUP_ADMIN' && (
                                        <div className="md:col-span-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                            <label className="block text-xs font-bold text-indigo-800 mb-1.5 uppercase tracking-wider">
                                                관리할 단체 선택 <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                value={formReferenceId}
                                                onChange={(e) => setFormReferenceId(e.target.value)}
                                                className="w-full h-11 px-4 border border-indigo-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-medium bg-white text-slate-800"
                                            >
                                                <option value="">-- 단체 선택 --</option>
                                                {MOCK_ORGANIZATIONS.map(org => (
                                                    <option key={org.id} value={org.id}>{org.name}</option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-indigo-500 mt-2">* 선택한 단체의 데이터만 조회/관리할 수 있습니다.</p>
                                        </div>
                                    )}

                                    {formRole === 'TEACHER' && (
                                        <div className="md:col-span-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                            <label className="block text-xs font-bold text-indigo-800 mb-1.5 uppercase tracking-wider">
                                                연동할 교사 정보 선택 <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                value={formReferenceId}
                                                onChange={(e) => setFormReferenceId(e.target.value)}
                                                className="w-full h-11 px-4 border border-indigo-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-medium bg-white text-slate-800"
                                            >
                                                <option value="">-- 교사 선택 --</option>
                                                {MOCK_TEACHERS.map(teacher => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {teacher.name} ({teacher.email})
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-indigo-500 mt-2">* 선택한 교사에게 배정된 학생/학습 데이터만 관리할 수 있습니다.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-white flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 text-sm"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminAccountManagement;
