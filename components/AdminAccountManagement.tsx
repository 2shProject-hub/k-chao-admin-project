import React, { useState } from 'react';
import DataList from './DataList';
import { X, Trash2, RefreshCw, Power } from 'lucide-react';

import { AdminAccount, AdminRoleType } from '../types';
import { MOCK_ORGANIZATIONS, MOCK_TEACHERS } from './mockData';
import { ROLE_PERMISSIONS, ROLE_LABELS } from '../constants';

const MOCK_ADMINS: AdminAccount[] = [
    {
        id: 'admin',
        name: '최고관리자',
        group: '슈퍼',
        role: 'SUPER_ADMIN',
        useYn: 'Y',
        registrant: 'system',
        registeredAt: '2024.01.01',
        modifier: '',
        modifiedAt: '',
        permissions: [],
        passwordChanged: true,
        accountStatus: 'ACTIVE'
    },
    {
        id: 'group-admin-1',
        name: '안장대 관리자',
        group: '단체관리자',
        role: 'GROUP_ADMIN',
        referenceId: 'org-1',
        useYn: 'Y',
        registrant: 'admin',
        registeredAt: '2024.01.10',
        modifier: '',
        modifiedAt: '',
        permissions: [],
        passwordChanged: true,
        accountStatus: 'ACTIVE'
    },
    {
        id: 'teacher-1',
        name: '김교사',
        group: '교사',
        role: 'TEACHER',
        referenceId: 'org-1',
        useYn: 'Y',
        registrant: 'group-admin-1',
        registeredAt: '2024.02.01',
        modifier: '',
        modifiedAt: '',
        permissions: [],
        passwordChanged: false,
        accountStatus: 'ACTIVE'
    },
];

