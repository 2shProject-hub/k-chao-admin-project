import React, { useState, useMemo } from 'react';
import DataList from '../DataList';
import { Sparkles, Edit2, Plus, GripVertical, Image as ImageIcon, Trash2, ChevronUp, ChevronDown, Check, X } from 'lucide-react';

interface AICategory {
  id: string;
  type: 'ROLEPLAY' | 'PHOTO';
  name: string;
  order: number;
}

interface AITopic {
  id: string;
  type: 'ROLEPLAY';
  categoryId: string; // 연결된 탭
  title: string;
  description?: string; // 롤플레잉용
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;

  // --- 세부 AI 설정 (선택적 항목들) ---
  aiRole?: string;             // AI 역할
  userRole?: string;           // 사용자 역할
  maxTurns?: number;           // 최대 대화 제한 수
  systemInstruction?: string;  // 시스템 프롬프트(규칙)
  missions?: { id: string, text: string }[]; // 대화 미션 목록
}

const MOCK_CATEGORIES: AICategory[] = [
  { id: 'c1', type: 'ROLEPLAY', name: '생활', order: 1 },
  { id: 'c2', type: 'ROLEPLAY', name: '업무', order: 2 },
  { id: 'c3', type: 'ROLEPLAY', name: '여행', order: 3 },
];

const MOCK_TOPICS: AITopic[] = [
  { 
    id: 't1', type: 'ROLEPLAY', categoryId: 'c1', title: '새로운 친구 만나기', description: '새로운 학년에서 만나는 친구 대화해 보세요.', status: 'ACTIVE', createdAt: '2024-03-18',
    aiRole: '학교 친구', userRole: '전학생', maxTurns: 10,
    systemInstruction: '너는 학교 친구 역할을 맡는다. 유저가 말을 걸면 친근하게 대답해라.',
    missions: [{ id: 'm1', text: '인사 나누기' }, { id: 'm2', text: '이름 물어보기' }]
  },
  { id: 't2', type: 'ROLEPLAY', categoryId: 'c1', title: '주제에 따른 롤플레잉', description: '롤플레잉 활동에 대한 설명.', status: 'ACTIVE', createdAt: '2024-03-17' },
];

