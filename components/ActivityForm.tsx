
import React, { useState } from 'react';
import { Save, ChevronLeft, Plus, Trash2, Image, Music } from 'lucide-react';

const TEMPLATES = [
  { 
    id: 'quiz', 
    name: '객관식 퀴즈', 
    fields: [
      { key: 'question', label: '질문 텍스트', type: 'text' },
      { key: 'image_url', label: '이미지 URL (선택)', type: 'image' },
      { key: 'correct_answer', label: '정답 번호', type: 'number' }
    ] 
  },
  { 
    id: 'speaking', 
    name: '따라 말하기', 
    fields: [
      { key: 'script', label: '학습 문장', type: 'text' },
      { key: 'audio_url', label: '모범 음성 URL', type: 'audio' },
      { key: 'translation', label: '베트남어 번역', type: 'text' }
    ] 
  }
];

const ActivityForm: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button className="flex items-center text-gray-500 hover:text-gray-800">
          <ChevronLeft className="mr-1 h-4 w-4" /> 목록으로 돌아가기
        </button>
        <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
          <Save className="mr-2 h-4 w-4" /> 액티비티 저장
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
        <section>
          <h3 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">템플릿 선택</h3>
          <div className="grid grid-cols-2 gap-4">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => { setSelectedTemplate(t); setFormData({}); }}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  selectedTemplate.id === t.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <p className="font-bold text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-500 mt-1">{t.fields.length}개의 필수 항목</p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">콘텐츠 세부 설정</h3>
          <div className="space-y-4">
            {selectedTemplate.fields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                {field.type === 'text' && (
                  <input 
                    type="text" 
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                )}
                {field.type === 'number' && (
                  <input 
                    type="number" 
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                )}
                {field.type === 'image' && (
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image className="text-gray-400 h-6 w-6" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      className="flex-1 px-4 py-2 border rounded-lg text-sm" 
                    />
                  </div>
                )}
                {field.type === 'audio' && (
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Music className="text-blue-500 h-5 w-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="오디오 파일 경로 입력"
                      className="flex-1 px-4 py-2 border rounded-lg text-sm" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {selectedTemplate.id === 'quiz' && (
          <section>
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">객관식 선택지</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center space-x-3">
                  <span className="w-6 text-center font-bold text-gray-400">{i}</span>
                  <input type="text" className="flex-1 px-4 py-2 border rounded-lg text-sm" placeholder={`보기 ${i} 내용을 입력하세요`} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ActivityForm;
