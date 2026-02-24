import React, { useState } from 'react';
import DataList from './DataList';
import { X, ChevronRight } from 'lucide-react';

interface TermItem {
    id: string;
    category: '메인 앱' | 'CP';
    type: '이용약관' | '개인정보 수집·이용동의' | '마케팅 정보 수신동의';
    mandatory: 'Y' | 'N';
    version: string;
    createdAt: string;
    content: string;
}

const MOCK_TERMS: TermItem[] = [
    { id: '1', category: '메인 앱', type: '이용약관', mandatory: 'N', version: '1', createdAt: '2024-10-10', content: '약관 내용입니다...' },
    { id: '2', category: '메인 앱', type: '이용약관', mandatory: 'Y', version: '7', createdAt: '2024-08-20', content: '약관 내용입니다...' },
    { id: '3', category: '메인 앱', type: '이용약관', mandatory: 'Y', version: '6', createdAt: '2024-08-06', content: '약관 내용입니다...' },
    { id: '4', category: '메인 앱', type: '이용약관', mandatory: 'Y', version: '5', createdAt: '2024-08-06', content: '약관 내용입니다...' },
    { id: '5', category: '메인 앱', type: '개인정보 수집·이용동의', mandatory: 'Y', version: '2', createdAt: '2024-08-06', content: '약관 내용입니다...' },
    { id: '6', category: '메인 앱', type: '개인정보 수집·이용동의', mandatory: 'N', version: '1', createdAt: '2024-08-06', content: '약관 내용입니다...' },
    { id: '7', category: 'CP', type: '개인정보 수집·이용동의', mandatory: 'Y', version: '1', createdAt: '2024-08-06', content: '약관 내용입니다...' },
];

