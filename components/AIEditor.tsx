
import React, { useState } from 'react';
import { Sparkles, Play, Save, RotateCcw } from 'lucide-react';
import { generateRoleplayScenario } from '../services/geminiService';

const AIEditor: React.FC = () => {
  const [topic, setTopic] = useState('식당에서 주문하기');
  const [level, setLevel] = useState('초급');
  const [scenario, setScenario] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateRoleplayScenario(topic, level);
      setScenario(result);
    } catch (error) {
      console.error(error);
      alert("AI 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">AI 대화 시나리오 설정</h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm hover:bg-gray-50">
            <RotateCcw className="mr-2 h-4 w-4" /> 초기화
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" /> 저장하기
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">기본 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주제</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="예: 공항에서 체크인하기"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">학습 레벨</label>
                <select 
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>입문</option>
                  <option>초급</option>
                  <option>중급</option>
                  <option>고급</option>
                </select>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
              >
                {isGenerating ? (
                  <>생성 중...</>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" /> AI 시나리오 생성
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">💡 관리자 팁</h4>
            <ul className="text-sm text-blue-700 space-y-2 list-disc pl-4">
              <li>AI 생성 기능을 활용하면 베트남어 번역까지 포함된 초안을 빠르게 만들 수 있습니다.</li>
              <li>생성된 내용은 하단 편집기에서 직접 수정 가능합니다.</li>
              <li>다양한 상황을 연출하려면 구체적인 주제를 입력하세요.</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">시나리오 미리보기 및 편집</h3>
              {scenario && (
                <button className="text-sm flex items-center text-blue-600 hover:underline">
                  <Play className="mr-1 h-4 w-4" /> 실제 앱 테스트
                </button>
              )}
            </div>

            {scenario ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">제목</h4>
                  <p className="text-xl font-bold text-gray-800">{scenario.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">상황 가이드</h4>
                  <p className="p-4 bg-gray-50 rounded-lg text-gray-700">{scenario.context}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">대화 예시</h4>
                  <div className="space-y-4">
                    {scenario.dialogue.map((line: any, idx: number) => (
                      <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'items-start' : 'items-end'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${idx % 2 === 0 ? 'bg-white border border-gray-200 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                          <p className="text-xs opacity-70 mb-1 font-bold">{line.speaker}</p>
                          <p className="font-medium mb-1">{line.text}</p>
                          <p className={`text-xs ${idx % 2 === 0 ? 'text-gray-400' : 'text-blue-100'}`}>{line.translation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                <p>왼쪽 설정 창에서 정보를 입력하고</p>
                <p>AI 시나리오 생성을 클릭하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEditor;
