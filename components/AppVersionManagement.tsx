import React, { useState } from 'react';
import DataList from './DataList';
import { X, ChevronRight } from 'lucide-react';

interface AppVersionItem {
    id: string;
    category: '메인 앱' | '마주 스튜디오'; // Based on image
    store: '앱 스토어' | '플레이 스토어' | '-';
    version: string;
    versionCode?: string;
    mandatory: 'Y' | 'N';
    createdAt: string;
}

const MOCK_VERSIONS: AppVersionItem[] = [
    { id: '1', category: '마주 스튜디오', store: '-', version: '1.0', mandatory: 'Y', createdAt: '2023-10-11' },
    { id: '2', category: '메인 앱', store: '앱 스토어', version: '1.0.1', mandatory: 'N', createdAt: '2023-10-11' },
    { id: '3', category: '메인 앱', store: '플레이 스토어', version: '1.0.1', mandatory: 'N', createdAt: '2023-10-10' },
];

const AppVersionManagement: React.FC = () => {
    const [versions, setVersions] = useState<AppVersionItem[]>(MOCK_VERSIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVersion, setCurrentVersion] = useState<AppVersionItem | null>(null);

    // Form State
    const [formCategory, setFormCategory] = useState<'메인 앱'>('메인 앱');
    const [formStore, setFormStore] = useState<'앱 스토어' | '플레이 스토어'>('앱 스토어');
    const [formVersion, setFormVersion] = useState('');
    const [formVersionCode, setFormVersionCode] = useState('');
    const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
    const [formMandatory, setFormMandatory] = useState<boolean>(false);

    const openModal = (item?: AppVersionItem) => {
        if (item) {
            setCurrentVersion(item);
            setFormCategory(item.category as any); // Assuming edit allows these
            setFormStore(item.store === '-' ? '앱 스토어' : item.store as any);
            setFormVersion(item.version);
            setFormVersionCode(item.versionCode || '');
            setFormDate(item.createdAt);
            setFormMandatory(item.mandatory === 'Y');
        } else {
            setCurrentVersion(null);
            setFormCategory('메인 앱');
            setFormStore('앱 스토어');
            setFormVersion('');
            setFormVersionCode('');
            setFormDate(new Date().toISOString().split('T')[0]);
            setFormMandatory(false);
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formVersion) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        if (currentVersion) {
            // Edit
            setVersions(versions.map(item =>
                item.id === currentVersion.id
                    ? {
                        ...item,
                        category: formCategory,
                        store: formStore,
                        version: formVersion,
                        versionCode: formVersionCode,
                        mandatory: formMandatory ? 'Y' : 'N',
                        createdAt: formDate
                    }
                    : item
            ));
        } else {
            // Create
            const newItem: AppVersionItem = {
                id: Math.max(...versions.map(v => Number(v.id)), 0) + 1 + '',
                category: formCategory,
                store: formStore,
                version: formVersion,
                versionCode: formVersionCode,
                mandatory: formMandatory ? 'Y' : 'N',
                createdAt: formDate
            };
            setVersions([newItem, ...versions]);
        }
        setIsModalOpen(false);
    };

    const columns = [
        { header: '구분', accessor: 'category' as keyof AppVersionItem },
        { header: '스토어', accessor: 'store' as keyof AppVersionItem },
        { header: '버전', accessor: 'version' as keyof AppVersionItem },
        { header: '필수 업데이트', accessor: 'mandatory' as keyof AppVersionItem, width: 'w-32' },
        { header: '등록일', accessor: 'createdAt' as keyof AppVersionItem, width: 'w-48' },
        {
            header: '관리',
            accessor: (item: AppVersionItem) => (
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
            <div className="flex items-center flex-1 border-r border-gray-200">
                <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">스토어</div>
                <div className="p-2 w-full">
                    <select className="w-full h-8 border border-gray-300 rounded px-2 focus:outline-none">
                        <option>전체</option>
                        <option>앱 스토어</option>
                        <option>플레이 스토어</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center flex-1">
                <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">구분</div>
                <div className="p-2 w-full">
                    <select className="w-full h-8 border border-gray-300 rounded px-2 focus:outline-none">
                        <option>전체</option>
                        <option>메인 앱</option>
                    </select>
                </div>
            </div>

        </div>
    );

    return (
        <>
            <DataList
                title="앱 버전 관리"
                breadcrumb="운영 관리 > 앱 버전 관리"
                data={versions}
                columns={columns}
                renderFilter={renderFilter}
                onSearch={() => { }}
                onReset={() => { }}
                onAdd={() => openModal()}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col font-sans">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-800">앱 버전 등록</h2>
                            <div className="text-xs text-gray-500">앱 버전 관리 &gt; 앱 버전 등록</div>
                        </div>

                        <div className="p-6 bg-white text-xs space-y-4">
                            <div className="bg-white border-t-2 border-gray-800 border-b border-gray-200">
                                {/* Category */}
                                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                                    <div className="bg-[#F1F3F6] p-3 font-bold flex items-center">구분</div>
                                    <div className="p-2 flex items-center">
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value as any)}
                                            className="h-8 border border-gray-300 rounded px-2 w-64 focus:outline-none"
                                        >
                                            <option value="메인 앱">메인 앱</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Store */}
                                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                                    <div className="bg-[#F1F3F6] p-3 font-bold flex items-center">
                                        스토어 <span className="text-red-500 ml-1">*</span>
                                    </div>
                                    <div className="p-2 flex items-center">
                                        <select
                                            value={formStore}
                                            onChange={(e) => setFormStore(e.target.value as any)}
                                            className="h-8 border border-gray-300 rounded px-2 w-64 focus:outline-none"
                                        >
                                            <option value="앱 스토어">앱 스토어</option>
                                            <option value="플레이 스토어">플레이 스토어</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Version */}
                                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                                    <div className="bg-[#F1F3F6] p-3 font-bold flex items-center">
                                        버전 <span className="text-red-500 ml-1">*</span>
                                    </div>
                                    <div className="p-2 flex items-center">
                                        <input
                                            type="text"
                                            value={formVersion}
                                            onChange={(e) => setFormVersion(e.target.value)}
                                            placeholder="1.0.0 or 1.0 ...etc"
                                            className="h-8 border border-gray-300 rounded px-2 w-64 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Version Code */}
                                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                                    <div className="bg-[#F1F3F6] p-3 font-bold flex items-center">
                                        버전 코드 <span className="text-red-500 ml-1">*</span>
                                    </div>
                                    <div className="p-2 flex items-center">
                                        <input
                                            type="text"
                                            value={formVersionCode}
                                            onChange={(e) => setFormVersionCode(e.target.value)}
                                            className="h-8 border border-gray-300 rounded px-2 w-64 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Registration Date */}
                                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                                    <div className="bg-[#F1F3F6] p-3 font-bold flex items-center">
                                        등록일 <span className="text-red-500 ml-1">*</span>
                                    </div>
                                    <div className="p-2 flex items-center">
                                        <input
                                            type="date"
                                            value={formDate}
                                            onChange={(e) => setFormDate(e.target.value)}
                                            className="h-8 border border-gray-300 rounded px-2 w-48 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Mandatory Update */}
                                <div className="grid grid-cols-[160px_1fr]">
                                    <div className="bg-[#F1F3F6] p-3 font-bold flex items-center">
                                        필수 업데이트 여부
                                    </div>
                                    <div className="p-2 flex items-center">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formMandatory}
                                                onChange={(e) => setFormMandatory(e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span>필수 업데이트</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end space-x-2 bg-white">
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-[#6DC9C1] text-white rounded text-xs font-bold hover:bg-[#5bb7af]"
                            >
                                저장
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 bg-gray-600 text-white rounded text-xs font-bold hover:bg-gray-500"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppVersionManagement;