const AdminAccountManagement: React.FC = () => {
    const [admins, setAdmins] = useState<AdminAccount[]>(MOCK_ADMINS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingAdmin, setDeletingAdmin] = useState<AdminAccount | null>(null);
    const [transferTeacherId, setTransferTeacherId] = useState('');

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
                        group: ROLE_LABELS[formRole],
                        referenceId: formReferenceId,
                        useYn: formUseYn,
                        email: formEmail,
                        contact: formContact,
                        emergencyContact: formEmergencyContact,
                        accountStatus: formUseYn === 'Y' ? 'ACTIVE' : 'INACTIVE',
                        modifier: 'admin',
                        modifiedAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
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
                permissions: ROLE_PERMISSIONS[formRole],
                passwordChanged: false,
                accountStatus: formUseYn === 'Y' ? 'ACTIVE' : 'INACTIVE'
            };
            setAdmins([...admins, newItem]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = (admin: AdminAccount) => {
        if (admin.role === 'SUPER_ADMIN') {
            alert('최고 관리자 계정은 삭제할 수 없습니다.');
            return;
        }
        setDeletingAdmin(admin);
        setIsDeleteModalOpen(true);
    };

    const executeDeactivate = () => {
        if (!deletingAdmin) return;
        setAdmins(admins.map(a =>
            a.id === deletingAdmin.id
                ? { ...a, useYn: 'N', accountStatus: 'INACTIVE' }
                : a
        ));
        setIsDeleteModalOpen(false);
        setDeletingAdmin(null);
        alert('계정이 비활성화 처리되었습니다. 더 이상 로그인이 불가능합니다.');
    };

    const executeTransferAndDelete = () => {
        if (!deletingAdmin || !transferTeacherId) {
            alert('이관받을 교사를 선택해주세요.');
            return;
        }
        alert(`${deletingAdmin.name} 교사의 모든 클래스와 학생 데이터가 이관되었습니다. 계정을 삭제합니다.`);
        setAdmins(admins.filter(a => a.id !== deletingAdmin.id));
        setIsDeleteModalOpen(false);
        setDeletingAdmin(null);
    };

    const columns = [
        { header: '사용자ID', accessor: 'id' as keyof AdminAccount, width: 'w-24' },
        { header: '사용자명', accessor: 'name' as keyof AdminAccount, width: 'w-24' },
        { header: '그룹(역할)', accessor: 'group' as keyof AdminAccount, width: 'w-24' },
        {
            header: '사용',
            accessor: (item: AdminAccount) => (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.useYn === 'Y' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {item.useYn === 'Y' ? '사용' : '정지'}
                </span>
            ),
            width: 'w-16 text-center'
        },
        { header: '등록일', accessor: 'registeredAt' as keyof AdminAccount, width: 'w-24' },
        {
            header: 'PW변경',
            accessor: (item: AdminAccount) => (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.passwordChanged ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.passwordChanged ? '완료' : '필요'}
                </span>
            ),
            width: 'w-16 text-center'
        },
        { header: '수정일', accessor: 'modifiedAt' as keyof AdminAccount, width: 'w-24' },
        {
            header: '관리',
            accessor: (item: AdminAccount) => (
                <div className="flex space-x-2">
                    <button onClick={() => openModal(item)} className="px-2 py-1 border border-indigo-500 text-indigo-500 rounded text-xs font-bold hover:bg-indigo-50">수정</button>
                    <button onClick={() => handleDeleteClick(item)} className="px-2 py-1 border border-rose-500 text-rose-500 rounded text-xs font-bold hover:bg-rose-50">삭제</button>
                </div>
            ),
            width: 'w-32 text-center'
        }
    ];

    const renderFilter = (
        <div className="flex border-b border-gray-200 text-xs">
            <div className="flex items-center">
                <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center border-r border-gray-200">관리자 ID</div>
                <div className="p-2">
                    <input type="text" className="h-8 border border-gray-300 rounded px-3 w-48 outline-none" placeholder="ID 검색" />
                </div>
            </div>
            <div className="flex-1 p-2 flex items-center justify-end">
                <button className="px-4 py-1.5 bg-[#B22222] text-white rounded text-sm font-bold shadow-sm">조회</button>
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
                onSearch={() => { }}
                onAdd={() => openModal()}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{currentAdmin ? '관리자 계정 수정' : '새 관리자 등록'}</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-8 bg-slate-50 overflow-y-auto max-h-[70vh]">
                            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">사용자 ID *</label>
                                        <input type="text" value={formId} onChange={(e) => setFormId(e.target.value)} readOnly={!!currentAdmin} className={`w-full h-11 px-4 border border-slate-200 rounded-lg outline-none ${currentAdmin ? 'bg-slate-100' : ''}`} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">사용자명 *</label>
                                        <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">초기 비밀번호 *</label>
                                        <input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none" placeholder="******" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">이메일</label>
                                        <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">관리자 역할 *</label>
                                        <select value={formRole} onChange={(e) => setFormRole(e.target.value as AdminRoleType)} className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none">
                                            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">사용 여부 *</label>
                                        <select value={formUseYn} onChange={(e) => setFormUseYn(e.target.value as 'Y' | 'N')} className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none">
                                            <option value="Y">사용 (Active)</option>
                                            <option value="N">미사용 (Inactive)</option>
                                        </select>
                                    </div>
                                </div>
                                {(formRole === 'GROUP_ADMIN' || formRole === 'TEACHER') && (
                                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <label className="block text-xs font-bold text-indigo-800 mb-1.5 uppercase">소속 단체 선택 *</label>
                                        <select value={formReferenceId} onChange={(e) => setFormReferenceId(e.target.value)} className="w-full h-11 px-4 border border-indigo-200 rounded-lg outline-none bg-white">
                                            <option value="">-- 단체 선택 --</option>
                                            {MOCK_ORGANIZATIONS.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 flex justify-end space-x-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 font-bold">취소</button>
                            <button onClick={handleSave} className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && deletingAdmin && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden p-8 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                            <Trash2 size={40} className="text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">계정 삭제 정책 선택</h2>
                        <p className="text-slate-500 font-medium mb-8 italic text-sm">
                            <span className="font-bold text-slate-800">[{deletingAdmin.name}]</span> 계정 삭제 시 데이터 유실 방지를 위해 아래 항목 중 하나를 선택하세요.
                        </p>
                        <div className="grid grid-cols-2 gap-4 w-full mb-8 text-left">
                            <button onClick={executeDeactivate} className="p-6 border-2 border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group">
                                <div className="p-2 bg-slate-100 group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-600 rounded-xl w-fit mb-4"><Power size={20} /></div>
                                <div className="font-black text-slate-800 mb-1">비활성화</div>
                                <div className="text-[10px] text-slate-400 leading-tight">로그인만 차단하고 데이터는 보존합니다.</div>
                            </button>
                            <div className="p-6 border-2 border-indigo-100 bg-indigo-50/20 rounded-3xl space-y-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl w-fit"><RefreshCw size={20} /></div>
                                <div className="font-black text-slate-800 text-sm">데이터 이관 후 삭제</div>
                                <select value={transferTeacherId} onChange={(e) => setTransferTeacherId(e.target.value)} className="w-full h-10 px-2 bg-white border border-indigo-200 rounded-lg text-xs outline-none">
                                    <option value="">이관 교사 선택</option>
                                    {admins.filter(a => a.role === 'TEACHER' && a.id !== deletingAdmin.id).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                                <button disabled={!transferTeacherId} onClick={executeTransferAndDelete} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-black disabled:bg-slate-300 transition-all">실행</button>
                            </div>
                        </div>
                        <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 font-bold hover:text-slate-600 text-sm italic underline">취소</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminAccountManagement;
