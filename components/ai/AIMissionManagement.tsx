import React, { useState, useMemo } from 'react';
import DataList from '../DataList';
import { Sparkles, Edit2, Plus, GripVertical, Image as ImageIcon, Trash2, ChevronUp, ChevronDown, Check, X, Video } from 'lucide-react';

interface AIMission {
  id: string;
  categoryId: string; // 카테고리 (단원 등의 구분을 위해 확장성을 고려)
  title: string;
  description: string; // 요약 영상 하단 안내 문구
  videoUrl?: string; // 요약 영상 (mp4 URL 등)
  subtitleUrl?: string; // 시스템에서 자막을 관리한다면 사용
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;

  // --- 세부 AI 설정 ---
  aiRole?: string;             // AI 역할
  userRole?: string;           // 사용자 역할
  maxTurns?: number;           // 최대 대화 제한 수
  timeLimitSeconds?: number;   // 제한 시간 (초 단위)
  systemInstruction?: string;  // 시스템 프롬프트(규칙)
  taskList?: { id: string, text: string }[]; // 유저가 수행해야 하는 개별 태스크 목록
}

interface AIMissionCategory {
  id: string;
  name: string;
  order: number;
}

const MOCK_CATEGORIES: AIMissionCategory[] = [
  { id: 'c1', name: '초급 과정 미션', order: 1 },
  { id: 'c2', name: '중급 과정 미션', order: 2 },
];

const MOCK_MISSIONS: AIMission[] = [
  { 
    id: 'm1', categoryId: 'c1', title: '인사 및 자기 소개', description: '요약 영상을 시청한 후 학습 표현을 튜터와 연습해 보세요.', status: 'ACTIVE', createdAt: '2024-03-18',
    aiRole: '새로운 모임의 참가자', userRole: '모임에 처음 온 사람', maxTurns: 10, timeLimitSeconds: 120, // 2분
    systemInstruction: '너는 모임에 새로 온 사람을 반갑게 맞이하는 역할을 수행해야 한다. 유저가 말을 걸면 자연스럽게 대답하며, 적절한 질문을 던져라.',
    taskList: [
      { id: 't1', text: '자신의 이름을 소개하세요.' },
      { id: 't2', text: '상대의 국적을 물어보세요.' },
      { id: 't3', text: '자신의 직업을 \'은/는\'으로 말하세요.' },
      { id: 't4', text: '상대가 잘못 말한 내용을 고쳐 주세요.' }
    ]
  },
  { id: 'm2', categoryId: 'c1', title: '식당에서 주문하기', description: '음식을 주문하고 요구사항을 말하는 미션입니다.', status: 'INACTIVE', createdAt: '2024-03-17' },
];

