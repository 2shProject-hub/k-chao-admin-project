import React, { useState, useMemo } from 'react';
import DataList from './DataList';
import { Inquiry, InquiryStatus } from '../types';
import { X } from 'lucide-react';

const MOCK_INQUIRIES: Inquiry[] = [
    {
        id: '1',
        title: '앱 실행이 안돼요',
        userId: '1',
        userEmail: 'v.le@gmail.com',
        userNickname: 'Le Van An',
        content: '앱을 실행하면 바로 종료됩니다. 아이폰 13 사용중입니다.',
        status: 'PENDING',
        createdAt: '2024-05-25 14:30'
    },
    {
        id: '2',
        title: '결제 취소 요청합니다',
        userId: '2',
        userEmail: 'n.tran@fb.com',
        userNickname: 'Tran Thi Binh',
        content: '잘못 결제했습니다. 취소 부탁드려요.',
        answer: '취소 처리 되었습니다. 환불은 영업일 기준 3~5일 소요됩니다.',
        status: 'ANSWERED',
        createdAt: '2024-05-24 09:15',
        answeredAt: '2024-05-24 10:30'
    },
    {
        id: '3',
        title: '레벨 테스트 관련 문의',
        userId: '3',
        userEmail: 'p.nguyen@apple.com',
        userNickname: 'Nguyen Minh',
        content: '레벨 테스트 결과가 이상합니다. 재응시 가능한가요?',
        status: 'PENDING',
        createdAt: '2024-05-23 18:20'
    },
    ...Array.from({ length: 20 }).map((_, i) => ({
        id: `temp-${i}`,
        title: `문의 사항입니다 ${i}`,
        userId: `user-${i}`,
        userEmail: `user${i}@example.com`,
        userNickname: `사용자_${i}`,
        content: `문의 내용입니다. 확인 부탁드립니다. (${i})`,
        status: (i % 3 === 0 ? 'ANSWERED' : 'PENDING') as InquiryStatus,
        answer: i % 3 === 0 ? '답변입니다. 감사합니다.' : undefined,
        createdAt: `2024-05-${20 - i} 10:00`,
        answeredAt: i % 3 === 0 ? `2024-05-${20 - i} 14:00` : undefined
    }))
];

