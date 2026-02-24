
import React, { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';

interface GiftCardItem {
  id: string;
  name: string;
  code: string;
  applyPeriod: string;
  usePeriod: string;
  salesPrice: string;
  userCount: number;
  createdAt: string;
  status: '정상' | '중지';
}

interface UsageHistory {
  nickname: string;
  email: string;
  usedAt: string;
}

const MOCK_GIFT_CARDS: GiftCardItem[] = [
  { id: '4', name: 'Premium 30Days', code: '8273-1928-3746-5501', applyPeriod: '2025.08.16 - 2025.08.31', usePeriod: '30일', salesPrice: '50,000원', userCount: 0, createdAt: '2025.08.15 10:11', status: '정상' },
  { id: '3', name: 'Yearly Pass', code: '1122-3344-5566-7788', applyPeriod: '2024.03.12 - 2069.03.11', usePeriod: '365일', salesPrice: '500,000원', userCount: 3, createdAt: '2024.03.12 15:20', status: '정상' },
  { id: '2', name: 'Starter Kit', code: '9000-1234-5678-0000', applyPeriod: '2023.06.23 - 2023.08.01', usePeriod: '7일', salesPrice: '0원', userCount: 3, createdAt: '2023.06.23 09:45', status: '정상' },
  { id: '1', name: 'Basic Pass', code: '4455-6677-8899-0011', applyPeriod: '2023.01.09 - 2023.01.14', usePeriod: '30일', salesPrice: '20,000원', userCount: 2, createdAt: '2023.01.09 11:30', status: '정상' },
];

const MOCK_USAGE_HISTORY: UsageHistory[] = [
  { nickname: 'Bui Thi G', email: 'b.g@example.com', usedAt: '2025.08.20 11:22:33' },
  { nickname: 'Nguyen Van H', email: 'v.h@example.com', usedAt: '2025.08.21 14:15:00' },
  { nickname: 'Doan Minh I', email: 'm.i@example.com', usedAt: '2025.08.22 09:10:05' },
];

const GiftCardManagement: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'REGISTER'>('LIST');
  const [data] = useState<GiftCardItem[]>(MOCK_GIFT_CARDS);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCardItem | null>(null);

  if (view === 'REGISTER') {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center space-x-2">
          <ChevronLeft className="h-4 w-4 text-gray-400 cursor-pointer" onClick={() => setView('LIST')} />
          {/* Header removed */}
        </div>

        <div className="bg-white border-t-2 border-gray-800 shadow-sm">
          <div className="bg-[#F1F3F6] p-2 text-xs font-bold border-b border-gray-200">등록</div>

          {[
            {
              label: '기프트 카드명', required: true, content: (
                <input type="text" className="w-full max-w-[400px] h-8 px-3 border border-gray-300 rounded focus:outline-none text-xs" placeholder="기프트 카드명을 입력하세요" />
              )
            },
            {
              label: '기프트 카드 코드', required: true, content: (
                <div className="flex items-center space-x-2">
                  <input type="text" className="w-full max-w-[400px] h-8 px-3 border border-gray-300 rounded focus:outline-none text-xs font-mono" placeholder="16자리 난수번호를 입력하세요" maxLength={19} />
                  <button className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] font-bold hover:bg-gray-200 transition-colors">난수 생성</button>
                </div>
              )
            },
            {
              label: '신청기간', required: true, content: (
                <div className="flex items-center space-x-2 text-xs">
                  <input type="date" className="h-8 border border-gray-300 px-2 rounded focus:outline-none" />
                  <span>-</span>
                  <input type="date" className="h-8 border border-gray-300 px-2 rounded focus:outline-none" />
                </div>
              )
            },
            {
              label: '사용기간', required: true, content: (
                <div className="flex items-center space-x-2 text-xs">
                  <input type="number" defaultValue="0" className="w-20 h-8 px-2 border border-gray-300 rounded text-right focus:outline-none" />
                  <span>일</span>
                </div>
              )
            },
            {
              label: '판매가', required: true, content: (
                <div className="flex items-center space-x-2 text-xs">
                  <input type="number" defaultValue="0" className="w-32 h-8 px-2 border border-gray-300 rounded text-right focus:outline-none" />
                  <span>원</span>
                </div>
              )
            },
            {
              label: '설명', content: (
                <div className="w-full border border-gray-300 rounded overflow-hidden">
                  <div className="bg-[#F8F9FA] border-b border-gray-300 p-2 flex flex-wrap gap-2 items-center">
                    <select className="text-[10px] border border-gray-300 rounded px-1 h-6 bg-white"><option>본고딕</option></select>
                    <select className="text-[10px] border border-gray-300 rounded px-1 h-6 bg-white"><option>17px</option></select>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                    {['B', 'I', 'U', 'S', '"'].map((btn, i) => (
                      <button key={i} className="w-6 h-6 hover:bg-gray-200 rounded text-xs font-bold">{btn}</button>
                    ))}
                    <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                    <div className="flex space-x-1">
                      <div className="w-6 h-4 bg-black border border-gray-400"></div>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="min-h-[250px] p-4 bg-white"></div>
                </div>
              )
            },
            {
              label: '판매여부', content: (
                <div className="flex items-center space-x-4 text-xs">
                  <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="sale" /> <span>판매</span></label>
                  <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="sale" defaultChecked /> <span>중지</span></label>
                </div>
              )
            },
            {
              label: '상태', content: (
                <div className="flex items-center space-x-4 text-xs">
                  <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="status" /> <span>정상</span></label>
                  <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="status" defaultChecked /> <span>중지</span></label>
                </div>
              )
            },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-[160px_1fr] border-b border-gray-100 last:border-0 min-h-[40px]">
              <div className="bg-[#F1F3F6] px-4 py-2 text-[11px] font-bold flex items-center">
                {row.label}
                {row.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              <div className="p-2 flex items-center">{row.content}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setView('LIST')}
            className="flex items-center px-4 py-1.5 border border-gray-300 bg-white text-gray-600 rounded text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            목록 <ChevronRight className="ml-1 h-3 w-3 rotate-180" />
          </button>
          <button className="flex items-center px-8 py-2 bg-white border border-gray-300 text-gray-800 rounded text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
            등록 <ChevronRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Back button removed */}

      <div className="bg-white border border-gray-200 shadow-sm text-[11px]">
        <div className="grid grid-cols-[160px_1fr] border-b border-gray-100">
          <div className="bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">상태</div>
          <div className="p-2 flex items-center space-x-4">
            <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="f_status" defaultChecked /> <span>전체</span></label>
            <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="f_status" /> <span>정상</span></label>
            <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="f_status" /> <span>중지</span></label>
          </div>
        </div>
        <div className="grid grid-cols-[160px_1fr]">
          <div className="bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">검색</div>
          <div className="p-2 flex items-center space-x-2">
            <select className="h-8 px-2 border border-gray-300 rounded bg-white focus:outline-none">
              <option>- 전체 -</option>
              <option>기프트 카드명</option>
              <option>코드</option>
            </select>
            <input type="text" className="flex-1 h-8 px-3 border border-gray-300 rounded focus:outline-none" />
            <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-600 rounded font-bold hover:bg-gray-50 flex items-center">
              검색 <ChevronRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600 font-bold">Total : <span className="text-blue-600 font-black">{data.length}</span> 건</div>
        <div className="flex space-x-1">
          <button className="flex items-center px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded text-[11px] font-bold hover:bg-gray-50 transition-colors">
            EXCEL <ChevronRight className="ml-1 h-3 w-3" />
          </button>
          <button
            onClick={() => setView('REGISTER')}
            className="flex items-center px-4 py-1 bg-white border border-gray-300 text-gray-600 rounded text-[11px] font-bold hover:bg-gray-50 transition-colors"
          >
            등록 <ChevronRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="bg-white border-t-2 border-gray-800 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#F1F3F6] border-b border-gray-200 text-[11px] font-bold text-gray-700">
            <tr className="h-10">
              <th className="px-2 border-r border-gray-200 w-12 text-center">No</th>
              <th className="px-4 border-r border-gray-200 w-48 text-center">기프트 카드 코드</th>
              <th className="px-4 border-r border-gray-200 text-center">기프트 카드명</th>
              <th className="px-4 border-r border-gray-200 w-44 text-center">신청기간</th>
              <th className="px-4 border-r border-gray-200 w-20 text-center">사용기간</th>
              <th className="px-4 border-r border-gray-200 w-28 text-center">판매가</th>
              <th className="px-4 border-r border-gray-200 w-20 text-center">사용자</th>
              <th className="px-4 border-r border-gray-200 w-32 text-center">생성 일시</th>
              <th className="px-2 w-16 text-center">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[11px] text-gray-600">
            {data.map((item, idx) => (
              <tr key={idx} className="h-10 text-center hover:bg-gray-50">
                <td className="border-r border-gray-200">{item.id}</td>
                <td className="border-r border-gray-200 font-mono text-gray-500">{item.code}</td>
                <td className="border-r border-gray-200 text-left px-4">
                  <div
                    onClick={() => setSelectedGiftCard(item)}
                    className="text-blue-500 font-medium hover:underline cursor-pointer"
                  >
                    {item.name}
                  </div>
                </td>
                <td className="border-r border-gray-200">{item.applyPeriod}</td>
                <td className="border-r border-gray-200">{item.usePeriod}</td>
                <td className="border-r border-gray-200">{item.salesPrice}</td>
                <td className="border-r border-gray-200 text-blue-600 font-bold">{item.userCount}명</td>
                <td className="border-r border-gray-200">{item.createdAt}</td>
                <td>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${item.status === '정상' ? 'bg-[#4A90E2]' : 'bg-gray-400'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedGiftCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b bg-[#1E293B]">
              <h2 className="text-sm font-bold text-white">
                기프트 카드 사용 현황 : <span className="text-orange-400 font-black">[{selectedGiftCard.name}]</span>
              </h2>
              <button onClick={() => setSelectedGiftCard(null)} className="p-1 hover:bg-gray-700 rounded transition-colors text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="bg-white border border-gray-200">
                <table className="w-full border-collapse">
                  <thead className="bg-[#F1F3F6] border-b border-gray-200 text-[11px] font-bold text-gray-700">
                    <tr className="h-10">
                      <th className="px-4 border-r border-gray-200 w-12 text-center">No</th>
                      <th className="px-4 border-r border-gray-200 text-center">사용자 닉네임</th>
                      <th className="px-4 border-r border-gray-200 text-center">계정(Email)</th>
                      <th className="px-4 text-center">사용 일시</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-[11px] text-gray-600">
                    {MOCK_USAGE_HISTORY.map((usage, i) => (
                      <tr key={i} className="h-10 hover:bg-gray-50">
                        <td className="border-r border-gray-200 text-center">{i + 1}</td>
                        <td className="border-r border-gray-200 px-4 font-bold">{usage.nickname}</td>
                        <td className="border-r border-gray-200 px-4 text-blue-500">{usage.email}</td>
                        <td className="px-4 text-center">{usage.usedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-center">
              <button
                onClick={() => setSelectedGiftCard(null)}
                className="px-8 py-2 bg-gray-800 text-white rounded font-bold text-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center space-x-1 py-6 text-[10px] font-bold text-gray-400">
        <button className="px-1.5 py-1 border border-gray-200 rounded">&lt;&lt;</button>
        <button className="px-1.5 py-1 border border-gray-200 rounded">&lt;</button>
        <button className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded font-bold">1</button>
        <button className="px-1.5 py-1 border border-gray-200 rounded">&gt;</button>
        <button className="px-1.5 py-1 border border-gray-200 rounded">&gt;&gt;</button>
      </div>
    </div>
  );
};

export default GiftCardManagement;
