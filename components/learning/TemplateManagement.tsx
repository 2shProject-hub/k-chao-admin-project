
import React, { useState } from 'react';
import DataList from '../DataList';
import { MOCK_TEMPLATE_REGISTRY } from '../mockData'; // Centralized state
import { TemplateConfig, FieldDefinition, FieldType } from '../../types';
import { Plus, Trash2, Edit2, Check, AlertCircle, ListPlus, X, Copy } from 'lucide-react';

// ==========================================
// Helper Components
// ==========================================

// Field Editor Component (Modal or Inline)
interface FieldEditorProps {
    initialField?: FieldDefinition;
    onSave: (field: FieldDefinition) => void;
    onCancel: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ initialField, onSave, onCancel }) => {
    const [fieldData, setFieldData] = useState<FieldDefinition>(initialField || {
        key: '',
        label: '',
        type: 'TEXT',
        required: false,
        encourage: ''
    });

    const handleChange = (key: keyof FieldDefinition, value: any) => {
        setFieldData(prev => ({ ...prev, [key]: value }));
    };

    const isEdit = !!initialField;

    return (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 animate-in fade-in zoom-in-95 duration-200">
            <h4 className="font-bold text-slate-700 mb-3 text-sm">{isEdit ? '필드 수정' : '새 필드 추가'}</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">필드 키 (Key)</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded text-xs font-mono"
                        placeholder="ex) title_ko"
                        value={fieldData.key}
                        onChange={e => handleChange('key', e.target.value)}
                        disabled={isEdit} // Key should be unique/immutable
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">표시 라벨 (Label)</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded text-xs"
                        placeholder="ex) 한국어 제목"
                        value={fieldData.label}
                        onChange={e => handleChange('label', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">입력 타입</label>
                    <select
                        className="w-full p-2 border rounded text-xs bg-white"
                        value={fieldData.type}
                        onChange={e => handleChange('type', e.target.value as FieldType)}
                    >
                        <option value="TEXT">단문 텍스트 (TEXT)</option>
                        <option value="TEXT_AREA">장문 텍스트 (TEXT_AREA)</option>
                        <option value="NUMBER">숫자 (NUMBER)</option>
                        <option value="IMAGE">이미지 (IMAGE)</option>
                        <option value="AUDIO">오디오 (AUDIO)</option>
                        <option value="VIDEO">비디오 (VIDEO)</option>
                        <option value="LIST_TEXT">단어/문장 리스트 (LIST_TEXT)</option>
                        <option value="LIST_PAIR">짝 리스트 (LIST_PAIR)</option>
                        <option value="SELECT">선택형 (SELECT)</option>
                        <option value="SET_WORD_EXAMPLE">단어+예시 세트 (SET)</option>
                    </select>
                </div>
                <div className="flex items-center pt-5">
                    <input
                        type="checkbox"
                        id="chk_required"
                        checked={fieldData.required}
                        onChange={e => handleChange('required', e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="chk_required" className="text-xs font-bold text-slate-600">필수 항목 여부</label>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">작성 가이드/힌트</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded text-xs"
                        placeholder="사용자에게 보여질 입력 팁..."
                        value={fieldData.encourage || ''}
                        onChange={e => handleChange('encourage', e.target.value)}
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <button onClick={onCancel} className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-200 rounded">취소</button>
                <button
                    onClick={() => {
                        if (!fieldData.key || !fieldData.label) return alert('키와 라벨은 필수입니다.');
                        onSave(fieldData);
                    }}
                    className="px-3 py-1.5 text-xs bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700"
                >
                    {isEdit ? '수정 완료' : '추가'}
                </button>
            </div>
        </div>
    );
};

// ==========================================
// Main Component
// ==========================================

const TemplateManagement: React.FC = () => {
    // Shared State Management (In real app, use Context or Redux)
    // Here we use local state initialized from Mock, but we need to update the Global Registry
    // Since we can't easily update the imported object in-place without a wrapper/store, 
    // we'll simulate it by using a state that 'shadows' the registry for this session.
    // ** ideally ContentManagement also reads from this same state **

    // For this demo, let's assume we are modifying the 'Source of Truth' which is MOCK_TEMPLATE_REGISTRY directly (dirty but works for prototype)
    // Or we create a state here and this view is the 'Editor'.

    const [registry, setRegistry] = useState<Record<string, TemplateConfig>>(MOCK_TEMPLATE_REGISTRY);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // List View
    const templateList: TemplateConfig[] = Object.values(registry);

    // Detail View State
    const [editData, setEditData] = useState<TemplateConfig | null>(null);
    const [activeTab, setActiveTab] = useState<'COMMON' | 'ITEM'>('COMMON');
    const [editingFieldIdx, setEditingFieldIdx] = useState<number | null>(null); // null means not editing
    const [isAddingField, setIsAddingField] = useState(false);

    // Version Checkbox State
    const [isVersionUp, setIsVersionUp] = useState(false);

    // Handlers
    const handleSelectTemplate = (id: string) => {
        setSelectedTemplateId(id);
        const selected = registry[id];
        const safeData = {
            ...selected,
            constraints: selected.constraints || { minItems: 1 },
            version: selected.version || 1.0 // Fallback
        };
        setEditData(JSON.parse(JSON.stringify(safeData))); // Deep Copy
        setIsCreating(false);
        setEditingFieldIdx(null);
        setIsAddingField(false);
        setIsVersionUp(false);
    };

    const handleCreateTemplate = () => {
        const newId = `CUSTOM_TEMP_${Date.now()}`;
        const newTemplate: TemplateConfig = {
            id: newId,
            name: '새 템플릿',
            description: '새로운 액티비티 템플릿입니다.',
            commonFields: [],
            itemFields: [],
            constraints: { minItems: 1 },
            version: 1.0
        };
        setEditData(newTemplate);
        setSelectedTemplateId(null);
        setIsCreating(true);
        setEditingFieldIdx(null);
        setIsAddingField(false);
        setIsVersionUp(false);
    };

    const handleDuplicateTemplate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const source = registry[id];
        if (!source) return;

        const newId = `CUSTOM_TEMP_${Date.now()}`;
        const newTemplate: TemplateConfig = {
            ...JSON.parse(JSON.stringify(source)),
            id: newId,
            name: `${source.name} (복사본)`,
            version: 1.0, // Reset version for new copy
            basedOn: source.id
        };

        const newRegistry = { ...registry, [newId]: newTemplate };
        setRegistry(newRegistry);
        Object.assign(MOCK_TEMPLATE_REGISTRY, newRegistry); // Sync Mock

        alert('템플릿이 복제되었습니다.');
        // Select the new template
        setSelectedTemplateId(newId);
        setEditData(newTemplate);
        setIsCreating(true); // Treat as creating/editing new
        setEditingFieldIdx(null);
        setIsAddingField(false);
        setIsVersionUp(false);
    };

    const handleSaveTemplate = () => {
        if (!editData) return;
        if (!editData.name) return alert('템플릿 명을 입력하세요.');

        let finalData = { ...editData };
        if (isVersionUp) {
            finalData.version = parseFloat(((finalData.version || 1.0) + 0.1).toFixed(1));
        }

        const newRegistry = { ...registry, [finalData.id]: finalData };
        setRegistry(newRegistry);

        // SYNC BACK TO GLOBAL REGISTRY (Hack for Prototype)
        // In a real app, this would be an API call or Dispatch
        Object.assign(MOCK_TEMPLATE_REGISTRY, newRegistry);

        alert(`템플릿이 저장되었습니다. (v${finalData.version})`);
        setSelectedTemplateId(finalData.id);
        setEditData(finalData);
        setIsCreating(false);
        setIsVersionUp(false);
    };

    const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('정말 삭제하시겠습니까?')) return;

        const newRegistry = { ...registry };
        delete newRegistry[id];
        setRegistry(newRegistry);
        delete MOCK_TEMPLATE_REGISTRY[id];

        if (selectedTemplateId === id) {
            setSelectedTemplateId(null);
            setEditData(null);
        }
    };

    // Field Handlers
    const currentFields = editData ? (activeTab === 'COMMON' ? editData.commonFields : editData.itemFields) : [];

    const handleAddField = (field: FieldDefinition) => {
        if (!editData) return;
        const targetList = activeTab === 'COMMON' ? 'commonFields' : 'itemFields';
        setEditData({
            ...editData,
            [targetList]: [...editData[targetList], field]
        });
        setIsAddingField(false);
    };

    const handleUpdateField = (idx: number, field: FieldDefinition) => {
        if (!editData) return;
        const targetList = activeTab === 'COMMON' ? 'commonFields' : 'itemFields';
        const newList = [...editData[targetList]];
        newList[idx] = field;
        setEditData({ ...editData, [targetList]: newList });
        setEditingFieldIdx(null);
    };

    const handleDeleteField = (idx: number) => {
        if (!editData) return;
        const targetList = activeTab === 'COMMON' ? 'commonFields' : 'itemFields';
        const newList = [...editData[targetList]];
        newList.splice(idx, 1);
        setEditData({ ...editData, [targetList]: newList });
    };

    // Renderers
    const renderFieldList = () => {
        if (!editData) return null;

        return (
            <div className="space-y-3">
                {currentFields.length === 0 && !isAddingField && (
                    <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
                        등록된 리소스 필드가 없습니다.
                    </div>
                )}

                {currentFields.map((field, idx) => (
                    <div key={idx}>
                        {editingFieldIdx === idx ? (
                            <FieldEditor
                                initialField={field}
                                onSave={(updated) => handleUpdateField(idx, updated)}
                                onCancel={() => setEditingFieldIdx(null)}
                            />
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-200 transition-colors group">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase w-16 truncate" title={field.key}>{field.key}</span>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700">{field.label}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5 flex space-x-2">
                                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">{field.type}</span>
                                            {field.required && <span className="text-red-500 font-bold">* 필수</span>}
                                            {field.encourage && <span className="truncate max-w-[200px] border-l pl-2">{field.encourage}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingFieldIdx(idx)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDeleteField(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {isAddingField ? (
                    <FieldEditor onSave={handleAddField} onCancel={() => setIsAddingField(false)} />
                ) : (
                    <button
                        onClick={() => setIsAddingField(true)}
                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 font-bold text-xs hover:border-indigo-300 hover:text-indigo-500 flex items-center justify-center transition-all"
                    >
                        <Plus size={16} className="mr-1" /> 새 리소스 필드 추가
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] lg:flex-row gap-6">
            {/* Left: Template List */}
            <div className="w-full lg:w-[480px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="font-bold text-slate-700">템플릿 목록</h2>
                    <button
                        onClick={handleCreateTemplate}
                        className="flex items-center px-2 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700"
                    >
                        <Plus size={14} className="mr-1" /> 신규 생성
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {templateList.map(t => (
                        <div
                            key={t.id}
                            onClick={() => handleSelectTemplate(t.id)}
                            className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedTemplateId === t.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-bold text-slate-800 truncate pr-2">{t.name}</span>
                                <div className="flex items-center space-x-1 shrink-0">
                                    <button onClick={(e) => handleDuplicateTemplate(t.id, e)} className="text-slate-300 hover:text-indigo-500" title="복제">
                                        <Copy size={12} />
                                    </button>
                                    <button onClick={(e) => handleDeleteTemplate(t.id, e)} className="text-slate-300 hover:text-red-500" title="삭제">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 mt-1 truncate">{t.description}</div>
                            <div className="flex mt-2 items-center justify-between">
                                <div className="flex space-x-1">
                                    <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 rounded text-slate-500">v{t.version?.toFixed(1) || '1.0'}</span>
                                    {t.basedOn && <span className="text-[10px] bg-orange-50 border border-orange-100 text-orange-400 px-1 rounded">복사본</span>}
                                </div>
                                <span className="text-[10px] text-slate-400">필드 {t.commonFields.length + t.itemFields.length}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Template Builder */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                {editData ? (
                    <>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-xs font-bold text-indigo-500">
                                            {isCreating ? '신규 템플릿 생성' : '템플릿 편집'}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-[10px] bg-slate-100 px-1.5 rounded text-slate-500 font-mono">
                                                Version {editData.version?.toFixed(1) || '1.0'}
                                            </span>
                                            {editData.basedOn && (
                                                <span className="text-[10px] bg-orange-50 text-orange-400 px-1.5 rounded">
                                                    복사본
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className="text-xl font-bold text-slate-800 outline-none placeholder-slate-300 w-full"
                                        value={editData.name}
                                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                                        placeholder="템플릿 명을 입력하세요"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center hover:bg-slate-50 p-2 rounded cursor-pointer" onClick={() => setIsVersionUp(!isVersionUp)}>
                                    <input
                                        type="checkbox"
                                        id="chk_version_up"
                                        className="mr-2"
                                        checked={isVersionUp}
                                        onChange={(e) => setIsVersionUp(e.target.checked)}
                                    />
                                    <label htmlFor="chk_version_up" className="text-xs font-bold text-slate-500 cursor-pointer pointer-events-none">
                                        저장 시 버전 업 <span className="text-indigo-500">(+0.1)</span>
                                    </label>
                                </div>
                                <button onClick={handleSaveTemplate} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200">
                                    저장하기
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col">
                            {/* Basic Info */}
                            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                                <label className="block text-xs font-bold text-slate-500 mb-2">템플릿 설명</label>
                                <textarea
                                    className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                                    rows={2}
                                    value={editData.description}
                                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                                />
                                <div className="flex items-center mt-4 space-x-6">
                                    <div className="flex items-center">
                                        <label className="text-xs font-bold text-slate-600 mr-2">최소 문항 수:</label>
                                        <input
                                            type="number"
                                            className="w-16 p-1 text-center border rounded text-sm font-bold"
                                            value={editData.constraints.minItems}
                                            onChange={e => setEditData({ ...editData, constraints: { ...editData.constraints, minItems: Number(e.target.value) } })}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="chk_preview"
                                            checked={editData.constraints.hasPreview || false}
                                            onChange={e => setEditData({ ...editData, constraints: { ...editData.constraints, hasPreview: e.target.checked } })}
                                            className="mr-2"
                                        />
                                        <label htmlFor="chk_preview" className="text-xs font-bold text-slate-600">미리보기 지원</label>
                                    </div>
                                </div>
                            </div>

                            {/* Resource Builder */}
                            <div className="flex flex-1 overflow-hidden">
                                <div className="w-48 bg-slate-50 border-r border-slate-100 flex flex-col">
                                    <button
                                        onClick={() => setActiveTab('COMMON')}
                                        className={`p-4 text-left text-sm font-bold border-l-4 transition-all ${activeTab === 'COMMON' ? 'bg-white border-indigo-500 text-indigo-700' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        공통 리소스
                                        <div className="text-[10px] font-normal mt-1 opacity-70">액티비티 전체 공통</div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('ITEM')}
                                        className={`p-4 text-left text-sm font-bold border-l-4 transition-all ${activeTab === 'ITEM' ? 'bg-white border-indigo-500 text-indigo-700' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        문항 리소스
                                        <div className="text-[10px] font-normal mt-1 opacity-70">문항별 반복 데이터</div>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 bg-white">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-slate-800 text-lg mb-1">
                                            {activeTab === 'COMMON' ? '공통 리소스 설계' : '문항 리소스 설계'}
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            {activeTab === 'COMMON'
                                                ? '모든 문항에서 공통적으로 보여지는 데이터 (예: 영상, 전체 지문)'
                                                : '각 문항마다 달라지는 데이터 (예: 문제 텍스트, 정답, 보기)'}
                                        </p>
                                    </div>

                                    {renderFieldList()}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                        <ListPlus size={48} className="mb-4 opacity-20" />
                        <p className="font-bold text-lg">템플릿을 선택하거나 새로 생성하세요</p>
                        <p className="text-sm mt-2">왼쪽 목록에서 선택</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateManagement;