const InquiryManagement: React.FC = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [answerText, setAnswerText] = useState('');

    // Search/Filter states
    const [searchParams, setSearchParams] = useState({
        status: 'ALL',
        keyword: ''
    });
    const [appliedParams, setAppliedParams] = useState(searchParams);

    const filteredInquiries = useMemo(() => {
        return inquiries
            .filter(inquiry => {
                const matchStatus = appliedParams.status === 'ALL' || inquiry.status === appliedParams.status;
                const matchKeyword = appliedParams.keyword === '' ||
                    inquiry.title.includes(appliedParams.keyword) ||
                    inquiry.userNickname.includes(appliedParams.keyword) ||
                    inquiry.userEmail.includes(appliedParams.keyword);

                return matchStatus && matchKeyword;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [inquiries, appliedParams]);

    const handleOpenModal = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setAnswerText(inquiry.answer || '');
    };

    const handleCloseModal = () => {
        setSelectedInquiry(null);
        setAnswerText('');
    };

    const handleSubmitAnswer = () => {
        if (!selectedInquiry || !answerText.trim()) return;

        const updatedInquiries = inquiries.map(item => {
            if (item.id === selectedInquiry.id) {
                return {
                    ...item,
                    status: 'ANSWERED' as InquiryStatus,
                    answer: answerText,
                    answeredAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
                };
            }
            return item;
        });

        setInquiries(updatedInquiries);
        handleCloseModal();
    };

    const getStatusLabel = (status: InquiryStatus) => {
        return status === 'PENDING' ? '대기 중' : '답변 완료';
    };

    const columns = [
        {
            header: 'No',
            accessor: (item: Inquiry) => filteredInquiries.indexOf(item) !== -1 ? filteredInquiries.length - filteredInquiries.indexOf(item) : 0,
            width: 'w-16 text-center'
        },
        {
            header: '제목',
            accessor: (item: Inquiry) => (
                <span
                    className="cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => handleOpenModal(item)}
                >
                    {item.title}
                </span>
            ),
            width: 'flex-1'
        },
        { header: '등록 계정', accessor: 'userEmail' as keyof Inquiry, width: 'w-48' },
        { header: '닉네임', accessor: 'userNickname' as keyof Inquiry, width: 'w-32' },
        { header: '등록일시', accessor: 'createdAt' as keyof Inquiry, width: 'w-36 text-center' },
        {
            header: '상태',
            accessor: (item: Inquiry) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {getStatusLabel(item.status)}
                </span>
            ),
            width: 'w-24 text-center'
        },
        { header: '변경일시', accessor: (item: Inquiry) => item.answeredAt || '-', width: 'w-36 text-center' },
    ];

    const renderFilter = (
        <div className="flex border-b border-gray-200 text-xs">
            <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">상태</div>
            <div className="w-48 p-2 border-r border-gray-200">
                <select
                    className="w-full h-8 px-2 border border-gray-300 rounded focus:outline-none"
                    value={searchParams.status}
                    onChange={e => setSearchParams({ ...searchParams, status: e.target.value })}
                >
                    <option value="ALL">전체</option>
                    <option value="PENDING">대기 중</option>
                    <option value="ANSWERED">답변 완료</option>
                </select>
            </div>
            <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">검색</div>
            <div className="flex-1 p-2">
                <input
                    type="text"
                    placeholder="제목, 계정, 닉네임 검색"
                    className="w-full h-8 px-3 border border-gray-300 rounded focus:outline-none"
                    value={searchParams.keyword}
                    onChange={e => setSearchParams({ ...searchParams, keyword: e.target.value })}
                />
            </div>
        </div>
    );

    return (
        <>
            <DataList
                title="게시판 관리 > 문의 관리"
                breadcrumb="게시판 관리 > 문의 관리"
                data={filteredInquiries}
                columns={columns}
                renderFilter={renderFilter}
                onSearch={() => setAppliedParams(searchParams)}
                onReset={() => {
                    const reset = { status: 'ALL', keyword: '' };
                    setSearchParams(reset);
                    setAppliedParams(reset);
                }}
            />

            {selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">문의 상세</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className="block text-gray-500 mb-1">제목</label>
                                    <div className="font-medium text-gray-900">{selectedInquiry.title}</div>
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">상태</label>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedInquiry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {getStatusLabel(selectedInquiry.status)}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">등록 계정</label>
                                    <div className="text-gray-900">{selectedInquiry.userEmail}</div>
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">닉네임</label>
                                    <div className="text-gray-900">{selectedInquiry.userNickname}</div>
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">등록일시</label>
                                    <div className="text-gray-900">{selectedInquiry.createdAt}</div>
                                </div>
                                {selectedInquiry.status === 'ANSWERED' && (
                                    <div>
                                        <label className="block text-gray-500 mb-1">답변/변경 일시</label>
                                        <div className="text-gray-900">{selectedInquiry.answeredAt}</div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <label className="block text-gray-500 mb-2">문의 내용</label>
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-800 whitespace-pre-wrap min-h-[100px]">
                                    {selectedInquiry.content}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <label className="block text-gray-500 mb-2">답변 내용</label>
                                {selectedInquiry.status === 'PENDING' ? (
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        placeholder="답변 내용을 입력하세요..."
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                    ></textarea>
                                ) : (
                                    <div className="bg-blue-50 p-4 rounded-lg text-gray-800 whitespace-pre-wrap min-h-[100px] border border-blue-100">
                                        {selectedInquiry.answer}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                닫기
                            </button>
                            {selectedInquiry.status === 'PENDING' && (
                                <button
                                    onClick={handleSubmitAnswer}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                >
                                    답변 등록
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InquiryManagement;
