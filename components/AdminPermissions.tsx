import React, { useState } from 'react';
import DataList from './DataList';
import { AdminAccount } from '../types';
import { NAVIGATION } from '../constants';
import { X, Check } from 'lucide-react';

// Using the same mock data structure as AdminAccountManagement for consistency
// Ideally this should come from a shared store or API
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
    permissions: [] // Empty means all? Or none? Let's assume 'SUPER' group implies all, but we can override.
  },
  {
    id: 'operator',
    name: '운영자',
    group: '일반',
    role: 'OPERATION_ADMIN',
    useYn: 'Y',
    registrant: 'admin',
    registeredAt: '2024.01.10',
    modifier: '',
    modifiedAt: '',
    permissions: ['dashboard', 'members', 'member-status', 'module-activity-manage', 'learn-structure'] // Updated permissions
  }
];

const AdminPermissions: React.FC = () => {
  const [admins, setAdmins] = useState<AdminAccount[]>(MOCK_ADMINS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const openPermissionModal = (admin: AdminAccount) => {
    setSelectedAdmin(admin);
    // If admin has no permissions set, maybe default to empty or all?
    // For 'SUPER' group, we usually implicitly allow all, but here we explicitly manage.
    setSelectedPermissions(admin.permissions || []);
    setIsModalOpen(true);
  };

  const handleSavePermissions = () => {
    if (!selectedAdmin) return;
    setAdmins(admins.map(a => a.id === selectedAdmin.id ? { ...a, permissions: selectedPermissions } : a));
    setIsModalOpen(false);
  };

  /* Helper to get all IDs including children */
  const getAllIds = () => {
    let ids: string[] = [];
    NAVIGATION.forEach(item => {
      ids.push(item.id);
      if (item.children) {
        item.children.forEach(child => ids.push(child.id));
      }
    });
    return ids;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPermissions(getAllIds());
    } else {
      setSelectedPermissions([]);
    }
  };

  const togglePermission = (id: string, childrenIds?: string[]) => {
    setSelectedPermissions(prev => {
      const isSelected = prev.includes(id);
      let newPermissions = [...prev];

      if (isSelected) {
        // Unselect: Remove self and all children if any
        newPermissions = newPermissions.filter(p => p !== id);
        if (childrenIds) {
          newPermissions = newPermissions.filter(p => !childrenIds.includes(p));
        }
      } else {
        // Select: Add self and all children if any
        newPermissions.push(id);
        if (childrenIds) {
          childrenIds.forEach(cid => {
            if (!newPermissions.includes(cid)) newPermissions.push(cid);
          });
        }
      }
      return newPermissions;
    });
  };

  const renderPermissionTree = () => {
    const allIds = getAllIds();
    const isAllSelected = allIds.length > 0 && allIds.every(id => selectedPermissions.includes(id));

    return (
      <div className="space-y-4">
        <div className="flex items-center mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl transition-colors hover:bg-indigo-50">
          <input
            type="checkbox"
            id="perm-all"
            checked={isAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-all cursor-pointer"
          />
          <label htmlFor="perm-all" className="ml-3 font-bold text-indigo-800 text-sm cursor-pointer select-none">
            전체 메뉴 접근 허용
          </label>
        </div>

        {NAVIGATION.map(menu => {
          const childrenIds = menu.children?.map(c => c.id);
          const isMenuSelected = selectedPermissions.includes(menu.id);
          const hasChildren = menu.children && menu.children.length > 0;

          return (
            <div key={menu.id} className={`border rounded-xl p-4 transition-all duration-200 ${isMenuSelected ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className={`flex items-center ${hasChildren ? 'mb-3' : ''}`}>
                <input
                  type="checkbox"
                  id={`perm-${menu.id}`}
                  checked={isMenuSelected}
                  onChange={() => togglePermission(menu.id, childrenIds)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer transition-all"
                />
                <label htmlFor={`perm-${menu.id}`} className={`ml-2 font-bold text-sm cursor-pointer select-none ${isMenuSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {menu.label}
                </label>
              </div>
              {hasChildren && (
                <div className="ml-6 grid grid-cols-2 gap-3">
                  {menu.children!.map(child => (
                    <div key={child.id} className="flex items-center group">
                      <input
                        type="checkbox"
                        id={`perm-${child.id}`}
                        checked={selectedPermissions.includes(child.id)}
                        onChange={() => togglePermission(child.id)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer transition-all"
                      />
                      <label htmlFor={`perm-${child.id}`} className="ml-2 text-sm text-slate-500 group-hover:text-slate-800 cursor-pointer select-none transition-colors">
                        {child.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    );
  };

  const columns = [
    { header: 'No', accessor: (item: AdminAccount) => admins.indexOf(item) + 1, width: 'w-16 text-center text-gray-400' },
    { header: '관리자 ID', accessor: 'id' as keyof AdminAccount, width: 'w-32 font-bold' },
    { header: '관리자명', accessor: 'name' as keyof AdminAccount, width: 'w-32' },
    { header: '그룹', accessor: 'group' as keyof AdminAccount, width: 'w-24 text-center' },
    {
      header: '사용 여부',
      accessor: (item: AdminAccount) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${item.useYn === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.useYn === 'Y' ? '사용 중' : '중지'}
        </span>
      ),
      width: 'w-24 text-center'
    },
    {
      header: '권한 설정',
      accessor: (item: AdminAccount) => (
        <button
          onClick={() => openPermissionModal(item)}
          className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold hover:bg-gray-50 hover:text-blue-600 flex items-center mx-auto"
        >
          <Check size={14} className="mr-1" /> 권한 관리
        </button>
      ),
      width: 'w-32 text-center'
    },
  ];

  return (
    <>
      <DataList
        title="시스템 설정 > 어드민 권한 관리"
        breadcrumb="시스템 설정 > 어드민 권한 관리"
        data={admins}
        columns={columns}
        onAdd={() => { }} // Creating admin is done in Account Management
        hideAddButton={true}
      />

      {isModalOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">권한 설정</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  {selectedAdmin.name} <span className="text-slate-300 mx-1">|</span> {selectedAdmin.id}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 custom-scrollbar">
              <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 mb-5 uppercase tracking-wider flex items-center">
                  <Check size={14} className="mr-1.5" /> 접속 허용 메뉴
                </h3>
                {renderPermissionTree()}
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
                onClick={handleSavePermissions}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 text-sm"
              >
                변경사항 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPermissions;
