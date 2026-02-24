
import React, { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';

interface PushItem {
  id: string;
  type: string;
  name: string; // title -> name
  scheduledAt: string;
  isSent: 'Y' | 'N';
  createdAt: string;
  content?: string;
  target?: string;
  landingPage?: string;
}

const MOCK_PUSHES: PushItem[] = [
  {
    id: '1',
    type: '출석',
    name: '추석에 딱 어울리는 이 표현!',
    scheduledAt: '2024-09-11 06:00',
    isSent: 'Y',
    createdAt: '2024-09-11 09:30',
    content: '안녕하세요! 추석 명절 잘 보내고 계신가요? 오늘은 명절에 쓰기 좋은 한국어 표현을 배워보세요.',
    target: '전체 사용자',
    landingPage: '이벤트 페이지'
  },
  {
    id: '2',
    type: '출석',
    name: '오늘의 학습을 잊지 마세요!',
    scheduledAt: '2024-09-05 12:00',
    isSent: 'Y',
    createdAt: '2024-09-05 10:15',
    content: '매일 10분, 꾸준함이 실력을 만듭니다. 지금 바로 오늘의 레슨을 시작하세요!',
    target: '전체 사용자',
    landingPage: '학습 코스'
  },
  {
    id: '3',
    type: '학습 독려',
    name: '레벨업까지 단 1단계!',
    scheduledAt: '2024-10-01 18:00',
    isSent: 'N',
    createdAt: '2024-09-28 14:20',
    content: '조금만 더 힘내세요! 이번 유닛만 완료하면 다음 레벨로 승급합니다.',
    target: '유료 회원',
    landingPage: '메인 화면'
  },
];

const PushManagement: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'REGISTER'>('LIST');
  const [pushes] = useState<PushItem[]>(MOCK_PUSHES);
  const [selectedPush, setSelectedPush] = useState<PushItem | null>(null);

  if (view === 'REGISTER') {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center space-x-2">
          <ChevronLeft className="h-4 w-4 text-gray-400 cursor-pointer" onClick={() => setView('LIST')} />
          {/* Header removed */}
        </div>

        <div className="bg-white border-t-2 border-gray-800 shadow-sm">
          <div className="bg-[#F1F3F6] p-2 text-xs font-bold border-b border-gray-200 uppercase">New Push Notification</div>

          {[
            {
              label: '푸시 일시', required: true, content: (
                <div className="flex items-center space-x-2 text-xs">
                  <input type="date" className="h-8 border border-gray-300 px-2 rounded focus:outline-none" />
                  <select className="h-8 border border-gray-300 px-2 rounded bg-white focus:outline-none w-24">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')} 시</option>
                    ))}
                  </select>
                  <select className="h-8 border border-gray-300 px-2 rounded bg-white focus:outline-none w-24">
                    {['00', '10', '20', '30', '40', '50'].map(m => (
                      <option key={m} value={m}>{m} 분</option>
                    ))}
                  </select>
                </div>
              )
            },
            {
              label: '푸시 대상', required: true, content: (
                <select className="w-full max-w-[400px] h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none text-xs">
                  <option>전체 사용자</option>
                  <option>무료 회원</option>
                  <option>유료 회원</option>
                  <option>3일 이상 미접속자</option>
                </select>
              )
            },
            {
              label: '푸시 형태', required: true, content: (
                <div className="flex items-center space-x-4 text-xs">
                  {['출석', '학습 독려', '공지사항', '이벤트'].map((type, i) => (
                    <label key={i} className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="push_type" defaultChecked={i === 0} />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              )
            },
            {
              label: '푸시 이미지', content: (
                <div className="flex items-center space-x-2">
                  <input type="text" className="flex-1 max-w-[400px] h-8 px-3 border border-gray-300 rounded bg-gray-50 text-xs" placeholder="이미지 URL을 입력하거나 파일을 선택하세요" readOnly />
                  <label className="px-4 py-1.5 bg-white border border-gray-300 text-gray-600 rounded text-[11px] font-bold hover:bg-gray-50 cursor-pointer shadow-sm">
                    파일 선택
                    <input type="file" className="hidden" />
                  </label>
                </div>
              )
            },
            {
              label: '푸시명', required: true, content: (
                <input type="text" className="w-full max-w-[600px] h-8 px-3 border border-gray-300 rounded focus:outline-none text-xs" placeholder="푸시명을 입력하세요" />
              )
            },
            {
              label: '푸시 내용', required: true, content: (
                <textarea className="w-full max-w-[600px] h-20 p-3 border border-gray-300 rounded focus:outline-none text-xs resize-none" placeholder="사용자에게 보여질 메시지 내용을 입력하세요"></textarea>
              )
            },
            {
              label: '랜딩 페이지', content: (
                <select className="w-full max-w-[400px] h-8 px-3 border border-gray-300 rounded bg-white focus:outline-none text-xs">
                  <option>메인 화면</option>
                  <option>학습 코스</option>
                  <option>공지사항 상세</option>
                  <option>이벤트 페이지</option>
                </select>
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
          <button className="flex items-center px-10 py-2 bg-gray-800 text-white rounded text-xs font-bold hover:bg-gray-700 transition-all shadow-md">
            푸시 등록 완료 <ChevronRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Back button removed */}

      {/* Filter */}
      <div className="bg-white border border-gray-200 shadow-sm text-[11px]">
        <div className="grid grid-cols-[160px_1fr_160px_1fr] border-b border-gray-100">
          <div className="bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">발송 여부</div>
          <div className="p-2 flex items-center space-x-4 border-r border-gray-200">
            <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="f_sent" defaultChecked /> <span>전체</span></label>
            <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="f_sent" /> <span>발송(Y)</span></label>
            <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="f_sent" /> <span>미발송(N)</span></label>
          </div>
          <div className="bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">푸시 형태</div>
          <div className="p-2 flex items-center">
            <select className="w-full h-8 px-2 border border-gray-300 rounded bg-white focus:outline-none">
              <option>전체</option>
              <option>출석</option>
              <option>학습 독려</option>
              <option>공지사항</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-[160px_1fr]">
          <div className="bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">검색어</div>
          <div className="p-2 flex items-center space-x-2">
            <select className="h-8 px-2 border border-gray-300 rounded bg-white focus:outline-none">
              <option>푸시명</option>
              <option>내용</option>
            </select>
            <input type="text" className="flex-1 h-8 px-3 border border-gray-300 rounded focus:outline-none" placeholder="검색어를 입력하세요" />
            <button className="px-4 py-1.5 bg-gray-500 text-white rounded font-bold hover:bg-gray-600 flex items-center transition-colors">
              검색 <ChevronRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600 font-bold">Total : <span className="text-blue-600 font-black">{pushes.length}</span> 건</div>
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

      {/* Table Area */}
      <div className="bg-white border-t-2 border-gray-800 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#F1F3F6] border-b border-gray-200 text-[11px] font-bold text-gray-700">
            <tr className="h-10">
              <th className="px-2 border-r border-gray-200 w-12 text-center">No</th>
              <th className="px-4 border-r border-gray-200 w-32 text-center">푸시 형태</th>
              <th className="px-4 border-r border-gray-200 text-center">푸시명</th>
              <th className="px-4 border-r border-gray-200 w-44 text-center">푸시 예정 일시</th>
              <th className="px-4 border-r border-gray-200 w-24 text-center">발송 여부</th>
              <th className="px-4 border-r border-gray-200 w-40 text-center">등록 일시</th>
              <th className="px-2 w-20 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[11px] text-gray-600">
            {pushes.map((item, idx) => (
              <tr key={idx} className="h-10 text-center hover:bg-gray-50">
                <td className="border-r border-gray-200">{pushes.length - idx}</td>
                <td className="border-r border-gray-200">
                  <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-sm text-[10px]">{item.type}</span>
                </td>
                <td className="border-r border-gray-200 text-left px-4">
                  <div
                    onClick={() => setSelectedPush(item)}
                    className="text-blue-500 font-medium hover:underline cursor-pointer truncate max-w-[400px]"
                  >
                    {item.name}
                  </div>
                </td>
                <td className="border-r border-gray-200">{item.scheduledAt}</td>
                <td className="border-r border-gray-200 font-bold">
                  <span className={item.isSent === 'Y' ? 'text-blue-600' : 'text-red-500'}>{item.isSent}</span>
                </td>
                <td className="border-r border-gray-200 text-gray-400">{item.createdAt}</td>
                <td>
                  <button className="text-[10px] text-gray-400 hover:text-red-500 font-bold">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Push Detail Popup */}
      {selectedPush && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-3xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b bg-[#1E293B]">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">푸시 상세 정보</h2>
              <button onClick={() => setSelectedPush(null)} className="p-1 hover:bg-gray-700 rounded transition-colors text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="bg-white border border-gray-200">
                {[
                  { label: '푸시 일시', content: selectedPush.scheduledAt },
                  { label: '푸시 대상', content: selectedPush.target || '전체 사용자' },
                  { label: '푸시 형태', content: selectedPush.type },
                  { label: '푸시명', content: selectedPush.name },
                  {
                    label: '푸시 내용', content: (
                      <div className="min-h-[60px] whitespace-pre-wrap">{selectedPush.content || '내용 없음'}</div>
                    )
                  },
                  { label: '랜딩 페이지', content: selectedPush.landingPage || '메인 화면' },
                  {
                    label: '발송 여부', content: (
                      <span className={`font-bold ${selectedPush.isSent === 'Y' ? 'text-blue-600' : 'text-red-500'}`}>
                        {selectedPush.isSent === 'Y' ? '발송 완료' : '발송 대기'}
                      </span>
                    )
                  },
                  { label: '등록 일시', content: selectedPush.createdAt },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-[160px_1fr] border-b border-gray-100 last:border-0 min-h-[40px]">
                    <div className="bg-[#F1F3F6] px-4 py-2 text-[11px] font-bold flex items-center border-r border-gray-100">
                      {row.label}
                    </div>
                    <div className="p-3 text-xs text-gray-700 flex items-center">{row.content}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
              <button
                onClick={() => setSelectedPush(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-bold text-xs hover:bg-gray-300 transition-colors"
              >
                닫기
              </button>
              {selectedPush.isSent === 'N' && (
                <button className="px-6 py-2 bg-blue-600 text-white rounded font-bold text-xs hover:bg-blue-700 transition-colors">
                  정보 수정
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center space-x-1 py-6 text-[10px] font-bold text-gray-400">
        <button className="px-1.5 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">&lt;&lt;</button>
        <button className="px-1.5 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">&lt;</button>
        <button className="w-6 h-6 flex items-center justify-center bg-gray-800 text-white rounded font-bold">1</button>
        <button className="px-1.5 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">&gt;</button>
        <button className="px-1.5 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">&gt;&gt;</button>
      </div>
    </div>
  );
};

export default PushManagement;
