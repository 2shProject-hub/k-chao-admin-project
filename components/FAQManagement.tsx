import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { X, Search } from 'lucide-react';

interface FAQItem {
    id: number;
    order: number | null; // Changed to nullable for cleaner "optional" handling
    question: string;
    answer: string;
    registrant: string;
    createdAt: string;
}

const MOCK_FAQS: FAQItem[] = [
    { id: 1, order: 1, question: '비밀번호를 분실했습니다.', answer: '로그인 화면의 "비밀번호 찾기"를 이용해주세요.', registrant: 'admin01', createdAt: '2025.09.20' },
    { id: 2, order: null, question: '회원 탈퇴는 어떻게 하나요?', answer: '마이페이지 > 설정 > 회원 탈퇴 메뉴에서 가능합니다.', registrant: 'admin01', createdAt: '2025.09.23' }, // Newest date, no order
    { id: 3, order: 2, question: '결제 영수증은 어디서 확인하나요?', answer: '결제 내역 메뉴에서 확인 가능합니다.', registrant: 'manager', createdAt: '2025.09.22' },
    { id: 4, order: null, question: '앱 실행이 안됩니다.', answer: '재설치 해주세요.', registrant: 'manager', createdAt: '2025.09.21' },
];

const FAQManagement: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQItem[]>(MOCK_FAQS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFaq, setCurrentFaq] = useState<FAQItem | null>(null);

    // Form State
    const [formOrder, setFormOrder] = useState<string>(''); // Use string for input handling to allow empty
    const [formQuestion, setFormQuestion] = useState('');
    const [formAnswer, setFormAnswer] = useState('');

    // Sorted Data using useMemo
    const sortedFaqs = useMemo(() => {
        return [...faqs].sort((a, b) => {
            // 1. Check if order exists (is not null/0)
            const hasOrderA = a.order !== null && a.order !== 0;
            const hasOrderB = b.order !== null && b.order !== 0;

            // If both have order, compare order (ASC)
            if (hasOrderA && hasOrderB) {
                return (a.order!) - (b.order!);
            }

            // If A has order but B doesn't, A comes first
            if (hasOrderA && !hasOrderB) {
                return -1;
            }

            // If B has order but A doesn't, B comes first
            if (!hasOrderA && hasOrderB) {
                return 1;
            }

            // If neither has order, compare createdAt (DESC - Newest first)
            // Assuming format YYYY.MM.DD or YYYY-MM-DD which sorts well as string
            return b.createdAt.localeCompare(a.createdAt);
        });
    }, [faqs]);

    // Open Modal for Create or Edit
    const openModal = (faq?: FAQItem) => {
        if (faq) {
            setCurrentFaq(faq);
            setFormOrder(faq.order ? faq.order.toString() : '');
            setFormQuestion(faq.question);
            setFormAnswer(faq.answer);
        } else {
            setCurrentFaq(null);
            setFormOrder('');
            setFormQuestion('');
            setFormAnswer('');
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formQuestion || !formAnswer) {
            alert('질문과 답변을 모두 입력해주세요.');
            return;
        }

        const orderValue = formOrder.trim() === '' ? null : Number(formOrder);

        if (currentFaq) {
            // Edit
            setFaqs(faqs.map(item =>
                item.id === currentFaq.id
                    ? { ...item, order: orderValue, question: formQuestion, answer: formAnswer }
                    : item
            ));
        } else {
            // Create
            const newItem: FAQItem = {
                id: Math.max(...faqs.map(f => f.id), 0) + 1,
                order: orderValue,
                question: formQuestion,
                answer: formAnswer,
                registrant: 'admin01',
                createdAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
            };
            setFaqs([...faqs, newItem]);
        }
        setIsModalOpen(false);
    };

    const columns = [
        {
            header: '순번',
            accessor: (item: FAQItem) => item.order ? item.order : '-',
            width: 'w-16'
        },
        {
            header: '질문',
            accessor: (item: FAQItem) => (
                <div
                    onClick={() => openModal(item)}
                    className="text-left cursor-pointer hover:underline text-gray-800 font-medium"
                >
                    {item.question}
                </div>
            )
        },
        { header: '등록자', accessor: 'registrant' as keyof FAQItem, width: 'w-32' },
        { header: '등록일', accessor: 'createdAt' as keyof FAQItem, width: 'w-32' },
    ];

    const renderFilter = (
        <div className="flex border-b border-gray-200 text-xs">
            <div className="w-24 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">검색</div>
            <div className="flex-1 p-2 flex items-center space-x-2">
                <select className="h-8 border border-gray-300 rounded px-2 focus:outline-none">
                    <option>질문</option>
                    <option>내용</option>
                    <option>질문+내용</option>
                </select>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="h-8 border border-gray-300 rounded px-3 flex-1 focus:outline-none"
                />
            </div>
        </div>
    );

    return (
        <>
            <DataList
                title="FAQ 관리"
                breadcrumb="게시판 관리 > FAQ 관리"
                data={sortedFaqs}
                columns={columns}
                renderFilter={renderFilter}
                onSearch={() => { }}
                onReset={() => { }}
                onAdd={() => openModal()}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-red-500">
                            <h2 className="text-lg font-bold text-gray-800">
                                {currentFaq ? 'FAQ 수정' : 'FAQ 등록'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 bg-gray-50">
                            <div className="grid grid-cols-[100px_1fr] items-center">
                                <div className="font-bold text-xs text-gray-700">
                                    순번
                                </div>
                                <input
                                    type="number"
                                    value={formOrder}
                                    onChange={(e) => setFormOrder(e.target.value)}
                                    className="w-24 h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-red-500 text-xs"
                                    placeholder="선택"
                                />
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-center">
                                <div className="font-bold text-xs text-gray-700">
                                    <span className="text-red-500 mr-1">*</span>질문
                                </div>
                                <input
                                    type="text"
                                    value={formQuestion}
                                    onChange={(e) => setFormQuestion(e.target.value)}
                                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-red-500 text-xs"
                                    placeholder="질문을 입력하세요"
                                />
                            </div>
                            <div className="grid grid-cols-[100px_1fr]">
                                <div className="font-bold text-xs text-gray-700 pt-2">
                                    <span className="text-red-500 mr-1">*</span>답변
                                </div>
                                <textarea
                                    value={formAnswer}
                                    onChange={(e) => setFormAnswer(e.target.value)}
                                    className="w-full h-64 p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500 text-xs resize-none"
                                    placeholder="답변 내용을 입력하세요"
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end space-x-2 bg-white">
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-white border border-red-500 text-red-500 rounded text-xs font-bold hover:bg-red-50"
                            >
                                저장
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 bg-gray-800 text-white rounded text-xs font-bold hover:bg-gray-700"
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

export default FAQManagement;
