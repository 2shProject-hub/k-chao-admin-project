
import React, { useState, useEffect } from 'react';
import { FieldDefinition, ActivityContent, TemplateConfig, FieldOption } from '../../types';
import { MOCK_TEMPLATE_REGISTRY } from '../../components/mockData'; // Switched to Mock Data
import { Plus, Trash2, Mic, Image as ImageIcon, Video, AlertCircle, Volume2, ArrowUp, ArrowDown } from 'lucide-react';

// Use MOCK_TEMPLATE_REGISTRY instead of static constant
// Removed static constants to support dynamic updates


interface DynamicActivityFormProps {
    initialData: ActivityContent | null;
    onChange: (data: ActivityContent) => void;
}

const DynamicActivityForm: React.FC<DynamicActivityFormProps> = ({ initialData, onChange }) => {
    const [templateId, setTemplateId] = useState<string>(initialData?.templateId || '');
    // common data: { [key: string]: any }
    const [commonData, setCommonData] = useState<Record<string, any>>(initialData?.common || {});
    // items: array of objects
    const [items, setItems] = useState<Record<string, any>[]>(initialData?.items || []);

    // Force re-render when registry changes (in a real app, use context/store)
    const templateList = Object.values(MOCK_TEMPLATE_REGISTRY);
    const currentTemplate = MOCK_TEMPLATE_REGISTRY[templateId];

    // 템플릿 변경 시 초기화
    const handleTemplateChange = (newTemplateId: string) => {
        if (newTemplateId === templateId) return;

        // reset data if template changes heavily?
        // For safety, clear items, but maybe keep matching keys in commonData?
        // Let's clean start for now.
        setTemplateId(newTemplateId);
        setCommonData({});
        setItems([]);

        onChange({
            templateId: newTemplateId,
            common: {},
            items: []
        });
    };

    // 데이터 변경 시 상위 컴포넌트에 알림
    useEffect(() => {
        if (templateId) {
            onChange({
                templateId,
                common: commonData,
                items
            });
        }
    }, [commonData, items, templateId]); // dependency 주의 (onChange를 deps에 넣으면 루프 가능성)

    // --------------------------------------------------------
    // Field Renderers
    // --------------------------------------------------------
    // --------------------------------------------------------
    // Helper Component for Media Input (File or URL)
    // --------------------------------------------------------
    const MediaInput = ({ type, value, onChange }: { type: 'IMAGE' | 'AUDIO' | 'VIDEO', value: string, onChange: (val: string) => void }) => {
        const [mode, setMode] = useState<'FILE' | 'URL'>(() => {
            if (value && (value.startsWith('http') || value.startsWith('www'))) return 'URL';
            return 'FILE';
        });

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                // In real app, upload here. For now, simulate by using filename.
                // If we want to simulate a URL, we could use URL.createObjectURL(e.target.files[0]) for preview?
                // But the requirement says "file upload OR url".
                // Let's stick to filename for mock.
                onChange(e.target.files[0].name);
            }
        };

        const Icon = type === 'IMAGE' ? ImageIcon : type === 'AUDIO' ? Volume2 : Video;

        return (
            <div className="border border-slate-200 p-3 rounded bg-slate-50">
                <div className="flex items-center space-x-4 mb-2">
                    <label className="flex items-center text-xs font-bold text-slate-600 cursor-pointer">
                        <input
                            type="radio"
                            name={`media_mode_${type}_${Math.random()}`} // unique name per instance if possible, but random is okay for this scope
                            checked={mode === 'FILE'}
                            onChange={() => setMode('FILE')}
                            className="mr-1.5"
                        />
                        파일 업로드
                    </label>
                    {/* URL 입력 기능 일시 중지 (2025.02.10)
                    <label className="flex items-center text-xs font-bold text-slate-600 cursor-pointer">
                        <input
                            type="radio"
                            name={`media_mode_${type}_${Math.random()}`}
                            checked={mode === 'URL'}
                            onChange={() => setMode('URL')}
                            className="mr-1.5"
                        />
                        URL 직접 입력
                    </label>
                    */}
                </div>

                <div className="flex items-center space-x-2">
                    <Icon size={18} className="text-slate-400 shrink-0" />
                    {mode === 'FILE' ? (
                        <div className="flex-1">
                            <input
                                type="file"
                                accept={`${type.toLowerCase()}/*`}
                                className="text-xs w-full"
                                onChange={handleFileChange}
                            />
                            {/* If current value is NOT a URL (meaning it's a file path/name), show it */}
                            {value && !value.startsWith('http') && (
                                <div className="mt-1 text-xs text-blue-600 font-bold truncate">{value}</div>
                            )}
                        </div>
                    ) : (
                        <input
                            type="text"
                            className="flex-1 p-1.5 border border-slate-300 rounded text-xs"
                            placeholder={`https://example.com/${type.toLowerCase()}.mp4`}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )}
                </div>
                {/* Preview Link if URL */}
                {mode === 'URL' && value && (
                    <a href={value} target="_blank" rel="noreferrer" className="block mt-1 text-[10px] text-blue-500 hover:underline truncate">
                        {value}
                    </a>
                )}
            </div>
        );
    };

    // --------------------------------------------------------
    // Field Renderers
    // --------------------------------------------------------
    const renderInput = (
        field: FieldDefinition,
        value: any,
        onFieldChange: (val: any) => void
    ) => {
        // Removed handleFileChange from here, moved to MediaInput

        switch (field.type) {
            case 'TEXT':
                return (
                    <input
                        type="text"
                        className="w-full p-2 border border-slate-200 rounded text-sm"
                        value={value || ''}
                        placeholder={field.label}
                        onChange={(e) => onFieldChange(e.target.value)}
                    />
                );
            case 'TEXT_AREA':
                return (
                    <textarea
                        className="w-full p-2 border border-slate-200 rounded text-sm h-24 resize-none"
                        value={value || ''}
                        placeholder={field.label}
                        onChange={(e) => onFieldChange(e.target.value)}
                    />
                );
            case 'NUMBER':
                return (
                    <input
                        type="number"
                        className="w-full p-2 border border-slate-200 rounded text-sm"
                        value={value || ''}
                        placeholder="숫자 입력"
                        onChange={(e) => onFieldChange(Number(e.target.value))}
                    />
                );
            case 'SELECT':
                return (
                    <select
                        className="w-full p-2 border border-slate-200 rounded text-sm bg-white"
                        value={value || ''}
                        onChange={(e) => onFieldChange(e.target.value)}
                    >
                        <option value="">선택하세요</option>
                        {field.options?.map((opt, idx) => (
                            <option key={idx} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );
            case 'IMAGE':
                return <MediaInput type="IMAGE" value={value || ''} onChange={onFieldChange} />;
            case 'AUDIO':
                return <MediaInput type="AUDIO" value={value || ''} onChange={onFieldChange} />;
            case 'VIDEO':
                return <MediaInput type="VIDEO" value={value || ''} onChange={onFieldChange} />;
            case 'LIST_TEXT':
                // Simple string array manager
                const list = Array.isArray(value) ? value : [];
                const addListItem = () => onFieldChange([...list, '']);
                const updateListItem = (idx: number, txt: string) => {
                    const newList = [...list];
                    newList[idx] = txt;
                    onFieldChange(newList);
                };
                const removeListItem = (idx: number) => {
                    onFieldChange(list.filter((_, i) => i !== idx));
                };

                return (
                    <div className="space-y-2">
                        {list.map((item: string, idx: number) => (
                            <div key={idx} className="flex space-x-1">
                                <input
                                    type="text"
                                    className="flex-1 p-2 border border-slate-200 rounded text-sm"
                                    value={item}
                                    onChange={e => updateListItem(idx, e.target.value)}
                                />
                                <button onClick={() => removeListItem(idx)} className="text-red-400 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        {(!field.maxCount || list.length < field.maxCount) && (
                            <button onClick={addListItem} className="text-xs flex items-center text-indigo-500 font-bold py-1">
                                <Plus size={14} className="mr-1" /> 보기 추가
                            </button>
                        )}
                    </div>
                );
            case 'LIST_PAIR':
                // Pair array manager { a: string, b: string }
                const pairList = Array.isArray(value) ? value : [];
                const addPair = () => onFieldChange([...pairList, { a: '', b: '' }]);
                const updatePair = (idx: number, key: 'a' | 'b', txt: string) => {
                    const newPairs = [...pairList];
                    newPairs[idx] = { ...newPairs[idx], [key]: txt };
                    onFieldChange(newPairs);
                };
                const removePair = (idx: number) => onFieldChange(pairList.filter((_, i) => i !== idx));

                return (
                    <div className="space-y-2">
                        <div className="flex text-xs text-slate-500 font-bold text-center">
                            <div className="flex-1">베트남어</div>
                            <div className="w-4"></div>
                            <div className="flex-1">한국어</div>
                            <div className="w-6"></div>
                        </div>
                        {pairList.map((item: any, idx: number) => (
                            <div key={idx} className="flex space-x-1 items-center">
                                <input className="flex-1 p-2 border rounded text-sm" value={item.a || ''} onChange={e => updatePair(idx, 'a', e.target.value)} placeholder="Vi" />
                                <span className="text-slate-300">-</span>
                                <input className="flex-1 p-2 border rounded text-sm" value={item.b || ''} onChange={e => updatePair(idx, 'b', e.target.value)} placeholder="Ko" />
                                <button onClick={() => removePair(idx)} className="text-red-400 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <button onClick={addPair} className="text-xs flex items-center text-indigo-500 font-bold py-1">
                            <Plus size={14} className="mr-1" /> 쌍 추가
                        </button>
                    </div>
                );

            case 'SET_WORD_EXAMPLE':
                // JSON editor or Simplified form for complex object
                // For MVP, just use a text area to input JSON or simple notice
                return (
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500">
                        <p className="mb-1">복합 데이터 입력 필드입니다 (개발 중)</p>
                        <textarea
                            className="w-full p-1 border rounded"
                            value={typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2)}
                            onChange={e => {
                                try { onFieldChange(JSON.parse(e.target.value)) } catch { }
                            }}
                        />
                        <span className="text-[10px]">JSON 형식으로 입력 지원</span>
                    </div>
                );

            default:
                return <div className="text-red-500 text-xs">Unknown Field Type: {field.type}</div>;
        }
    };

    // --------------------------------------------------------
    // Main Render
    // --------------------------------------------------------
    return (
        <div className="flex flex-col h-full bg-slate-50/50">

            {/* 1. Template Select */}
            <div className="p-4 bg-white border-b border-slate-100">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">템플릿 선택</label>
                <select
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-medium bg-white"
                    value={templateId}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                >
                    <option value="">-- 액티비티 템플릿을 선택하세요 --</option>
                    {templateList.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
                {currentTemplate && (
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded">
                        <span className="font-bold">설명:</span> {currentTemplate.description}
                    </p>
                )}
            </div>

            {!currentTemplate ? (
                <div className="flex-1 flex items-center justify-center text-slate-400">
                    위에서 템플릿을 선택하면 입력 폼이 나타납니다.
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* 2. Common Fields */}
                    {currentTemplate.commonFields.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                                <AlertCircle size={16} className="mr-2 text-indigo-500" /> 공통 설정
                            </h3>
                            <div className="space-y-4">
                                {currentTemplate.commonFields.map(field => (
                                    <div key={field.key}>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {renderInput(field, commonData[field.key], (val) => setCommonData(prev => ({ ...prev, [field.key]: val })))}
                                        {field.encourage && <p className="text-[10px] text-slate-400 mt-1">{field.encourage}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. Item List Fields (only if template supports items) */}
                    {currentTemplate.constraints.maxItems !== 0 && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center">
                                    <AlertCircle size={16} className="mr-2 text-indigo-500" /> 문항 관리
                                    <span className="ml-2 text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {items.length} / {currentTemplate.constraints.maxItems || '∞'}
                                    </span>
                                </h3>
                                <button
                                    onClick={() => setItems(prev => [...prev, {}])}
                                    className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 flex items-center"
                                >
                                    <Plus size={14} className="mr-1" /> 문항 추가
                                </button>
                            </div>

                            {items.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
                                    문항을 추가해주세요.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 relative group">
                                            <div className="absolute right-2 top-2 flex space-x-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        const newItems = [...items];
                                                        if (idx > 0) {
                                                            [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
                                                            setItems(newItems);
                                                        }
                                                    }}
                                                    disabled={idx === 0}
                                                    className="p-1 bg-white border rounded hover:bg-slate-50 disabled:opacity-30"
                                                >
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newItems = [...items];
                                                        if (idx < items.length - 1) {
                                                            [newItems[idx + 1], newItems[idx]] = [newItems[idx], newItems[idx + 1]];
                                                            setItems(newItems);
                                                        }
                                                    }}
                                                    disabled={idx === items.length - 1}
                                                    className="p-1 bg-white border rounded hover:bg-slate-50 disabled:opacity-30"
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                                                    className="p-1 bg-white border border-red-200 text-red-500 rounded hover:bg-red-50"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="text-xs font-bold text-slate-400 mb-3">문항 #{idx + 1}</div>

                                            <div className="grid grid-cols-1 gap-4">
                                                {/* Built-in Field: Level */}
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-600 mb-1">문항 레벨 (Level)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 border border-slate-200 rounded text-sm placeholder:text-slate-300"
                                                        placeholder="레벨 입력 (선택)"
                                                        value={item.level || ''}
                                                        onChange={(e) => {
                                                            const newItems = [...items];
                                                            newItems[idx] = { ...newItems[idx], level: Number(e.target.value) };
                                                            setItems(newItems);
                                                        }}
                                                    />
                                                </div>

                                                {currentTemplate.itemFields.map(field => (
                                                    <div key={field.key}>
                                                        <label className="block text-xs font-bold text-slate-600 mb-1">
                                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                                        </label>
                                                        {renderInput(
                                                            field,
                                                            item[field.key],
                                                            (val) => {
                                                                const newItems = [...items];
                                                                newItems[idx] = { ...newItems[idx], [field.key]: val };
                                                                setItems(newItems);
                                                            }
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default DynamicActivityForm;
