import React, { useState } from 'react';
import { Save, Sparkles, Zap, MessageSquare, ShieldAlert } from 'lucide-react';

interface FreeTalkConfig {
  isActive: boolean;
  energyCost: number;
  maxTurns: number;
  systemPrompt: string;
  bannedWords: string[];
}

const MOCK_CONFIG: FreeTalkConfig = {
  isActive: true,
  energyCost: 10,
  maxTurns: 20,
  systemPrompt: '당신은 K-Chao의 한국어 학습을 돕는 친절한 AI 튜터입니다. 사용자가 입력한 나만의 시나리오(상황 설정, 나의 캐릭터, AI 캐릭터)에 깊이 몰입하여 반응해야 합니다. 항상 설정된 AI 역할을 유지하며 대화의 맥락이 끊기지 않도록 자연스럽고 짧은 문장으로 답변 대화를 유도하세요.',
  bannedWords: ['바보', '멍청이', '개새끼', '미친', '죽어']
};

const AIFreeTalkManagement = () => {
  const [formData, setFormData] = useState<FreeTalkConfig>(MOCK_CONFIG);
  const [bannedWordInput, setBannedWordInput] = useState('');

  const handleAddBannedWord = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && bannedWordInput.trim()) {
      e.preventDefault();
      if (!formData.bannedWords.includes(bannedWordInput.trim())) {
        setFormData({
          ...formData,
          bannedWords: [...formData.bannedWords, bannedWordInput.trim()]
        });
      }
      setBannedWordInput('');
    }
  };

  const removeBannedWord = (wordToRemove: string) => {
    setFormData({
      ...formData,
      bannedWords: formData.bannedWords.filter(w => w !== wordToRemove)
    });
  };

  const handleSave = () => {
    // API Call logic would go here
    alert('자유 대화 글로벌 설정이 성공적으로 저장 및 반영되었습니다.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center">
            <MessageSquare className="mr-3 text-indigo-500" />
            자유 대화 설정 관리
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            사용자가 앱에서 직접 시나리오를 작성하는 '자유 대화'의 공통 규칙과 환경을 설정합니다. 리스트 관리가 필요 없는 글로벌 설정입니다.
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
        >
          <Save size={18} className="mr-2" />
          변경사항 저장
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Environment Setup */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Zap className="mr-2 text-amber-500" size={20} />
                환경 설정
              </h3>
            </div>
            <div className="p-6 space-y-8">
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 block">기능 노출 상태</label>
                <div className="flex flex-col space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" checked={formData.isActive} onChange={() => setFormData({ ...formData, isActive: true })} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                    <span className="font-bold text-slate-700">활성 (앱에 즉시 노출)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" checked={!formData.isActive} onChange={() => setFormData({ ...formData, isActive: false })} className="w-4 h-4 text-slate-600 focus:ring-slate-500" />
                    <span className="text-slate-500 font-medium">비활성 (점검/숨김)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">대화 1회당 소모 재화</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min={0}
                    className="w-24 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-black text-center text-slate-700"
                    value={formData.energyCost}
                    onChange={e => setFormData({ ...formData, energyCost: parseInt(e.target.value) || 0 })}
                  />
                  <span className="text-sm font-bold text-slate-500 flex items-center">
                     번개/에너지 소모
                  </span>
                </div>
              </div>

              <div className="space-y-3 pb-2">
                <label className="text-sm font-bold text-slate-700">최대 대화 턴(Turn) 제한</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min={1}
                    className="w-24 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-black text-center text-slate-700"
                    value={formData.maxTurns}
                    onChange={e => setFormData({ ...formData, maxTurns: parseInt(e.target.value) || 1 })}
                  />
                  <span className="text-sm font-bold text-slate-500">턴 (응답 횟수)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">자유 대화 1세션에서 왕복 가능한 최대 횟수입니다.</p>
              </div>

            </div>
          </div>
        </div>

        {/* Right Col: Prompt & Filtering Setup */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Sparkles className="mr-2 text-indigo-500" size={20} />
                AI 프롬프트(지시문) 및 글로벌 필터링
              </h3>
            </div>
            
            <div className="p-6 space-y-8">
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-700 block">시스템 기본 지시문 (System Instruction Base)</label>
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded">사용자가 입력한 설정 내역보다 우선하는 대원칙</span>
                </div>
                <textarea
                  rows={6}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm leading-relaxed bg-[#1E293B] text-slate-300 placeholder:text-slate-600 resize-y shadow-inner"
                  value={formData.systemPrompt}
                  onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
                  placeholder="자유 대화 시작 시 AI에게 주입될 공통 역할을 입력하세요."
                />
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-bold text-slate-800 flex items-center">
                    <ShieldAlert className="mr-2 text-rose-500" size={18} /> 
                    금지어 사전 (Banned Words)
                  </label>
                  <p className="text-xs text-slate-500">
                    사용자가 상황/캐릭터 설정 시 해당 단어를 포함하면 제재하거나, 모델의 답변에 포함되지 않도록 블로킹하는 단어 리스트입니다.
                  </p>
                </div>
                
                <input
                  type="text"
                  placeholder="금지어 입력 후 엔터를 눌러 등록하세요"
                  className="w-full max-w-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none shadow-sm"
                  value={bannedWordInput}
                  onChange={e => setBannedWordInput(e.target.value)}
                  onKeyDown={handleAddBannedWord}
                />
                
                {formData.bannedWords.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400 max-w-sm">
                    등록된 금지어가 없습니다.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 p-5 bg-rose-50/50 rounded-xl border border-rose-100">
                    {formData.bannedWords.map((word, index) => (
                      <span key={index} className="px-3 py-1.5 bg-white border border-rose-200 rounded-full text-sm font-bold text-rose-700 flex items-center shadow-sm">
                        {word}
                        <button onClick={() => removeBannedWord(word)} className="ml-2 pl-2 border-l border-rose-100 text-rose-300 hover:text-rose-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIFreeTalkManagement;