const AITopicFormModal = ({
  topic, onClose, categories
}: {
  topic?: AITopic | null, onClose: () => void, categories: AICategory[]
}) => {
  const [activeTab, setActiveTab] = useState<'BASIC' | 'AI_CONFIG'>('BASIC');
  const [formData, setFormData] = useState<Partial<AITopic>>(
    topic || { type: 'ROLEPLAY', status: 'ACTIVE', missions: [], maxTurns: 10 }
  );

  const filteredCategories = categories.filter(c => c.type === 'ROLEPLAY');

  // --- 미션 핸들러 ---
  const handleAddMission = () => {
    setFormData({
      ...formData,
      missions: [...(formData.missions || []), { id: 'm' + Date.now(), text: '' }]
    });
  };

  const updateMission = (id: string, text: string) => {
    setFormData({
      ...formData,
      missions: (formData.missions || []).map(m => m.id === id ? { ...m, text } : m)
    });
  };

  const removeMission = (id: string) => {
    setFormData({
      ...formData,
      missions: (formData.missions || []).filter(m => m.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h3 className="text-xl font-black text-slate-800 flex items-center">
            <Sparkles size={20} className="mr-2 text-indigo-500" />
            AI 주제 {topic ? '수정' : '등록'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'BASIC' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('BASIC')}
          >
            기본 정보 설정
          </button>
          <button
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'AI_CONFIG' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('AI_CONFIG')}
          >
            AI 대화 상세 설정
          </button>
        </div>

        {/* 바디 (스크롤 영역) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
          
          {activeTab === 'BASIC' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">학습 타입</label>
                <div className="flex space-x-4">
                  <label className="flex-1 flex items-center justify-center p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50 text-indigo-700 font-bold cursor-default">
                    롤플레잉
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">카테고리 탭 매핑 <span className="text-red-500">*</span></label>
                  <select
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.categoryId || ''}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">탭 선택</option>
                    {filteredCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">주제 타이틀 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="앱에 노출될 주제를 입력하세요"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg bg-white"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">활동 상세 설명</label>
                  <textarea
                    placeholder="사용자에게 보여질 해당 활동에 대한 짧은 설명을 입력하세요."
                    rows={3}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white"
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

              <div className="space-y-2 pt-4 border-t border-slate-200">
                <label className="text-sm font-bold text-slate-700">노출 상태</label>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" checked={formData.status === 'ACTIVE'} onChange={() => setFormData({ ...formData, status: 'ACTIVE' })} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                    <span className="font-semibold text-slate-700">활성 (앱에 즉시 노출)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" checked={formData.status === 'INACTIVE'} onChange={() => setFormData({ ...formData, status: 'INACTIVE' })} className="w-4 h-4 text-slate-600 focus:ring-slate-500" />
                    <span className="text-slate-500">비활성 (숨김)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'AI_CONFIG' && (
            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start space-x-3 mb-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                 <Sparkles className="text-indigo-500 shrink-0 mt-0.5 z-10" />
                 <div className="z-10 text-sm text-indigo-900 leading-relaxed">
                   이 학습에 연결될 실제 <b>AI 모델의 페르소나와 프롬프트, 그리고 미션 규칙</b>을 정의합니다. 설정된 내용은 대화 시작 시 System Instruction으로 주입됩니다.
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">AI 역할 (Role of AI)</label>
                  <input
                    type="text"
                    placeholder="ex) 친절한 동네 카페 바리스타"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.aiRole || ''}
                    onChange={e => setFormData({ ...formData, aiRole: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">사용자 역할 (Role of User)</label>
                  <input
                    type="text"
                    placeholder="ex) 커피를 주문하려는 손님"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.userRole || ''}
                    onChange={e => setFormData({ ...formData, userRole: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">제한 턴 (Session Limit)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    className="w-24 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-center font-bold"
                    value={formData.maxTurns || 10}
                    onChange={e => setFormData({ ...formData, maxTurns: parseInt(e.target.value) || 10 })}
                  />
                  <span className="text-sm text-slate-500 font-medium">턴 이내에 미션을 달성해야 성공으로 간주됩니다.</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">미션 설정 (Missions)</label>
                  <button onClick={handleAddMission} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-2 py-1 rounded">
                    <Plus size={12} className="mr-1" /> 미션 추가
                  </button>
                </div>
                
                {(!formData.missions || formData.missions.length === 0) ? (
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">등록된 미션이 없습니다. 우측 상단 버튼을 눌러 추가하세요.</div>
                ) : (
                  <div className="space-y-2">
                    {formData.missions.map((mission, index) => (
                      <div key={mission.id} className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold shrink-0">{index + 1}</span>
                        <input
                          type="text"
                          placeholder="유저가 달성해야 할 동작 입력 (ex: 따뜻한 아메리카노 한 잔 주문하기)"
                          className="flex-1 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                          value={mission.text}
                          onChange={e => updateMission(mission.id, e.target.value)}
                        />
                        <button onClick={() => removeMission(mission.id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors shrink-0">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                   <label className="text-sm font-bold text-slate-700">시스템 인스트럭션 (System Prompt)</label>
                   <span className="text-[10px] text-slate-400 font-medium">내부 엔진 주입용</span>
                </div>
                <textarea
                  placeholder="AI 모델에게 부여할 행동 지침, 금지어, 말투 등 세부적인 프롬프트 규칙을 작성하세요."
                  rows={6}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs bg-[#1E293B] text-slate-300 placeholder:text-slate-600 resize-y"
                  value={formData.systemInstruction || ''}
                  onChange={e => setFormData({ ...formData, systemInstruction: e.target.value })}
                />
              </div>

            </div>
          )}

        </div>

        {/* 푸터 */}
        <div className="p-5 border-t border-slate-100 bg-white flex justify-end space-x-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">취소</button>
          <button onClick={() => { alert('성공적으로 저장 및 반영되었습니다.'); onClose(); }} className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
            {topic ? '수정사항 적용' : '신규 학습 생성'}
          </button>
        </div>

      </div>
    </div>
  );
};

const AICategoryManageModal = ({
  categories, onClose, onSave
}: {
  categories: AICategory[], onClose: () => void, onSave: (newCategories: AICategory[]) => void
}) => {
  const [localCategories, setLocalCategories] = useState<AICategory[]>(categories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const currentList = localCategories.filter(c => c.type === 'ROLEPLAY').sort((a, b) => a.order - b.order);

  const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === currentList.length - 1) return;

    const newList = [...currentList];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    
    // Swap
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;

    // Update orders
    const updatedList = newList.map((item, idx) => ({ ...item, order: idx + 1 }));

    // Merge back
    setLocalCategories([...updatedList]);
  };

  const handleAdd = () => {
    const newId = 'c' + Date.now();
    const newCat: AICategory = {
      id: newId,
      type: 'ROLEPLAY',
      name: '새 카테고리',
      order: currentList.length + 1
    };
    setLocalCategories([...localCategories, newCat]);
    setEditingId(newId);
    setEditName('새 카테고리');
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    setLocalCategories(prev => prev.map(c => c.id === id ? { ...c, name: editName.trim() } : c));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('해당 카테고리를 삭제하시겠습니까? 관련 주제들의 카테고리 연결이 끊어질 수 있습니다.')) {
      setLocalCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[85vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-black text-slate-800 flex items-center">
            <GripVertical size={20} className="mr-2 text-slate-500" />
            롤플레잉 탭(메뉴) 관리
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-3">
          {currentList.map((c, index) => (
            <div key={c.id} className="flex items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex flex-col space-y-1 mr-3">
                <button onClick={() => moveItem(index, 'UP')} disabled={index === 0} className="text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ChevronUp size={16} /></button>
                <button onClick={() => moveItem(index, 'DOWN')} disabled={index === currentList.length - 1} className="text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ChevronDown size={16} /></button>
              </div>
              
              <div className="flex-1">
                {editingId === c.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-1.5 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && handleSaveEdit(c.id)}
                    />
                    <button onClick={() => handleSaveEdit(c.id)} className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"><Check size={16} /></button>
                  </div>
                ) : (
                  <div className="font-bold text-slate-700 text-sm">{c.name}</div>
                )}
              </div>
              
              <div className="flex space-x-1 ml-3">
                {editingId !== c.id && (
                  <button onClick={() => { setEditingId(c.id); setEditName(c.name); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                )}
                <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          
          <button 
            onClick={handleAdd}
            className="w-full py-4 mt-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-sm flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 transition-colors bg-white"
          >
            <Plus size={18} className="mr-2" /> 새 탭 카테고리 추가
          </button>
        </div>

        <div className="p-5 border-t border-slate-100 bg-white flex justify-end space-x-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">취소</button>
          <button onClick={() => onSave(localCategories)} className="px-6 py-2.5 rounded-xl font-bold text-white bg-slate-800 shadow-lg hover:bg-slate-900 transition-all">변경사항 적용</button>
        </div>
      </div>
    </div>
  );
};

const AIRoleplayManagement = () => {
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedParams, setAppliedParams] = useState(searchParams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<AITopic | null>(null);
  const [categories, setCategories] = useState<AICategory[]>(MOCK_CATEGORIES);

  const filteredTopics = useMemo(() => {
    return MOCK_TOPICS.filter(t => {
      const matchKeyword = t.title.includes(appliedParams.keyword) || (t.description || '').includes(appliedParams.keyword);
      return matchKeyword;
    });
  }, [appliedParams]);

  const columns = [
    {
      header: '카테고리 탭',
      accessor: (t: AITopic) => <span className="font-bold text-slate-700">{categories.find(c => c.id === t.categoryId)?.name || '-'}</span>,
      width: 'w-32'
    },
    {
      header: '주제 상세(미리보기)',
      accessor: (t: AITopic) => (
        <div className="flex flex-col text-left max-w-md">
          <div className="font-bold text-slate-800 flex items-center space-x-2">
            <span>{t.title}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate">{t.description}</p>
        </div>
      )
    },
    {
      header: '상태',
      accessor: (t: AITopic) => (
        <span className={`flex items-center justify-center text-xs font-bold ${t.status === 'ACTIVE' ? 'text-blue-600' : 'text-slate-400'}`}>
          {t.status === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></div>}
          {t.status === 'ACTIVE' ? '사용중' : '미사용'}
        </span>
      ),
      width: 'w-24'
    },
    { header: '등록일', accessor: (t: AITopic) => t.createdAt, width: 'w-32' },
    {
      header: '관리',
      accessor: (t: AITopic) => (
        <button
          onClick={() => { setSelectedTopic(t); setIsModalOpen(true); }}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold text-xs flex items-center mx-auto transition-colors"
        >
          <Edit2 size={14} className="mr-1" /> 수정
        </button>
      ),
      width: 'w-24'
    }
  ];

  const renderFilter = (
    <div className="flex border-b border-gray-200 text-xs">
      <div className="w-32 bg-[#F1F3F6] p-3 font-bold text-center flex items-center justify-center border-r border-gray-200">검색어</div>
      <div className="flex-1 p-2">
        <input
          type="text"
          placeholder="제목 또는 설명 입력"
          className="w-full h-8 px-3 border border-gray-300 rounded focus:outline-none"
          value={searchParams.keyword}
          onChange={e => setSearchParams({ ...searchParams, keyword: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <>
       <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 flex items-center justify-between">
         <div>
           <h2 className="text-lg font-black text-slate-800">롤플레잉 관리</h2>
           <p className="text-sm text-slate-500 mt-1">앱 화면에 노출되는 롤플레잉의 주제 및 세부 항목을 관리합니다.</p>
         </div>
         <button 
           onClick={() => setIsCategoryModalOpen(true)}
           className="flex items-center px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-md"
         >
            <GripVertical size={16} className="mr-2" />
            롤플레잉 탭 순서/이름 관리
         </button>
      </div>

      <DataList
        data={filteredTopics}
        columns={columns}
        renderFilter={renderFilter}
        onSearch={() => setAppliedParams(searchParams)}
        onReset={() => {
          const reset = { keyword: '' };
          setSearchParams(reset);
          setAppliedParams(reset);
        }}
        actions={
          <button
            onClick={() => { setSelectedTopic(null); setIsModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
          >
            <Plus className="mr-2 h-4 w-4" /> AI 주제 등록
          </button>
        }
        hideAddButton={true} // 기존 DataList의 추가버튼 숨기고 커스텀 actions 사용
      />

      {isModalOpen && (
        <AITopicFormModal
          topic={selectedTopic}
          categories={categories}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTopic(null);
          }}
        />
      )}

      {isCategoryModalOpen && (
        <AICategoryManageModal
          categories={categories}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={(newCategories) => {
            setCategories(newCategories);
            setIsCategoryModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default AIRoleplayManagement;
