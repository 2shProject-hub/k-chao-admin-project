import React, { useState, useMemo } from 'react';
import DataList from '../DataList';
import { Program, Course, Unit, Lesson } from '../../types';
import { MOCK_PROGRAMS, MOCK_COURSES, MOCK_UNITS, MOCK_LESSONS } from '../mockData';
import { Layers, GraduationCap, BookOpen, Plus, Trash2, ChevronRight, ChevronDown, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// Types for Program Tree
// ==========================================
type ProgramNodeType = 'PROGRAM' | 'COURSE' | 'UNIT' | 'LINKED_LESSON';

interface ProgramTreeNode {
    id: string;
    type: ProgramNodeType;
    title: string;
    data: any;
    children?: ProgramTreeNode[];
    isLinked?: boolean; // For Lesson nodes
}

const buildProgramTree = (
    program: Program,
    courses: Course[],
    units: Unit[],
    lessons: Lesson[]
): ProgramTreeNode => {
    // 1. Get courses for this program
    const programCourses = courses.filter(c => c.programId === program.id).sort((a, b) => a.order - b.order);

    return {
        id: program.id,
        type: 'PROGRAM',
        title: program.title,
        data: program,
        children: programCourses.map(course => ({
            id: course.id,
            type: 'COURSE',
            title: course.title,
            data: course,
            children: units
                .filter(u => u.courseId === course.id)
                .sort((a, b) => a.order - b.order)
                .map(unit => {
                    // Resolve linked lessons
                    const linkedLessons = (unit.lessonIds || [])
                        .map(lId => lessons.find(l => l.id === lId))
                        .filter(l => l !== undefined) as Lesson[];

                    return {
                        id: unit.id,
                        type: 'UNIT',
                        title: unit.title,
                        data: unit,
                        children: linkedLessons.map(lesson => ({
                            id: lesson.id,
                            type: 'LINKED_LESSON', // Special type
                            title: lesson.title,
                            data: lesson,
                            isLinked: true
                        }))
                    };
                })
        }))
    };
};

const ProgramManagement: React.FC = () => {
    const navigate = useNavigate();

    // 1. Master Data State
    const [programs, setPrograms] = useState<Program[]>(MOCK_PROGRAMS);
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [units, setUnits] = useState<Unit[]>(MOCK_UNITS);
    // Lessons are Read-Only source here
    const [allLessons] = useState<Lesson[]>(MOCK_LESSONS);

    // 2. UI State
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');
    const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [selectedNode, setSelectedNode] = useState<{ id: string; type: ProgramNodeType } | null>(null);
    const [editingNodeData, setEditingNodeData] = useState<any>(null);

    // Linked Lesson Modal
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [targetUnitId, setTargetUnitId] = useState<string | null>(null);
    const [lessonSearchQuery, setLessonSearchQuery] = useState('');

    const filteredLessons = useMemo(() => {
        return allLessons.filter(l => l.title.toLowerCase().includes(lessonSearchQuery.toLowerCase()));
    }, [allLessons, lessonSearchQuery]);

    // 3. Tree Builder
    const currentTree = useMemo(() => {
        if (!selectedProgramId) return null;
        const program = programs.find(p => p.id === selectedProgramId);
        if (!program) return null;
        return buildProgramTree(program, courses, units, allLessons);
    }, [selectedProgramId, programs, courses, units, allLessons]);


    // 4. Handlers (List)
    const handleCreateProgram = () => {
        const title = prompt('새 강좌 명을 입력하세요:');
        if (!title) return;
        const newProgram: Program = {
            id: `P-${Date.now()}`,
            title,
            description: '',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
        };
        setPrograms([newProgram, ...programs]);
        if (confirm('상세 구성 화면으로 이동하시겠습니까?')) {
            handleEnterDetail(newProgram);
        }
    };

    const handleEnterDetail = (program: Program) => {
        setSelectedProgramId(program.id);
        setViewMode('DETAIL');
        setExpandedIds([program.id]);
        setSelectedNode({ id: program.id, type: 'PROGRAM' });
        setEditingNodeData({ ...program });
    };

    // 5. Handlers (Detail Tree)
    const handleNodeSelect = (id: string, type: ProgramNodeType) => {
        setSelectedNode({ id, type });
        let data = null;
        if (type === 'PROGRAM') data = programs.find(p => p.id === id);
        else if (type === 'COURSE') data = courses.find(c => c.id === id);
        else if (type === 'UNIT') data = units.find(u => u.id === id);
        else if (type === 'LINKED_LESSON') data = allLessons.find(l => l.id === id); // Read-only view
        setEditingNodeData(data ? { ...data } : null);
    };

    const handleSaveDetail = () => {
        if (!selectedNode || !editingNodeData) return;
        const { type } = selectedNode;
        const timestamp = new Date().toISOString().split('T')[0];
        const updatedData = { ...editingNodeData, updatedAt: timestamp };

        if (type === 'PROGRAM') {
            setPrograms(prev => prev.map(p => p.id === editingNodeData.id ? updatedData : p));
        } else if (type === 'COURSE') {
            setCourses(prev => prev.map(c => c.id === editingNodeData.id ? updatedData : c));
        } else if (type === 'UNIT') {
            setUnits(prev => prev.map(u => u.id === editingNodeData.id ? updatedData : u));
        }
        // Linked Lesson cannot be edited here
        alert('저장되었습니다.');
    };

    const handleAddChild = (parentId: string, parentType: ProgramNodeType, e: React.MouseEvent) => {
        e.stopPropagation();
        const timestamp = new Date().toISOString().split('T')[0];

        if (parentType === 'PROGRAM') {
            // Add Course
            const newId = `C-${Date.now()}`;
            const newCourse: Course = {
                id: newId,
                programId: parentId,
                title: '새 코스',
                order: courses.filter(c => c.programId === parentId).length + 1,
                createdAt: timestamp,
                updatedAt: timestamp
            };
            setCourses(prev => [...prev, newCourse]);
            setExpandedIds(prev => [...prev, parentId]);
            setTimeout(() => handleNodeSelect(newId, 'COURSE'), 50);

        } else if (parentType === 'COURSE') {
            // Add Unit
            const newId = `U-${Date.now()}`;
            const newUnit: Unit = {
                id: newId,
                courseId: parentId,
                title: '새 단원',
                order: units.filter(u => u.courseId === parentId).length + 1,
                lessonIds: [],
                createdAt: timestamp,
                updatedAt: timestamp
            };
            setUnits(prev => [...prev, newUnit]);
            setExpandedIds(prev => [...prev, parentId]);
            setTimeout(() => handleNodeSelect(newId, 'UNIT'), 50);
        } else if (parentType === 'UNIT') {
            // Link Lesson (Open Modal)
            setTargetUnitId(parentId);
            setLessonSearchQuery('');
            setIsLinkModalOpen(true);
        }
    };

    const handleLinkLesson = (lessonId: string) => {
        if (!targetUnitId) return;

        setUnits(prev => prev.map(u => {
            if (u.id === targetUnitId) {
                const currentIds = u.lessonIds || [];
                // Allow duplicates? Usually no.
                // Requirement said "N개를 연결할 수 있습니다." -> implies multiple.
                // But duplicates of same lesson in same unit might be weird. Let's allow for now as it doesn't break logic.
                return { ...u, lessonIds: [...currentIds, lessonId] };
            }
            return u;
        }));

        setIsLinkModalOpen(false);
        setExpandedIds(prev => [...prev, targetUnitId]);
    };

    const handleDeleteNode = (id: string, type: ProgramNodeType, parentId: string | undefined, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('정말 삭제(해제)하시겠습니까?')) return;

        if (type === 'COURSE') {
            // Cascade delete simulation (In real app, backend handles constraint or cascade)
            setCourses(prev => prev.filter(c => c.id !== id));
            const courseUnits = units.filter(u => u.courseId === id);
            const unitIds = courseUnits.map(u => u.id);
            setUnits(prev => prev.filter(u => u.courseId !== id));
            // Lessons are not deleted, just unlinked implicitly when Unit is gone
        } else if (type === 'UNIT') {
            setUnits(prev => prev.filter(u => u.id !== id));
        } else if (type === 'LINKED_LESSON') {
            // Unlink
            if (!parentId) return; // Should have parent Unit
            setUnits(prev => prev.map(u => {
                if (u.id === parentId) {
                    // Remove ONLY the specific instance? Or the first match?
                    // Since we don't have unique IDs for links, remove first match of LessonID
                    const index = (u.lessonIds || []).indexOf(id);
                    if (index > -1) {
                        const newIds = [...(u.lessonIds || [])];
                        newIds.splice(index, 1);
                        return { ...u, lessonIds: newIds };
                    }
                }
                return u;
            }));
        }

        if (selectedNode?.id === id) setSelectedNode(null);
    };

    // 6. UI
    const renderTreeNode = (node: ProgramTreeNode, depth: number, parentId?: string) => {
        const isExpanded = expandedIds.includes(node.id);
        const isSelected = selectedNode?.id === node.id && selectedNode.type === node.type;

        let Icon = Layers;
        let colorClass = 'text-slate-400';

        if (node.type === 'PROGRAM') { Icon = Layers; colorClass = 'text-indigo-600'; }
        else if (node.type === 'COURSE') { Icon = GraduationCap; colorClass = 'text-blue-500'; }
        else if (node.type === 'UNIT') { Icon = BookOpen; colorClass = 'text-teal-500'; }
        else if (node.type === 'LINKED_LESSON') { Icon = LinkIcon; colorClass = 'text-slate-500'; }

        return (
            <div key={`${node.type}-${node.id}`} className="relative select-none">
                {depth > 0 && (
                    <div className="absolute border-l border-slate-200 h-full left-3 top-0" style={{ left: `${depth * 20 + 4}px` }} />
                )}
                <div
                    className={`group flex items-center py-2 px-3 m-1 rounded-lg cursor-pointer transition-all
                        ${isSelected ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'}`}
                    style={{ paddingLeft: `${depth * 20 + 12}px` }}
                    onClick={() => handleNodeSelect(node.id, node.type)}
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

                    <div className={`ml-auto flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {node.type !== 'LINKED_LESSON' && (
                            <button onClick={(e) => handleAddChild(node.id, node.type, e)} className="p-1 hover:bg-white rounded text-indigo-500" title={node.type === 'UNIT' ? '레슨 연결' : '하위 항목 추가'}>
                                {node.type === 'UNIT' ? <LinkIcon size={14} /> : <Plus size={14} />}
                            </button>
                        )}
                        {node.type !== 'PROGRAM' && (
                            <button onClick={(e) => handleDeleteNode(node.id, node.type, parentId, e)} className="p-1 hover:bg-white rounded text-red-500" title="삭제/해제">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
                {isExpanded && node.children && (
                    <div className="animate-in slide-in-from-top-1">
                        {node.children.map(child => renderTreeNode(child, depth + 1, node.id))}
                    </div>
                )}
            </div>
        );
    };

    if (viewMode === 'LIST') {
        const columns = [
            { header: 'ID', accessor: 'id' as keyof Program, width: 'w-24 font-mono text-xs' },
            {
                header: '강좌명',
                accessor: (p: Program) => (
                    <span className="font-bold text-indigo-900 cursor-pointer hover:underline" onClick={() => handleEnterDetail(p)}>
                        {p.title}
                    </span>
                ),
                width: 'flex-1'
            },
            { header: '설명', accessor: 'description' as keyof Program, width: 'flex-1 text-gray-500' },
            { header: '생성일', accessor: 'createdAt' as keyof Program, width: 'w-32 text-center' },
            {
                header: '관리',
                accessor: (p: Program) => (
                    <div className="flex justify-center space-x-2">
                        <button onClick={() => handleEnterDetail(p)} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold hover:bg-indigo-100">
                            구조 관리
                        </button>
                    </div>
                ),
                width: 'w-32 text-center'
            }
        ];
        return (
            <DataList
                title="강좌 관리 (Program)"
                breadcrumb="학습 관리 > 강좌 관리"
                data={programs}
                columns={columns}
                actions={
                    <button onClick={handleCreateProgram} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md text-sm flex items-center">
                        <Plus size={18} className="mr-1" /> 새 강좌 등록
                    </button>
                }
            />
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex items-center">
                    <button onClick={() => setViewMode('LIST')} className="mr-4 text-slate-400 hover:text-indigo-600 font-bold text-sm flex items-center">
                        ← 목록으로
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">강좌 구조 편집</h1>
                        <div className="flex items-center mt-1 text-xs font-medium text-slate-500">
                            Program: <span className="text-indigo-600 ml-1">{programs.find(p => p.id === selectedProgramId)?.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Tree */}
                <div className="w-80 border-r border-slate-100 bg-slate-50/50 flex flex-col">
                    <div className="p-3 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase flex justify-between items-center">
                        강좌 구조 탐색
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        {currentTree && renderTreeNode(currentTree, 0)}
                    </div>
                </div>

                {/* Right Form */}
                <div className="flex-1 overflow-hidden h-full flex flex-col">
                    {selectedNode && editingNodeData ? (
                        <>
                            <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 mb-2 inline-block`}>
                                        {selectedNode.type}
                                    </span>
                                    <h2 className="text-xl font-bold text-slate-800">{editingNodeData.title}</h2>
                                </div>
                                {selectedNode.type !== 'LINKED_LESSON' && (
                                    <button onClick={handleSaveDetail} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-sm">
                                        변경사항 저장
                                    </button>
                                )}
                            </div>
                            <div className="p-6 overflow-y-auto space-y-6">
                                {selectedNode.type === 'LINKED_LESSON' ? (
                                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 text-center">
                                        <p className="text-orange-800 font-bold mb-2">연결된 레슨 정보</p>
                                        <p className="text-sm text-orange-600 mb-4">
                                            이 항목은 '콘텐츠 관리'에서 별도로 관리되는 레슨의 바로가기입니다.<br />
                                            내용 수정은 콘텐츠 관리 메뉴에서 진행해주세요.
                                        </p>
                                        <button
                                            // onClick={() => navigate('/learning/contents')} // Assuming router setup logic
                                            className="px-4 py-2 bg-white border border-orange-200 text-orange-700 rounded-lg text-sm font-bold shadow-sm"
                                        >
                                            레슨 ID: {editingNodeData.id}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">제목</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-medium"
                                                value={editingNodeData.title || ''}
                                                onChange={e => setEditingNodeData({ ...editingNodeData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">설명</label>
                                            <textarea
                                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none h-32 resize-none"
                                                value={editingNodeData.description || ''}
                                                onChange={e => setEditingNodeData({ ...editingNodeData, description: e.target.value })}
                                            />
                                        </div>

                                        {/* Metadata View */}
                                        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
                                            <div>
                                                <span className="font-bold block text-slate-400 mb-1">생성 정보</span>
                                                {editingNodeData.createdAt}
                                            </div>
                                            <div>
                                                <span className="font-bold block text-slate-400 mb-1">최근 수정 정보</span>
                                                {editingNodeData.updatedAt}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">항목을 선택하세요</div>
                    )}
                </div>
            </div>

            {/* Link Lesson Modal */}
            {isLinkModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg h-[600px] flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">레슨 연결하기</h3>
                            <button onClick={() => setIsLinkModalOpen(false)}><ChevronDown className="rotate-180" /></button>
                        </div>
                        <div className="p-4 border-b border-slate-100">
                            <input
                                type="text"
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                placeholder="레슨 명 검색..."
                                value={lessonSearchQuery}
                                onChange={e => setLessonSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {filteredLessons.map(lesson => (
                                <div key={lesson.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border-b border-slate-50 last:border-0">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{lesson.title}</p>
                                        <p className="text-xs text-slate-500 truncate w-64">{lesson.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleLinkLesson(lesson.id)}
                                        className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700"
                                    >
                                        선택
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramManagement;
