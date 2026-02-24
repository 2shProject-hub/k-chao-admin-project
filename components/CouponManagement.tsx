
import React, { useState } from 'react';
import { Search, Plus, Calendar, FileText, ChevronLeft, Download, ChevronRight, X } from 'lucide-react';

interface CouponItem {
  id: string;
  couponId: string;
  couponCode: string;
  name: string;
  benefit: string;
  benefitType: 'fixed' | 'rate';
  expiry: string;
  useDays: string;
  issueCount: number;
  status: '정상' | '중지';
  createdAt: string; // 추가된 생성 일시
}

interface UsageHistory {
  nickname: string;
  email: string;
  usedAt: string;
}

const MOCK_COUPONS: CouponItem[] = [
  { id: '1', couponId: '21404', couponCode: 'ABCD-1234-EFGH-5678', name: '회원사 쿠폰', benefit: '50,000원', benefitType: 'fixed', expiry: '2025.10.15 - 2025.10.16', useDays: '-', issueCount: 5018, status: '정상', createdAt: '2025.09.15 14:20' },
  { id: '2', couponId: '21270', couponCode: 'KF92-XJ23-PL09-QW11', name: 'test', benefit: '100%', benefitType: 'rate', expiry: '2025.09.18 - 2025.09.18', useDays: '-', issueCount: 0, status: '정상', createdAt: '2025.09.10 09:30' },
  { id: '3', couponId: '21237', couponCode: 'MNBV-0987-LKJH-6543', name: '쿠폰 테스트', benefit: '10,000원', benefitType: 'fixed', expiry: '2025.09.12 - 2025.09.13', useDays: '10일', issueCount: 100, status: '중지', createdAt: '2025.09.01 18:15' },
  { id: '4', couponId: '17789', couponCode: 'POIU-5544-YTRE-3322', name: '100%쿠폰', benefit: '100%', benefitType: 'rate', expiry: '2024.01.10 - 2024.01.20', useDays: '-', issueCount: 12, status: '정상', createdAt: '2023.12.28 11:05' },
];

const MOCK_USAGE_HISTORY: UsageHistory[] = [
  { nickname: 'Nguyen Van A', email: 'v.a@example.com', usedAt: '2025.09.20 14:30:21' },
  { nickname: 'Tran Thi B', email: 't.b@example.com', usedAt: '2025.09.21 10:15:45' },
  { nickname: 'Le Minh C', email: 'm.c@example.com', usedAt: '2025.09.21 16:40:10' },
  { nickname: 'Pham Hoang D', email: 'p.d@example.com', usedAt: '2025.09.22 09:12:33' },
  { nickname: 'Vu Thanh E', email: 'v.e@example.com', usedAt: '2025.09.22 13:55:00' },
];