const AIMissionFormModal = ({
  mission, onClose, categories
}: {
  mission?: AIMission | null, onClose: () => void, categories: AIMissionCategory[]
}) => {
  const [activeTab, setActiveTab] = useState<'BASIC' | 'AI_CONFIG'>('BASIC');
  const [formData, setFormData] = useState<Partial<AIMission>>(
    mission || { status: 'ACTIVE', taskList: [], maxTurns: 10, timeLimitSeconds: 60 }
  );

  // --- 미션 태스크 핸들러 ---
  const handleAddTask = () => {
    setFormData({
      ...formData,
      taskList: [...(formData.taskList || []), { id: 't' + Date.now(), text: '' }]
    });
  };

  const updateTask = (id: string, text: string) => {
    setFormData({
      ...formData,
      taskList: (formData.taskList || []).map(t => t.id === id ? { ...t, text } : t)
    });
  };

  const removeTask = (id: string) => {
    setFormData({
      ...formData,
      taskList: (formData.taskList || []).filter(t => t.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h3 className="text-xl font-black text-slate-800 flex items-center">
            <Sparkles size={20} className="mr-2 text-indigo-500" />
            AI 대화 미션 {mission ? '수정' : '등록'}
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
            AI 대화 및 미션 세부 설정
          </button>
        </div>

        {/* 바디 (스크롤 영역) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
          
          {activeTab === 'BASIC' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">카테고리 탭 매핑 <span className="text-red-500">*</span></label>
                  <select
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.categoryId || ''}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">탭 선택</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">미션 타이틀 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="앱에 노출될 미션 제목을 입력하세요"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg bg-white"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">학습 설명 문구</label>
                <textarea
                  placeholder="요약 영상 하단 등에 노출될 학습에 대한 짧은 설명을 입력하세요."
                  rows={2}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white"
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">요약 영상 등록 (메타휴먼 영상)</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-indigo-400 cursor-pointer transition-colors bg-white">
                      <Video size={32} className="mb-2 text-slate-400" />
                      <span className="font-bold">클릭하여 동영상 업로드</span>
                      <span className="text-xs mt-1">권장 확장자: MP4, 최대 50MB</span>
                    </div>
                  </div>
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
                   AI 튜터와 진행할 실제 대화의 <b>세부 미션 리스트, 제한 시간, 프롬프트</b>를 설정합니다. 해당 미션을 완수해야만 다음 학습으로 넘어가거나 성공 판정을 받습니다.
                 </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">세부 미션 설정 (Tasks)</label>
                  <button onClick={handleAddTask} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-2 py-1 rounded">
                    <Plus size={12} className="mr-1" /> 미션 추가
                  </button>
                </div>
                
                {(!formData.taskList || formData.taskList.length === 0) ? (
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">등록된 세부 미션이 없습니다. 우측 상단 버튼을 눌러 추가하세요.</div>
                ) : (
                  <div className="space-y-2">
                    {formData.taskList.map((task, index) => (
                      <div key={task.id} className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold shrink-0">{index + 1}</span>
                        <input
                          type="text"
                          placeholder="유저가 대화 중 달성해야 할 목적 지시문 입력 (예: 자신의 이름을 소개하세요)"
                          className="flex-1 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                          value={task.text}
                          onChange={e => updateTask(task.id, e.target.value)}
                        />
                        <button onClick={() => removeTask(task.id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors shrink-0">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5 pt-4 border-t border-slate-200">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">제한 시간 (타이머)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={10}
                      className="w-24 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-center font-bold"
                      value={formData.timeLimitSeconds || 60}
                      onChange={e => setFormData({ ...formData, timeLimitSeconds: parseInt(e.target.value) || 60 })}
                    />
                    <span className="text-sm text-slate-500 font-medium">초</span>
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
                    <span className="text-sm text-slate-500 font-medium">턴</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">AI 역할 (Role of AI)</label>
                  <input
                    type="text"
                    placeholder="ex) 모임 주최자"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.aiRole || ''}
                    onChange={e => setFormData({ ...formData, aiRole: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">사용자 역할 (Role of User)</label>
                  <input
                    type="text"
                    placeholder="ex) 신규 가입 회원"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.userRole || ''}
                    onChange={e => setFormData({ ...formData, userRole: e.target.value })}
                  />
                </div>
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
            {mission ? '수정사항 적용' : '신규 대화 미션 생성'}
          </button>
        </div>

      </div>
    </div>
  );
};

const AIMissionCategoryManageModal = ({
  categories, onClose, onSave
}: {
  categories: AIMissionCategory[], onClose: () => void, onSave: (newCategories: AIMissionCategory[]) => void
}) => {
  const [localCategories, setLocalCategories] = useState<AIMissionCategory[]>(categories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const currentList = [...localCategories].sort((a, b) => a.order - b.order);

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
    const newCat: AIMissionCategory = {
      id: newId,
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
    if (confirm('해당 카테고리를 삭제하시겠습니까? 관련 미션들의 카테고리 연결이 끊어질 수 있습니다.')) {
      setLocalCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[85vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-black text-slate-800 flex items-center">
            <GripVertical size={20} className="mr-2 text-slate-500" />
            미션 카테고리 탭 (순서/이름) 관리
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

const AIMissionManagement = () => {
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedParams, setAppliedParams] = useState(searchParams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<AIMission | null>(null);
  const [categories, setCategories] = useState<AIMissionCategory[]>(MOCK_CATEGORIES);

  const filteredMissions = useMemo(() => {
    return MOCK_MISSIONS.filter(m => {
      const matchKeyword = m.title.includes(appliedParams.keyword) || m.description.includes(appliedParams.keyword);
      return matchKeyword;
    });
  }, [appliedParams]);

  const columns = [
    {
      header: '카테고리 탭',
      accessor: (m: AIMission) => <span className="font-bold text-slate-700">{categories.find(c => c.id === m.categoryId)?.name || '-'}</span>,
      width: 'w-32'
    },
    {
      header: '미션 타이틀 및 요약',
      accessor: (m: AIMission) => (
        <div className="flex flex-col text-left max-w-md">
          <div className="font-bold text-slate-800 flex items-center space-x-2">
            <span>{m.title}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate">{m.description}</p>
          {m.taskList && m.taskList.length > 0 && (
             <div className="mt-2 text-[10px] text-slate-400">
               세부 미션: {m.taskList.length}개 설정됨
             </div>
          )}
        </div>
      )
    },
    {
      header: '시간/턴 제한',
      accessor: (m: AIMission) => (
        <div className="flex flex-col text-xs text-slate-600 font-medium">
          <span>{m.timeLimitSeconds ? `${Math.floor(m.timeLimitSeconds/60)}분 ${m.timeLimitSeconds%60}초` : '무제한'}</span>
          <span className="text-slate-400 mt-0.5">{m.maxTurns ? `최대 ${m.maxTurns}턴` : '턴 무제한'}</span>
        </div>
      ),
      width: 'w-32'
    },
    {
      header: '상태',
      accessor: (m: AIMission) => (
        <span className={`flex items-center justify-center text-xs font-bold ${m.status === 'ACTIVE' ? 'text-blue-600' : 'text-slate-400'}`}>
          {m.status === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></div>}
          {m.status === 'ACTIVE' ? '사용중' : '미사용'}
        </span>
      ),
      width: 'w-24'
    },
    { header: '등록일', accessor: (m: AIMission) => m.createdAt, width: 'w-32' },
    {
      header: '관리',
      accessor: (m: AIMission) => (
        <button
          onClick={() => { setSelectedMission(m); setIsModalOpen(true); }}
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
          placeholder="미션 제목 또는 설명 입력"
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
         <div className="flex items-start space-x-3">
           <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
             <Video size={24} />
           </div>
           <div>
             <h2 className="text-lg font-black text-slate-800">AI 대화 미션 관리</h2>
             <p className="text-sm text-slate-500 mt-1">Act13에 해당하는 요약 영상 시청 및 다중 달성 미션을 가진 AI 대화 액티비티를 관리합니다.</p>
           </div>
         </div>
         <button 
           onClick={() => setIsCategoryModalOpen(true)}
           className="flex items-center px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-md shrink-0"
         >
            <GripVertical size={16} className="mr-2" />
            미션 카테고리 관리
         </button>
      </div>

      <DataList
        data={filteredMissions}
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
            onClick={() => { setSelectedMission(null); setIsModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
          >
            <Plus className="mr-2 h-4 w-4" /> AI 대화 미션 등록
          </button>
        }
        hideAddButton={true}
      />

      {isModalOpen && (
        <AIMissionFormModal
          mission={selectedMission}
          categories={categories}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMission(null);
          }}
        />
      )}

      {isCategoryModalOpen && (
        <AIMissionCategoryManageModal
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

export default AIMissionManagement;
