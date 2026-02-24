
import React, { useState, useMemo } from 'react';
import DataList from '../DataList';
import { Lesson, Activity } from '../../types';
import { MOCK_LESSONS, MOCK_ACTIVITIES, MOCK_TEMPLATE_REGISTRY } from '../mockData';
import { Layers, Plus, Trash2, ChevronRight, ChevronDown, MonitorPlay } from 'lucide-react';
import DynamicActivityForm from './DynamicActivityForm';

// ==========================================
// Types for Content Tree
// ==========================================
type ContentNodeType = 'LESSON' | 'ACTIVITY';

interface ContentTreeNode {
    id: string;
    type: ContentNodeType;
    title: string;
    data: any;
    children?: ContentTreeNode[];
}

const buildContentTree = (
    lesson: Lesson,
    activities: Activity[]
): ContentTreeNode => {
    return {
        id: lesson.id,
        type: 'LESSON',
        title: lesson.title,
        data: lesson,
        children: activities
            .filter(a => a.lessonId === lesson.id)
            .sort((a, b) => a.order - b.order)
            .map(activity => ({
                id: activity.id,
                type: 'ACTIVITY',
                title: activity.title,
                data: activity
            }))
    };
};

const ContentManagement: React.FC = () => {
    // 1. Master Data State
    const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
    const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);

    // 2. UI State
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

    // List Filter
    const [searchQuery, setSearchQuery] = useState('');

    // Detail UI State
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [selectedNode, setSelectedNode] = useState<{ id: string; type: ContentNodeType } | null>(null);
    const [editingNodeData, setEditingNodeData] = useState<any>(null);
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

    // 3. Helpers
    const filteredLessons = useMemo(() => {
        return lessons.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [lessons, searchQuery]);

    const currentTree = useMemo(() => {
        if (!selectedLessonId) return null;
        const lesson = lessons.find(l => l.id === selectedLessonId);
        if (!lesson) return null;
        return buildContentTree(lesson, activities);
    }, [selectedLessonId, lessons, activities]);

    // 4. Handlers (List)
    const handleCreateLesson = () => {
        const title = prompt('새로운 레슨 명을 입력하세요:');
        if (!title) return;

        const newLesson: Lesson = {
            id: `L-${Date.now()}`,
            title,
            description: '',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            createdBy: 'admin'
        };
        setLessons([newLesson, ...lessons]);
        // Optional: Go directly to detail
        if (confirm('생성된 레슨의 상세 편집 화면으로 이동하시겠습니까?')) {
            setSelectedLessonId(newLesson.id);
            setViewMode('DETAIL');
            setExpandedIds([newLesson.id]);
            handleEnterDetail(newLesson);
        }
    };

    const handleDeleteLesson = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!window.confirm('정말 삭제하시겠습니까? 이 레슨에 포함된 모든 액티비티가 삭제됩니다.')) return;

        setLessons(prev => prev.filter(l => l.id !== id));
        // Cascade delete
        setActivities(prev => prev.filter(a => a.lessonId !== id));
    };

    const handleEnterDetail = (lesson: Lesson) => {
        setSelectedLessonId(lesson.id);
        setViewMode('DETAIL');
        setExpandedIds([lesson.id]); // Auto expand root
        setSelectedNode({ id: lesson.id, type: 'LESSON' });
        setEditingNodeData({ ...lesson });
    };

    // 5. Handlers (Detail Tree)
    const handleNodeSelect = (id: string, type: ContentNodeType) => {
        setSelectedNode({ id, type });
        let data = null;
        if (type === 'LESSON') data = lessons.find(l => l.id === id);
        else if (type === 'ACTIVITY') data = activities.find(a => a.id === id);

        // Deep copy needed to avoid reference issues during editing
        setEditingNodeData(data ? JSON.parse(JSON.stringify(data)) : null);
    };

    const handleSaveDetail = () => {
        if (!selectedNode || !editingNodeData) return;
        const { type } = selectedNode;
        const timestamp = new Date().toISOString().split('T')[0];
        const updatedData = { ...editingNodeData, updatedAt: timestamp };

        if (type === 'LESSON') {
            setLessons(prev => prev.map(l => l.id === editingNodeData.id ? updatedData : l));
        } else if (type === 'ACTIVITY') {
            setActivities(prev => prev.map(a => a.id === editingNodeData.id ? updatedData : a));
        }
        alert('저장되었습니다.');
    };

    const handleAddChild = (parentId: string, parentType: ContentNodeType, e: React.MouseEvent) => {
        e.stopPropagation();
        const timestamp = new Date().toISOString().split('T')[0];

        if (parentType === 'LESSON') {
            const newId = `A-${Date.now()}`;
            const newActivity: Activity = {
                id: newId,
                lessonId: parentId,
                title: '새 액티비티',
                type: 'QUIZ',
                content: { templateId: '', common: {}, items: [] }, // New structure init
                order: activities.filter(a => a.lessonId === parentId).length + 1,
                createdAt: timestamp,
                updatedAt: timestamp
            };
            setActivities(prev => [...prev, newActivity]);
            setExpandedIds(prev => [...prev, parentId]);
            setTimeout(() => handleNodeSelect(newId, 'ACTIVITY'), 50);

        }
    };

    const handleDeleteNode = (id: string, type: ContentNodeType, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        if (type === 'ACTIVITY') {
            setActivities(prev => prev.filter(a => a.id !== id));
        }
        if (selectedNode?.id === id) setSelectedNode(null);
    };

    // 7. Drag & Drop Handlers
    const handleDragStart = (e: React.DragEvent, id: string, type: ContentNodeType) => {
        if (type !== 'ACTIVITY') {
            e.preventDefault();
            return;
        }
        setDraggedNodeId(id);
        e.dataTransfer.effectAllowed = 'move';
        // Ghost image customization if needed
    };

    const handleDragOver = (e: React.DragEvent, targetType: ContentNodeType) => {
        if (targetType === 'ACTIVITY') {
            e.preventDefault(); // Allow drop
            e.dataTransfer.dropEffect = 'move';
        }
    };

    const handleDrop = (e: React.DragEvent, targetId: string, targetType: ContentNodeType) => {
        e.preventDefault();

        if (!draggedNodeId || draggedNodeId === targetId) {
            setDraggedNodeId(null);
            return;
        }
        if (targetType !== 'ACTIVITY') return;

        // Reorder Logic
        const sourceActivity = activities.find(a => a.id === draggedNodeId);
        const targetActivity = activities.find(a => a.id === targetId);

        if (sourceActivity && targetActivity && sourceActivity.lessonId === targetActivity.lessonId) {
            const lessonId = sourceActivity.lessonId;
            const lessonActivities = activities
                .filter(a => a.lessonId === lessonId)
                .sort((a, b) => a.order - b.order);

            const fromIndex = lessonActivities.findIndex(a => a.id === draggedNodeId);
            const toIndex = lessonActivities.findIndex(a => a.id === targetId);

            if (fromIndex !== -1 && toIndex !== -1) {
                const newOrdered = [...lessonActivities];
                const [moved] = newOrdered.splice(fromIndex, 1);
                newOrdered.splice(toIndex, 0, moved);

                // Update orders in main state
                setActivities(prev => prev.map(a => {
                    if (a.lessonId !== lessonId) return a;
                    const newIndex = newOrdered.findIndex(item => item.id === a.id);
                    return newIndex !== -1 ? { ...a, order: newIndex + 1 } : a;
                }));
            }
        }
        setDraggedNodeId(null);
    };

    // 6. UI Renderers
    const columns = [
        { header: '레슨 코드', accessor: 'id' as keyof Lesson, width: 'w-32 font-mono text-xs' },
        {
            header: '레슨 명 (Title)',
            accessor: (l: Lesson) => (
                <span className="font-bold text-indigo-900 cursor-pointer hover:underline" onClick={() => handleEnterDetail(l)}>
                    {l.title}
                </span>
            ),
            width: 'flex-1'
        },
        { header: '설명', accessor: 'description' as keyof Lesson, width: 'flex-1 text-gray-500' },
        { header: '레벨', accessor: (l: Lesson) => l.level || '-', width: 'w-16 text-center' },
        { header: '생성일', accessor: 'createdAt' as keyof Lesson, width: 'w-32 text-center' },
        { header: '수정일', accessor: 'updatedAt' as keyof Lesson, width: 'w-32 text-center' },
        {
            header: '관리',
            accessor: (l: Lesson) => (
                <div className="flex justify-center space-x-2">
                    <button onClick={() => handleEnterDetail(l)} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold hover:bg-indigo-100">
                        편집
                    </button>
                    <button onClick={(e) => handleDeleteLesson(l.id, e)} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100">
                        삭제
                    </button>
                </div>
            ),
            width: 'w-40 text-center'
        }
    ];

    const renderTreeNode = (node: ContentTreeNode, depth: number) => {
        const isExpanded = expandedIds.includes(node.id);
        const isSelected = selectedNode?.id === node.id;
        const Icon = node.type === 'LESSON' ? Layers : MonitorPlay;
        const colorClass = node.type === 'LESSON' ? 'text-indigo-600' : 'text-emerald-500';

        return (
            <div key={node.id} className="relative select-none">
                {depth > 0 && (
                    <div className="absolute border-l border-slate-200 h-full left-3 top-0" style={{ left: `${depth * 20 + 4}px` }} />
                )}
                <div
                    className={`group flex items-center py-2 px-3 m-1 rounded-lg cursor-pointer transition-all
                        ${isSelected ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'}
                        ${draggedNodeId === node.id ? 'opacity-50 dashed border-2 border-indigo-300' : ''}
                    `}
                    style={{ paddingLeft: `${depth * 20 + 12}px` }}
                    onClick={() => handleNodeSelect(node.id, node.type)}
                    draggable={node.type === 'ACTIVITY'}
                    onDragStart={(e) => handleDragStart(e, node.id, node.type)}
                    onDragOver={(e) => handleDragOver(e, node.type)}
                    onDrop={(e) => handleDrop(e, node.id, node.type)}
                >
                    <div className="mr-2 p-0.5 rounded hover:bg-black/5 text-slate-400"
                        onClick={(e) => {
                            if (node.children && node.children.length > 0) {
                                e.stopPropagation();
                                setExpandedIds(prev => isExpanded ? prev.filter(id => id !== node.id) : [...prev, node.id]);
                            }
                        }}
                    >
                        {node.children && node.children.length > 0 ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div className="w-3.5" />}
                    </div>
                    <Icon size={16} className={`mr-2 ${colorClass}`} />
                    <span className={`text-sm truncate ${isSelected ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{node.title}</span>
                    {node.data.level && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-mono border border-slate-200">
                            Lv.{node.data.level}
                        </span>
                    )}

                    <div className={`ml-auto flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {node.type === 'LESSON' && (
                            <button onClick={(e) => handleAddChild(node.id, node.type, e)} className="p-1 hover:bg-white rounded text-indigo-500" title="액티비티 추가">
                                <Plus size={14} />
                            </button>
                        )}
                        {node.type !== 'LESSON' && (
                            <button onClick={(e) => handleDeleteNode(node.id, node.type, e)} className="p-1 hover:bg-white rounded text-red-500" title="삭제">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
                {isExpanded && node.children && (
                    <div className="animate-in slide-in-from-top-1">
                        {node.children.map(child => renderTreeNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    const renderDetailForm = () => {
        if (!selectedNode || !editingNodeData) return <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">항목을 선택하세요</div>;

        const { type } = selectedNode;

        return (
            <div className="flex-1 flex flex-col h-full bg-white">
                <div className="p-6 border-b border-slate-100 sticky top-0 bg-white z-10 flex justify-between items-center shadow-sm">
                    <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 mb-2 inline-block`}>
                            {type}
                        </span>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{editingNodeData.title}</h2>
                    </div>
                    <button onClick={handleSaveDetail} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-sm transition-colors">
                        변경사항 저장
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Common Metadata Section (Always visible) */}
                    <div className="p-6 border-b border-slate-50 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">제목</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-medium text-sm"
                                value={editingNodeData.title || ''}
                                onChange={e => setEditingNodeData({ ...editingNodeData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">학습 레벨</label>
                            <input
                                type="number"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-medium text-sm"
                                value={editingNodeData.level || ''}
                                onChange={e => setEditingNodeData({ ...editingNodeData, level: Number(e.target.value) })}
                                placeholder="레벨을 입력하세요 (선택)"
                            />
                        </div>

                        {type !== 'ACTIVITY' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">설명</label>
                                <textarea
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none h-24 resize-none text-sm"
                                    value={editingNodeData.description || ''}
                                    onChange={e => setEditingNodeData({ ...editingNodeData, description: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    {/* DYNAMIC FORM AREA */}
                    {type === 'ACTIVITY' ? (
                        <div className="flex-1 overflow-hidden bg-slate-50/30">
                            <DynamicActivityForm
                                initialData={editingNodeData.content}
                                onChange={(newContent) => {
                                    setEditingNodeData(prev => ({ ...prev, content: newContent }));
                                }}
                            />
                        </div>
                    ) : (
                        // Empty spacer for Lesson
                        <div className="flex-1 bg-slate-50/30 p-6 flex flex-col justify-center items-center text-slate-400 text-sm">
                            <Layers size={48} className="mb-4 opacity-20" />
                            <p>하위 항목(액티비티)을 추가하여 콘텐츠를 구성하세요.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (viewMode === 'LIST') {
        return (
            <DataList
                title="콘텐츠 관리 (Lesson)"
                breadcrumb="학습 관리 > 콘텐츠 관리"
                data={filteredLessons}
                columns={columns}
                onSearch={setSearchQuery}
                actions={
                    <button
                        onClick={handleCreateLesson}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 text-sm flex items-center"
                    >
                        <Plus size={18} className="mr-1" />
                        새 레슨 생성
                    </button>
                }
            />
        );
    }

    // Detail View
    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex items-center">
                    <button onClick={() => setViewMode('LIST')} className="mr-4 text-slate-400 hover:text-indigo-600 font-bold text-sm flex items-center">
                        ← 목록으로
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">콘텐츠 상세 편집</h1>
                        <div className="flex items-center mt-1 text-xs font-medium text-slate-500">
                            Lesson: <span className="text-indigo-600 ml-1">{lessons.find(l => l.id === selectedLessonId)?.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Tree */}
                <div className="w-[480px] border-r border-slate-100 bg-slate-50/50 flex flex-col">
                    <div className="p-3 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase flex justify-between items-center">
                        구조 탐색
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 font-normal">Drag & Drop 지원</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        {currentTree && renderTreeNode(currentTree, 0)}
                    </div>
                </div>

                {/* Right Form */}
                <div className="flex-1 overflow-hidden h-full">
                    {renderDetailForm()}
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