const CouponManagement: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'REGISTER'>('LIST');
  const [coupons] = useState<CouponItem[]>(MOCK_COUPONS);
  const [regBenefitType, setRegBenefitType] = useState<'fixed' | 'rate'>('fixed');
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);

  if (view === 'REGISTER') {
    const generateRandomCode = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent accidental form submissions if inside a form
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) result += '-';
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      // Ideally this should set a state, but we are using DOM manipulation for this mock or uncontrolled input approach.
      // For a controlled component, we would use state. Here I'll assume we can target the input via ID or Refs if strict, 
      // but since we're using a map for UI rendering, I need to update how we render the "content" to include state.

      // Let's assume we want to update the input value. 
      // The simplest way without refactoring the entire map structure to use state for every field
      // is to find the input element and set its value directly for this demo, 
      // OR better, refactor the specific row content to include the button and handler inline.
      const input = document.getElementById('coupon-code-input') as HTMLInputElement;
      if (input) {
        input.value = result;
      }
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between">
          {/* Header removed */}
        </div>

        <div className="bg-white border border-blue-200 p-4 rounded text-xs text-blue-800 leading-relaxed shadow-sm">
          <p className="font-bold text-sm mb-2">쿠폰 유효기간 및 사용일수 안내</p>
          <p>유효기간은 필수, 사용일수는 선택 사항입니다.</p>
          <p>* 유효기간과 관계없이 사용일수 기준으로만 쿠폰을 운영하려면, 유효기간을 충분히 길게 설정해 주세요.</p>
          <p>* 사용일수가 설정되어 있더라도 유효기간이 우선 적용됩니다.</p>
        </div>

        <div className="bg-white border-t-2 border-gray-800 shadow-sm">
          {[
            {
              label: '쿠폰명', required: true, content: (
                <input type="text" className="w-full max-w-[500px] h-8 px-3 border border-gray-300 rounded focus:outline-none text-sm" placeholder="쿠폰명을 입력하세요" />
              )
            },
            {
              label: '쿠폰 코드', required: false, content: (
                <div className="flex items-center space-x-2">
                  <input
                    id="coupon-code-input"
                    type="text"
                    className="w-full max-w-[400px] h-8 px-3 border border-gray-300 rounded focus:outline-none text-xs font-mono"
                    placeholder="16자리 난수가 자동 생성됩니다"
                    maxLength={19}
                  />
                  <button
                    onClick={generateRandomCode}
                    className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] font-bold hover:bg-gray-200 transition-colors"
                  >
                    난수 생성
                  </button>
                </div>
              )
            },
            {
              label: '할인구분', required: true, content: (
                <div className="flex items-center space-x-6 text-xs w-full">
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="discType" checked={regBenefitType === 'fixed'} onChange={() => setRegBenefitType('fixed')} />
                      <span>정액</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="discType" checked={regBenefitType === 'rate'} onChange={() => setRegBenefitType('rate')} />
                      <span>정률</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded">
                    <span className="font-bold">할인가</span>
                    <input type="number" defaultValue="0" className="w-32 h-8 px-3 border border-gray-300 rounded text-right focus:outline-none bg-white" />
                    <span>{regBenefitType === 'fixed' ? '원' : '%'}</span>
                  </div>
                </div>
              )
            },
            {
              label: '발행수', content: (
                <div className="flex items-center space-x-2 text-xs">
                  <input type="number" defaultValue="0" className="w-24 h-8 px-3 border border-gray-300 rounded text-right focus:outline-none" />
                  <span>장</span>
                </div>
              )
            },
            {
              label: '유효기간', required: true, content: (
                <div className="flex items-center space-x-2 text-xs w-full">
                  <div className="flex items-center space-x-1 flex-1 max-w-[350px]">
                    <input type="date" className="h-8 px-2 border border-gray-300 rounded flex-1 focus:outline-none" />
                    <span>-</span>
                    <input type="date" className="h-8 px-2 border border-gray-300 rounded flex-1 focus:outline-none" />
                  </div>
                  <div className="flex items-center space-x-2 ml-10">
                    <span className="font-bold">사용일수</span>
                    <input type="number" className="w-20 h-8 px-2 border border-gray-300 rounded text-right focus:outline-none" />
                    <span>일</span>
                    <span className="text-gray-400 text-[10px] ml-2">▶ 관리자의 발급일 또는 사용자의 등록일로부터 최대 + n 일로 자동 계산됩니다.</span>
                  </div>
                </div>
              )
            },
            {
              label: '상태', required: true, content: (
                <div className="flex items-center space-x-4 text-xs">
                  <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="status" /> <span>정상</span></label>
                  <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="status" defaultChecked /> <span>중지</span></label>
                  <span className="text-gray-400 ml-2">▶ 중지된 쿠폰은 사용 할 수 없습니다.</span>
                </div>
              )
            },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-[160px_1fr] border-b border-gray-100 last:border-0">
              <div className="bg-[#F1F3F6] p-4 text-xs font-bold flex items-center">
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
            className="flex items-center px-4 py-1.5 border border-gray-300 bg-white text-gray-600 rounded text-xs font-bold hover:bg-gray-50"
          >
            <ChevronLeft className="mr-1 h-3 w-3" /> 목록
          </button>
          <button className="flex items-center px-8 py-2 bg-gray-800 text-white rounded text-xs font-bold hover:bg-gray-700">
            등록 <ChevronRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  const columns = [
    { header: 'No', accessor: (item: CouponItem, idx: number) => coupons.length - idx, width: 'w-12' },
    { header: '쿠폰ID', accessor: 'couponId' as keyof CouponItem, width: 'w-20' },
    { header: '쿠폰 코드', accessor: 'couponCode' as keyof CouponItem, width: 'w-48' },
    {
      header: '쿠폰명', accessor: (item: CouponItem) => (
        <div className="text-left">
          <div
            onClick={() => setSelectedCoupon(item)}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            {item.name}
          </div>
        </div>
      )
    },
    { header: '할인혜택', accessor: 'benefit' as keyof CouponItem, width: 'w-24' },
    { header: '유효기간', accessor: 'expiry' as keyof CouponItem, width: 'w-40' },
    { header: '사용일수', accessor: 'useDays' as keyof CouponItem, width: 'w-20' },
    { header: '발행수', accessor: (item: CouponItem) => item.issueCount.toLocaleString(), width: 'w-20' },
    { header: '생성 일시', accessor: 'createdAt' as keyof CouponItem, width: 'w-32' },
    {
      header: '상태', accessor: (item: CouponItem) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${item.status === '정상' ? 'bg-[#4A90E2]' : 'bg-gray-400'}`}>
          {item.status}
        </span>
      ), width: 'w-16'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header & Back button removed */}

      <div className="flex flex-col text-[11px] bg-white">
        <div className="grid grid-cols-[1fr_1fr] border-b border-gray-100">
          <div className="flex border-r border-gray-100">
            <div className="w-24 bg-[#F1F3F6] p-2.5 font-bold flex items-center justify-center border-r border-gray-100">유효기간</div>
            <div className="flex-1 p-2 flex items-center space-x-2">
              <input type="date" className="h-7 border border-gray-300 rounded px-1 focus:outline-none" />
              <span>-</span>
              <input type="date" className="h-7 border border-gray-300 rounded px-1 focus:outline-none" />
            </div>
          </div>
          <div className="flex">
            <div className="w-24 bg-[#F1F3F6] p-2.5 font-bold flex items-center justify-center border-r border-gray-100">할인구분</div>
            <div className="flex-1 p-2 flex items-center space-x-3">
              {['전체', '정액', '정률'].map((opt, i) => (
                <label key={i} className="flex items-center space-x-1 cursor-pointer">
                  <input type="radio" name="f_disc" defaultChecked={i === 0} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_1fr] border-b border-gray-100">
          <div className="flex border-r border-gray-100">
            <div className="w-24 bg-[#F1F3F6] p-2.5 font-bold flex items-center justify-center border-r border-gray-100">상태</div>
            <div className="flex-1 p-2 flex items-center space-x-3">
              {['전체', '정상', '중지'].map((opt, i) => (
                <label key={i} className="flex items-center space-x-1 cursor-pointer">
                  <input type="radio" name="f_status" defaultChecked={i === 0} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex">
            <div className="w-24 bg-[#F1F3F6] p-2.5 font-bold flex items-center justify-center border-r border-gray-100">쿠폰 코드</div>
            <div className="flex-1 p-2 flex items-center space-x-2">
              <input type="text" className="full h-7 border border-gray-300 rounded text-[11px] px-2 focus:outline-none flex-1" placeholder="16자리 코드를 입력하세요" />
              <button className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] font-bold hover:bg-gray-200 transition-colors">난수 생성</button>
            </div>
          </div>
        </div>
        <div className="flex bg-[#FAFAFA] border-b border-gray-100">
          <div className="w-24 bg-[#F1F3F6] p-2.5 font-bold flex items-center justify-center border-r border-gray-100">검색</div>
          <div className="flex-1 p-2 flex items-center space-x-2">
            <select className="h-7 border border-gray-300 rounded text-[11px] px-2 bg-white">
              <option>- 전체 -</option>
              <option>쿠폰명</option>
              <option>쿠폰ID</option>
            </select>
            <input type="text" className="h-7 border border-gray-300 rounded flex-1 px-3 focus:outline-none bg-white" placeholder="검색어를 입력하세요" />
            <button className="h-7 px-4 bg-gray-500 text-white rounded font-bold text-[11px] flex items-center">
              검색 <ChevronRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600 font-bold">Total : <span className="text-blue-600 font-black">{coupons.length}</span> 건</div>
        <div className="flex space-x-1">
          <button className="flex items-center px-3 py-1 border border-gray-300 bg-white text-gray-600 rounded text-[11px] font-bold hover:bg-gray-50">
            EXCEL <ChevronRight className="ml-1 h-3 w-3" />
          </button>
          <button
            onClick={() => setView('REGISTER')}
            className="flex items-center px-4 py-1 border border-gray-300 bg-white text-gray-600 rounded text-[11px] font-bold hover:bg-gray-50"
          >
            등록 <ChevronRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="bg-white border-t-2 border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-[#F1F3F6] border-b border-gray-200">
            <tr className="text-[11px] font-bold text-gray-700">
              {columns.map((col, i) => (
                <th key={i} className={`px-2 py-3 border-r border-gray-200 last:border-r-0 ${col.width || ''}`}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.map((item, idx) => (
              <tr key={item.id} className="text-center text-[11px] text-gray-600 hover:bg-gray-50">
                {columns.map((col, i) => (
                  <td key={i} className={`px-2 py-3 border-r border-gray-200 last:border-r-0 ${i === 3 ? 'text-left' : ''}`}>
                    {typeof col.accessor === 'function' ? col.accessor(item, idx) : (item[col.accessor as keyof CouponItem] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b bg-[#1E293B]">
              <h2 className="text-sm font-bold text-white">
                쿠폰 사용 현황 : <span className="text-blue-400 font-black">[{selectedCoupon.name}]</span>
              </h2>
              <button onClick={() => setSelectedCoupon(null)} className="p-1 hover:bg-gray-700 rounded transition-colors text-white">
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
                onClick={() => setSelectedCoupon(null)}
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

export default CouponManagement;
