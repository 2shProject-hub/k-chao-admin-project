import React, { useState } from 'react';
import { Save, Info, RefreshCcw, CheckCircle2, Zap } from 'lucide-react';

const MOCK_ACTIVITIES = [
    { id: 'act-1', program: '한국어 종합 교육 프로그램', course: '초급 1', lesson: '어느 나라 사람이에요?', type: '단어 학습', isRewardEnabled: true, cost: 1 },
    { id: 'act-2', program: '한국어 종합 교육 프로그램', course: '초급 1', lesson: '어느 나라 사람이에요?', type: '말하기 연습', isRewardEnabled: true, cost: 2 },
    { id: 'act-3', program: '한국어 종합 교육 프로그램', course: '초급 2', lesson: '주말에 뭐 했어요?', type: '문장 퀴즈', isRewardEnabled: false, cost: 0 },
    { id: 'act-4', program: '비즈니스 실무 한국어', course: '중급 1', lesson: '전화 응대하기', type: '역할극', isRewardEnabled: true, cost: 3 },
];

const MOCK_AI_CONVERSATIONS = [
    { id: 'ai-1', type: '롤플레잉', theme: '공항 입국심사', isRewardEnabled: true, cost: 2 },
    { id: 'ai-2', type: '롤플레잉', theme: '카페에서 주문하기', isRewardEnabled: true, cost: 2 },
    { id: 'ai-3', type: '프리토킹', theme: '주말 계획 이야기하기', isRewardEnabled: false, cost: 0 },
    { id: 'ai-4', type: '사진 묘사', theme: '한국의 길거리 묘사하기', isRewardEnabled: true, cost: 1 },
];

const RewardPolicyManagement: React.FC = () => {
    const [activities, setActivities] = useState(MOCK_ACTIVITIES);
    const [aiConversations, setAiConversations] = useState(MOCK_AI_CONVERSATIONS);
    const [paidMemberInfiniteAI, setPaidMemberInfiniteAI] = useState(true);

    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'ACTIVITY' | 'AI'>('ACTIVITY');

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('재화 정책이 성공적으로 저장되었습니다.');
        }, 800);
    };

    const toggleActivityStatus = (id: string) => {
        setActivities(acts => acts.map(a => 
            a.id === id ? { ...a, isRewardEnabled: !a.isRewardEnabled } : a
        ));
    };

    const changeActivityCost = (id: string, cost: number) => {
        setActivities(acts => acts.map(a => 
            a.id === id ? { ...a, cost: Math.max(1, cost) } : a
        ));
    };

    const toggleAIStatus = (id: string) => {
        setAiConversations(ais => ais.map(a => 
            a.id === id ? { ...a, isRewardEnabled: !a.isRewardEnabled } : a
        ));
    };

    const changeAICost = (id: string, cost: number) => {
        setAiConversations(ais => ais.map(a => 
            a.id === id ? { ...a, cost: Math.max(1, cost) } : a
        ));
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-2">
            <div className="bg-white p-6 justify-between items-center rounded-2xl shadow-sm border border-slate-100 flex">
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">재화(번개) 사용 정책 설정</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">서비스 내 특정 학습(Activity)과 AI 대화에 적용할 번개 차감 기준을 상세하게 설정합니다.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    <Save size={18} />
                    <span>{isSaving ? '저장 중...' : '설정 저장'}</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                    <button
                        onClick={() => setActiveTab('ACTIVITY')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ACTIVITY' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Activity (일반 학습) 보상 지정
                    </button>
                    <button
                        onClick={() => setActiveTab('AI')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'AI' ? 'border-purple-500 text-purple-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        AI 대화 (롤플레잉/프리토킹 등) 보상 지정
                    </button>
                </div>

                <div className="p-0 flex-1">
                    {activeTab === 'ACTIVITY' && (
                        <div className="animate-in fade-in duration-200">
                            <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center">
                                <Info size={16} className="text-blue-500 mr-2" />
                                <span className="text-sm text-blue-800 font-medium">학습 관리에서 등록된 커리큘럼 기반 모듈 정보입니다. 번개 차감 여부와 차감 개수를 지정할 수 있습니다.</span>
                            </div>
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">분류 (강좌 &gt; 코스)</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">레슨명</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">학습 활동(Activity) 타입</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">재화 사용 여부</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">필요 번개 수량</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-50">
                                    {activities.map(act => (
                                        <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-800">{act.program}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{act.course}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{act.lesson}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">{act.type}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => toggleActivityStatus(act.id)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${act.isRewardEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${act.isRewardEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {act.isRewardEnabled ? (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Zap size={14} className="text-amber-500" />
                                                        <input 
                                                            type="number" 
                                                            min="1" 
                                                            value={act.cost} 
                                                            onChange={(e) => changeActivityCost(act.id, parseInt(e.target.value) || 1)}
                                                            className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-800 focus:border-blue-500 outline-none" 
                                                        />
                                                    </div>
                                                ) : <span className="text-xs font-bold text-slate-400">-</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'AI' && (
                        <div className="animate-in fade-in duration-200">
                            <div className="p-4 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    <Info size={16} className="text-purple-500 mr-2" />
                                    <span className="text-sm text-purple-800 font-medium">시스템에 추가된AI 대화 모드별로 재화 차감 정책을 설정할 수 있습니다.</span>
                                </div>
                                <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-purple-200 shadow-sm">
                                    <input 
                                        type="checkbox" 
                                        checked={paidMemberInfiniteAI}
                                        onChange={(e) => setPaidMemberInfiniteAI(e.target.checked)}
                                        className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                                    />
                                    <span className="text-xs font-bold text-slate-700">유료 회원 무제한 허용 (차감 무시)</span>
                                </label>
                            </div>
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">대화 유형</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">대화 주제(Theme)</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">재화 사용 여부</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">필요 번개 수량</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-50">
                                    {aiConversations.map(ai => (
                                        <tr key={ai.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${
                                                    ai.type === '롤플레잉' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                    {ai.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{ai.theme}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => toggleAIStatus(ai.id)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ai.isRewardEnabled ? 'bg-purple-500' : 'bg-slate-300'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ai.isRewardEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {ai.isRewardEnabled ? (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Zap size={14} className="text-amber-500" />
                                                        <input 
                                                            type="number" 
                                                            min="1" 
                                                            value={ai.cost} 
                                                            onChange={(e) => changeAICost(ai.id, parseInt(e.target.value) || 1)}
                                                            className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-800 focus:border-purple-500 outline-none" 
                                                        />
                                                    </div>
                                                ) : <span className="text-xs font-bold text-slate-400">-</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <Info size={16} className="text-blue-500 mr-2" />
                    안내 사항
                </h4>
                <ul className="text-sm text-slate-600 space-y-1 ml-6 list-disc">
                    <li>해당 설정은 저장 즉시 앱에 연동되어 반영됩니다.</li>
                    <li>설정 변경 전, 변경되는 정책에 대해 사용자 공지를 권장합니다.</li>
                    <li>사용 내역은 회원 상세 정보의 <strong>보상 관리(REWARD)</strong> 탭에서 확인할 수 있습니다.</li>
                </ul>
            </div>
        </div>
    );
};

export default RewardPolicyManagement;