const TermsManagement: React.FC = () => {
    const [terms, setTerms] = useState<TermItem[]>(MOCK_TERMS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTerm, setCurrentTerm] = useState<TermItem | null>(null);

    // Form State
    const [formCategory, setFormCategory] = useState<'메인 앱' | 'CP'>('메인 앱');
    const [formType, setFormType] = useState('이용약관');
    const [formMandatory, setFormMandatory] = useState<'Y' | 'N'>('Y');
    const [formVersion, setFormVersion] = useState('');
    const [formContent, setFormContent] = useState('');

    const openModal = (term?: TermItem) => {
        if (term) {
            setCurrentTerm(term);
            setFormCategory(term.category);
            setFormType(term.type);
            setFormMandatory(term.mandatory);
            setFormVersion(term.version);
            setFormContent(term.content);
        } else {
            setCurrentTerm(null);
            setFormCategory('메인 앱');
            setFormType('이용약관');
            setFormMandatory('Y');
            setFormVersion('0');
            setFormContent('');
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formVersion || !formContent) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        if (currentTerm) {
            // Edit
            setTerms(terms.map(item =>
                item.id === currentTerm.id
                    ? {
                        ...item,
                        category: formCategory,
                        type: formType as any,
                        mandatory: formMandatory,
                        version: formVersion,
                        content: formContent
                    }
                    : item
            ));
        } else {
            // Create
            const newItem: TermItem = {
                id: Math.max(...terms.map(t => Number(t.id)), 0) + 1 + '',
                category: formCategory,
                type: formType as any,
                mandatory: formMandatory,
                version: formVersion,
                createdAt: new Date().toISOString().split('T')[0],
                content: formContent
            };
            setTerms([newItem, ...terms]);
        }
        setIsModalOpen(false);
    };

    const columns = [
        { header: '구분', accessor: 'category' as keyof TermItem, width: 'w-32' },
        { header: '형태', accessor: 'type' as keyof TermItem },
        { header: '필수 동의', accessor: 'mandatory' as keyof TermItem, width: 'w-24' },
        { header: '버전', accessor: 'version' as keyof TermItem, width: 'w-24' },
        { header: '생성일', accessor: 'createdAt' as keyof TermItem, width: 'w-32' },
        {
            header: '관리',
            accessor: (item: TermItem) => (
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
            <div className="flex items-center border-r border-gray-200">
                <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">제목</div>
                <div className="p-2 w-64">
                    <select className="w-full h-8 border border-gray-300 rounded px-2 focus:outline-none">
                        <option>전체</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center flex-1">
                <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">형태</div>
                <div className="p-2 w-64">
                    <select className="w-full h-8 border border-gray-300 rounded px-2 focus:outline-none">
                        <option>전체</option>
                        <option>이용약관</option>
                        <option>개인정보 수집·이용동의</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center p-2">
                <button className="px-4 py-1.5 bg-[#B22222] text-white rounded text-sm font-bold hover:bg-[#9a1d1d] flex items-center">
                    초기화
                </button>
                <button className="ml-2 px-4 py-1.5 bg-[#6DC9C1] text-white rounded text-sm font-bold hover:bg-[#5bb7af] flex items-center">
                    <search className="mr-1 h-3 w-3" /> 검색
                </button>
            </div>
        </div>
    );

    return (
        <>
            <DataList
                title="약관"
                breadcrumb="운영 관리 > 약관"
                data={terms}
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
                            <h2 className="text-lg font-bold text-gray-800">약관 등록</h2>
                            <div className="text-xs text-gray-500">운영 관리 &gt; 약관 등록</div>
                        </div>

                        <div className="p-6 bg-white text-xs space-y-4">

                            {/* Category & Type */}
                            <div className="grid grid-cols-[120px_1fr] border-t-2 border-gray-800 border-b border-gray-200">

                                <div className="bg-[#F1F3F6] p-3 font-bold flex items-center border-r border-gray-200 border-b border-gray-200">
                                    구분
                                </div>
                                <div className="p-2 flex items-center border-b border-gray-200">
                                    <select
                                        value={formCategory}
                                        onChange={(e) => setFormCategory(e.target.value as any)}
                                        className="h-8 border border-gray-300 rounded px-2 w-64 focus:outline-none"
                                    >
                                        <option value="메인 앱">메인 앱</option>
                                        <option value="CP">CP</option>
                                    </select>
                                </div>

                                <div className="bg-[#F1F3F6] p-3 font-bold flex items-center border-r border-gray-200 border-b border-gray-200">
                                    형태
                                </div>
                                <div className="p-2 flex items-center border-b border-gray-200">
                                    <select
                                        value={formType}
                                        onChange={(e) => setFormType(e.target.value)}
                                        className="h-8 border border-gray-300 rounded px-2 w-64 focus:outline-none"
                                    >
                                        <option value="이용약관">이용약관</option>
                                        <option value="개인정보 수집·이용동의">개인정보 수집·이용동의</option>
                                        <option value="마케팅 정보 수신동의">마케팅 정보 수신동의</option>
                                    </select>
                                </div>

                                <div className="bg-[#F1F3F6] p-3 font-bold flex items-center border-r border-gray-200 border-b border-gray-200">
                                    필수 동의
                                </div>
                                <div className="p-2 flex items-center border-b border-gray-200">
                                    <select
                                        value={formMandatory}
                                        onChange={(e) => setFormMandatory(e.target.value as any)}
                                        className="h-8 border border-gray-300 rounded px-2 w-64 focus:outline-none"
                                    >
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </select>
                                </div>

                                <div className="bg-[#F1F3F6] p-3 font-bold flex items-center border-r border-gray-200 border-b border-gray-200">
                                    버전 <span className="text-red-500 ml-1">*</span>
                                </div>
                                <div className="p-2 flex items-center border-b border-gray-200">
                                    <input
                                        type="text"
                                        value={formVersion}
                                        onChange={(e) => setFormVersion(e.target.value)}
                                        className="h-8 border border-gray-300 rounded px-2 w-full focus:outline-none"
                                    />
                                </div>

                                <div className="bg-[#F1F3F6] p-3 font-bold flex items-center border-r border-gray-200">
                                    내용 <span className="text-red-500 ml-1">*</span>
                                </div>
                                <div className="p-2 flex items-center">
                                    <textarea
                                        value={formContent}
                                        onChange={(e) => setFormContent(e.target.value)}
                                        className="w-full h-64 p-2 border border-gray-300 rounded focus:outline-none resize-none"
                                    />
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

export default TermsManagement;
