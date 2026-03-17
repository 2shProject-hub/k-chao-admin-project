import React, { createContext, useContext, useState, ReactNode } from 'react';

// === 글로벌 Description Context 설정 ===
interface DescriptionContextType {
  modalDescriptionKey: string | null;
  setModalDescriptionKey: (key: string | null) => void;
}

export const DescriptionContext = createContext<DescriptionContextType>({
  modalDescriptionKey: null,
  setModalDescriptionKey: () => {},
});

export const useDescription = () => useContext(DescriptionContext);

export const DescriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalDescriptionKey, setModalDescriptionKey] = useState<string | null>(null);
  return (
    <DescriptionContext.Provider value={{ modalDescriptionKey, setModalDescriptionKey }}>
      {children}
    </DescriptionContext.Provider>
  );
};

/**
 * PAGE_DESCRIPTIONS
 * 화면(페이지)별로 우측에 나타날 "기능 설명(Description)" 내용을 컴포넌트 형태로 정의하는 파일입니다.
 * 
 * [등록 방법]
 * 1. 객체의 키(Key) 값으로 화면의 주소(예: '/members/list') 또는 모달 고유키(예: 'modal:학습리포트')를 입력합니다.
 * 2. 값(Value)으로 우측 패널에 보여질 HTML(React) 코드를 작성합니다.
 */
export const PAGE_DESCRIPTIONS: Record<string, React.ReactNode> = {
  'modal:learning-report': (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 flex items-center bg-white/60 inline-flex px-2 py-1 rounded">
          학습 상세 리포트
        </h3>
        <ul className="text-xs text-slate-700 space-y-3 font-semibold tracking-tight">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500 font-black">-</span>
            <span className="leading-relaxed font-medium">APP에서 노출되는 데이터를 ADMIN에 표시</span>
          </li>
          
          <li className="flex flex-col items-start space-y-1">
            <div className="flex">
              <span className="mr-2 text-blue-500 font-black">-</span>
              <span className="leading-relaxed font-bold">선생님 의견</span>
            </div>
            <ul className="pl-4 space-y-1.5 mt-1 text-slate-500">
              <li className="flex items-start">
                <span className="w-1 h-1 rounded-full bg-slate-400 mr-2 mt-1.5"></span>
                <span className="leading-relaxed">AI(LLM)을 통해 생성된 데이터로 ADMIN에서 별도 등록 및 수정 진행하지 않음</span>
              </li>
            </ul>
          </li>

          <li className="flex flex-col items-start space-y-1">
            <div className="flex">
              <span className="mr-2 text-blue-500 font-black">-</span>
              <span className="leading-relaxed font-bold">관리자 메모</span>
            </div>
            <ul className="pl-4 space-y-1.5 mt-1 text-slate-500">
              <li className="flex items-start">
                <span className="w-1 h-1 rounded-full bg-slate-400 mr-2 mt-1.5"></span>
                <span className="leading-relaxed">ADMIN에서만 사용하는 기능으로 등록 및 수정 가능</span>
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 rounded-full bg-slate-400 mr-2 mt-1.5"></span>
                <span className="leading-relaxed">학습자(USER)에게 해당 내용은 제공하지 않음</span>
              </li>
            </ul>
          </li>

          <li className="flex flex-col items-start space-y-1">
            <div className="flex">
              <span className="mr-2 text-blue-500 font-black">-</span>
              <span className="leading-relaxed font-bold">교정 받은 대화 리스트</span>
            </div>
            <ul className="pl-4 space-y-1.5 mt-1 text-slate-500">
              <li className="flex items-start">
                <span className="w-1 h-1 rounded-full bg-slate-400 mr-2 mt-1.5"></span>
                <span className="leading-relaxed">N개 노출 예정으로 스크롤 필요</span>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  ),

  'modal:member-detail': (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 flex items-center bg-white/60 inline-flex px-2 py-1 rounded">
          회원 상세 정보
        </h3>
        <ul className="text-xs text-slate-700 space-y-3 font-semibold tracking-tight">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500 font-black">-</span>
            <span className="leading-relaxed font-medium">학습 내용 타이틀 선택 시 각 레슨에 따른 리포트 표시</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500 font-black">-</span>
            <span className="leading-relaxed font-medium">리포트 내용은 app과 동일한 내용을 표시</span>
          </li>
        </ul>
      </section>
    </div>
  ),

  '/rewards/manage': (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 flex items-center bg-white/60 inline-flex px-2 py-1 rounded">
          보상 관리
        </h3>
        <ul className="text-xs text-slate-700 space-y-3 font-semibold tracking-tight">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500 font-black">-</span>
            <span className="leading-relaxed font-medium">보상은 획득 및 차감으로 구분</span>
          </li>
          <li className="flex flex-col items-start space-y-1">
            <div className="flex">
              <span className="mr-2 text-blue-500 font-black">-</span>
              <span className="leading-relaxed font-bold">admin에 등록된 정보로 보상 획득 및 차감 처리</span>
            </div>
          </li>
          <li className="flex flex-col items-start space-y-1">
            <div className="flex">
              <span className="mr-2 text-blue-500 font-black">-</span>
              <span className="leading-relaxed font-bold">차감은 AI를 사용하는 활동에만 제공</span>
            </div>
            <ul className="pl-4 space-y-1.5 mt-1 text-slate-500">
              <li className="flex items-start">
                <span className="w-1 h-1 rounded-full bg-slate-400 mr-2 mt-1.5"></span>
                <span className="leading-relaxed text-xs">예를 들어 AI대화 학습, AI대화 코너의 항목 등에 사용</span>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  ),
};
