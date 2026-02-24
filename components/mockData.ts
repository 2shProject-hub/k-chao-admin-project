
import { User, Teacher, UserStatus, LoginMethod, UserType, RewardHistory, Program, Course, Unit, Lesson, ActivityCategory, TemplateConfig } from '../types';

// ==========================================
// Learning Mock Data (Centralized)
// ==========================================

export const MOCK_ACTIVITY_CATEGORIES: ActivityCategory[] = [
    { id: 'MT_INTRO', title: '학습소개', code: 'INTRO', description: '레슨 도입부 소개', createdAt: '2024-01-01', createdBy: 'admin', updatedAt: '2024-01-01', updatedBy: 'admin' },
    { id: 'MT_VOCAB', title: '단어 학습', code: 'VOCAB', description: '주요 어휘 학습', createdAt: '2024-01-01', createdBy: 'admin', updatedAt: '2024-01-01', updatedBy: 'admin' },
    { id: 'MT_SENTENCE', title: '문장 학습', code: 'SENTENCE', description: '핵심 문장 및 문법', createdAt: '2024-01-01', createdBy: 'admin', updatedAt: '2024-01-01', updatedBy: 'admin' },
    { id: 'MT_CONV', title: '대화문 학습', code: 'CONV', description: '실전 대화문 청취 및 연습', createdAt: '2024-01-01', createdBy: 'admin', updatedAt: '2024-01-01', updatedBy: 'admin' },
    { id: 'MT_AI', title: 'AI 대화 미션', code: 'AI_MISSION', description: 'AI와의 롤플레이 미션', createdAt: '2024-01-01', createdBy: 'admin', updatedAt: '2024-01-01', updatedBy: 'admin' },
];

export const MOCK_PROGRAMS: Program[] = [
    { id: '1', title: '기본 한국어 학습', description: '개인 회원을 위한 한국어 학습 과정', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', title: '안장대학교 한국어 학습', description: '안장대학교(단체) 학생을 위한 학국어 학습 과정', createdAt: '2024-02-01', updatedAt: '2024-02-01' }
];

export const MOCK_COURSES: Course[] = [
    { id: '101', programId: '1', title: '입문', description: '한글 자모와 기초 표현', order: 1, level: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '102', programId: '1', title: '초급', description: '기본적인 일상 대화', order: 2, level: 2, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '103', programId: '1', title: '중급', description: '확장된 표현과 문법', order: 3, level: 3, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '201', programId: '2', title: '입문', description: '반도체 실무를 위한 기초 표현', order: 1, level: 1, createdAt: '2024-02-01', updatedAt: '2024-02-01' },
];

export const MOCK_UNITS: Unit[] = [
    // Course 101 Units
    { id: '1001', courseId: '101', title: '밥스 엉클', description: '모음과 자음 영상', order: 1, level: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', lessonIds: ['L1', 'L2'] },
    { id: '1002', courseId: '101', title: '한글 차트', description: '받침과 발음', order: 2, level: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', lessonIds: [] },
    // Course 102 Units
    { id: '2001', courseId: '102', title: '초급 1', description: '이름과 국적 말하기', order: 1, level: 2, createdAt: '2024-01-01', updatedAt: '2024-01-01', lessonIds: ['L4'] },
    { id: '2002', courseId: '102', title: '초급 2', description: '과거 시제 익히기', order: 2, level: 2, createdAt: '2024-01-01', updatedAt: '2024-01-01', lessonIds: [] },
];

export const MOCK_LESSONS: Lesson[] = [
    // Unit 1001 Lessons
    { id: 'L1', title: '자음 영상', description: '기본 모음 10개', level: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'L2', title: '모음 영상', description: '기본 자음 14개', level: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // Unit 2001 Lessons
    { id: 'L4', title: 'L1 나는 흐엉이에요.', description: '국적 묻고 답하기', level: 2, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Module Layer Removed. linking Activity directly to Lesson.
// Old Modules:
// M1 -> L1 (Intro)
// M2 -> L1 (Vocab)
// M3 -> L2 (Sentence)

export const MOCK_ACTIVITIES: import('../types').Activity[] = [
    // Link to L1
    { id: 'A1', lessonId: 'L1', type: 'VIDEO', title: 'L1 나는 흐엉이에요 학습소개 영상', content: { url: 'video_a_ya.mp4' }, order: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // { id: 'A2', lessonId: 'L1', type: 'SPEAKING', title: '발음 연습', content: { words: ['아', '야'] }, order: 2, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'A3', lessonId: 'L1', type: 'QUIZ', title: 'L1 나는 흐엉이에요 발음 평가', content: {}, order: 2, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const MOCK_QUESTIONS: import('../types').Question[] = [
    { id: 'Q1', activityId: 'A3', type: 'MULTIPLE_CHOICE', text: '베트남', options: ['아', '어', '오', '우'], answer: '아', order: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'Q2', activityId: 'A3', type: 'OX', text: '회사원', options: [], answer: 'X', order: 2, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Deprecated in favor of MOCK_TEMPLATE_REGISTRY
export const MOCK_TEMPLATES: import('../types').Template[] = [
    { id: 'T1', name: '객관식 퀴즈 템플릿', categoryId: 'MT_VOCAB', description: '4지 선다형 퀴즈', requiredFields: ['text', 'options'], createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'T2', name: '영상 학습 템플릿', categoryId: 'MT_INTRO', description: '유튜브/MP4 영상 재생', requiredFields: ['videoUrl'], createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'T3', name: '말하기 연습 템플릿', categoryId: 'MT_CONV', description: '음성 녹음 및 분석', requiredFields: ['text', 'audio'], createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'T4', name: '단어 매칭 템플릿', categoryId: 'MT_VOCAB', description: '그림과 단어 연결', requiredFields: ['pairs'], createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// ==========================================
// 1. Level 1: Organizations (Groups)
// ==========================================
export const MOCK_ORGANIZATIONS = [
    { id: 'org-1', name: '안장 대학교', assignedProgramIds: ['1', '2'], defaultProgramId: '2' },
    { id: 'org-2', name: '삼성전자 베트남', assignedProgramIds: ['2'], defaultProgramId: '1' },
    { id: 'org-3', name: '세종학당', assignedProgramIds: ['1'], defaultProgramId: '1' },
];

// ==========================================
// 2. Level 2: Teachers (Optional)
// ==========================================
export const MOCK_TEACHERS: Teacher[] = [
    { id: 'tea-1', organizationId: 'org-1', name: '김철수 교수', email: 'kim@hanoi.edu', assignedStudentCount: 0 },
    { id: 'tea-2', organizationId: 'org-1', name: '이영희 강사', email: 'lee@hanoi.edu', assignedStudentCount: 0 },
    { id: 'tea-3', organizationId: 'org-2', name: '박민수 매니저', email: 'park@samsung.com', assignedStudentCount: 0 },
];

// ==========================================
// 3. Level 3: Students (Users)
// ==========================================
export const MOCK_USERS: User[] = [
    {
        id: '1',
        memberCode: 'UID-2023-0001',
        email: 'v.le@gmail.com',
        nickname: 'Le Van An',
        loginMethod: 'GOOGLE',
        status: 'ACTIVE',
        type: 'PAID_GROUP',
        groupName: '안장 대학교',
        organizationId: 'org-1',
        teacherId: 'tea-1',
        joinedAt: '2026-01-10',
        lastLoginAt: '2026-01-15 09:15',
        withdrawnAt: '',
        dormantAt: '',
        rewardLightning: 150,
        rewardFlame: 30,
        expiringLightning: 15, // 10% expiring
        expiringFlame: 5,
        // New Fields for Learning Progress
        progressRate: 45,
        currentLevel: '초급 1',
        lastStudyDate: '2026-01-15 09:00',
        assignedProgramId: '1',
        courseHistory: [
            { id: 'ch-1', userId: '1', newProgramId: '1', changedAt: '2026-01-10', changedBy: 'system', reason: 'Initial Assignment' }
        ]
    } as User,
    {
        id: '2',
        memberCode: 'UID-2023-0002',
        email: 'n.tran@fb.com',
        nickname: 'Tran Thi Binh',
        loginMethod: 'FACEBOOK',
        status: 'WITHDRAWN',
        type: 'FREE',
        organizationId: null, // B2C User
        teacherId: null,
        joinedAt: '2025-12-05',
        lastLoginAt: '2025-12-23 22:40',
        withdrawnAt: '2026-01-01',
        dormantAt: '',
        rewardLightning: 0,
        rewardFlame: 0,
        expiringLightning: 0,
        expiringFlame: 0,
        progressRate: 10,
        currentLevel: '입문',
        lastStudyDate: '2025-12-23'
    } as User,
    {
        id: '3',
        memberCode: 'UID-2023-0003',
        email: 'p.nguyen@apple.com',
        nickname: 'Nguyen Minh',
        loginMethod: 'APPLE',
        status: 'DORMANT',
        type: 'PAID_GROUP',
        groupName: '삼성전자 베트남',
        organizationId: 'org-2',
        teacherId: null,
        joinedAt: '2025-11-15',
        lastLoginAt: '2025-12-20 18:20',
        withdrawnAt: '',
        dormantAt: '2026-01-10',
        rewardLightning: 50,
        rewardFlame: 10,
        expiringLightning: 10,
        expiringFlame: 2,
        progressRate: 78,
        currentLevel: '중급 1',
        lastStudyDate: '2025-12-20',
        assignedProgramId: '2',
        courseHistory: [
            { id: 'ch-2', userId: '3', newProgramId: '2', changedAt: '2025-11-15', changedBy: 'admin', reason: 'Changed by Admin' }
        ]
    } as User,
    ...Array.from({ length: 50 }).map((_, i) => {
        const isGroup = i % 3 !== 0; // 2/3 are group members
        const org = isGroup ? MOCK_ORGANIZATIONS[i % MOCK_ORGANIZATIONS.length] : null;
        const hasTeacher = isGroup && i % 2 === 0; // 50% of group members have teachers
        const teacher = hasTeacher && org
            ? MOCK_TEACHERS.find(t => t.organizationId === org.id) || null
            : null;

        return {
            id: `temp-${i}`,
            memberCode: `UID-2026-${(i + 100).toString().padStart(4, '0')}`,
            email: `user${i}@provider.com`,
            nickname: `베트남사용자_${i}`,
            loginMethod: ['GOOGLE', 'FACEBOOK', 'APPLE'][i % 3] as LoginMethod,
            status: (i % 10 === 0 ? 'WITHDRAWN' : i % 10 === 1 ? 'DORMANT' : 'ACTIVE') as UserStatus,
            type: (org ? 'PAID_GROUP' : 'FREE') as UserType,
            groupName: org?.name,
            organizationId: org?.id || null, // Ensure explicit null
            teacherId: teacher?.id || null, // Ensure explicit null
            joinedAt: '2026-01-05',
            lastLoginAt: '2026-01-14 12:00',
            withdrawnAt: '2026-01-15',
            dormantAt: '',
            rewardLightning: Math.floor(Math.random() * 200),
            rewardFlame: Math.floor(Math.random() * 50),
            expiringLightning: Math.floor(Math.random() * 20),
            expiringFlame: Math.floor(Math.random() * 5),
            progressRate: Math.floor(Math.random() * 100),
            currentLevel: ['입문', '초급 1', '초급 2', '중급 1'][i % 4],
            lastStudyDate: '2026-01-14 10:00'
        } as User;
    })
];

// Helper to get Reward History
export const generateMockRewardHistory = (userId: string): RewardHistory[] => {
    return Array.from({ length: 25 }).map((_, i) => ({
        id: `rh-${i}`,
        userId: userId,
        category: i % 3 === 0 ? 'FLAME' : 'LIGHTNING',
        name: i % 3 === 0 ? '학습 완료 보상' : (i % 2 === 0 ? '일일출석' : '연속출석'),
        amount: i % 3 === 0 ? 5 : (i % 2 === 0 ? 5 : 10),
        acquiredAt: `2024-05-${String(25 - i).padStart(2, '0')}`,
        expiredAt: `2024-06-${String(25 - i).padStart(2, '0')}`
    }));
};

// ==========================================
// Template Registry (Moved from constants)
// ==========================================

const COMMON_TITLES = [
    { key: 'title_vi', label: '액티비티 타이틀 (베트남어)', type: 'TEXT' as const, required: false }, // 선택으로 변경
    { key: 'title_ko', label: '액티비티 타이틀 (한국어)', type: 'TEXT' as const, required: true },
];

const FEEDBACK_AUDIO = {
    key: 'feedback_audio',
    label: '피드백용 한국어 음성',
    type: 'AUDIO' as const,
    encourage: '정답/오답 시 재생될 피드백 음원입니다.'
};

export const MOCK_TEMPLATE_REGISTRY: Record<string, TemplateConfig> = {
    LEARNING_INTRO: {
        id: 'LEARNING_INTRO',
        name: '학습 소개 (영상)',
        description: '영상 재생을 통해 학습을 소개하는 액티비티',
        commonFields: [
            { key: 'video_ko', label: '한국어 영상', type: 'VIDEO', required: true },
            { key: 'video_vi', label: '베트남어 영상', type: 'VIDEO', required: false }, // 선택으로 변경
        ],
        itemFields: [],
        constraints: { minItems: 0, maxItems: 0 },
        version: 1.0
    },
    PRONUNCIATION: {
        id: 'PRONUNCIATION',
        name: '단어: 발음 평가', // 명칭 변경
        description: '이미지와 단어를 보고 듣고 말하기 (발음 평가 진행)',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'image', label: '이미지', type: 'IMAGE', required: false }, // 선택으로 변경
            { key: 'word_ko', label: '한국어 단어', type: 'TEXT', required: true },
            { key: 'word_vi', label: '베트남어 단어', type: 'TEXT', required: true },
            { key: 'audio_ko', label: '한국어 음성(음원)', type: 'AUDIO', required: true },
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    LISTENING_CHOICE: {
        id: 'LISTENING_CHOICE',
        name: '단어: 소리듣고 고르기', // 명칭 변경
        description: '음권을 듣고 맞는 보기를 선택',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'question_audio', label: '문제 음성(음원)', type: 'AUDIO', required: true },
            {
                key: 'options',
                label: '보기 (한국어 단어)',
                type: 'LIST_TEXT',
                required: true,
                minCount: 2,
                maxCount: 4,
                encourage: '정답 보기는 첫 번째에 입력하거나 별도 정답 지정 필드를 사용하세요.'
            },
            { key: 'answer_index', label: '정답 번호 (0부터 시작)', type: 'NUMBER', required: true },
            FEEDBACK_AUDIO
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    WORD_SELECT: {
        id: 'WORD_SELECT',
        name: '단어: 단어에 맞는 한국어 고르기', // 명칭 변경
        description: '베트남 단어를 보고 한국어 단어(음성 포함) 선택',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'word_vi', label: '베트남 단어', type: 'TEXT', required: true },
            {
                key: 'options_complex',
                label: '보기 세트 (한국어 단어 + 음성)',
                type: 'SET_WORD_EXAMPLE',
                required: true,
                minCount: 1,
                maxCount: 4,
                encourage: '각 보기는 [한국어 단어]와 [음성 파일]로 구성됩니다.'
            },
            FEEDBACK_AUDIO
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    MATCHING: {
        id: 'MATCHING',
        name: '단어: 베트남어 한국어 짝 맞추기', // 명칭 변경
        description: '베트남 단어와 한국어 단어를 매칭',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            {
                key: 'pairs',
                label: '단어 쌍 (베트남어 - 한국어)',
                type: 'LIST_PAIR',
                required: true,
                minCount: 2,
                maxCount: 5,
                encourage: '정답 쌍을 입력하세요. 한국어 단어 입력 시 음성도 함께 등록됩니다.'
            }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    SENTENCE_BLANK: {
        id: 'SENTENCE_BLANK',
        name: '문장: 빈칸 채우기', // 명칭 변경
        description: '한국어 문장의 빈칸에 알맞은 단어 선택',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'sentence_ko', label: '한국어 문장', type: 'TEXT', required: true, encourage: '빈칸은 [BLANK] 로 표시하세요.' },
            { key: 'options', label: '보기 (단어)', type: 'LIST_TEXT', required: true, minCount: 2, maxCount: 4 },
            { key: 'answer_word', label: '정답 단어', type: 'TEXT', required: true },
            FEEDBACK_AUDIO
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    LISTEN_SPEAK: {
        id: 'LISTEN_SPEAK',
        name: '문장: 발음 평가', // 듣고 말하기 -> 발음 평가로 변경
        description: '한국어 음성을 듣고 문장 말하기 (발음평가)',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'audio_ko', label: '한국어 음성', type: 'AUDIO', required: true },
            { key: 'sentence_ko', label: '한국어 문장', type: 'TEXT', required: true },
            { key: 'sentence_vi', label: '베트남어 문장(해석)', type: 'TEXT', required: true },
            {
                key: 'word_helps',
                label: '단어 도움말 세트',
                type: 'SET_WORD_EXAMPLE',
                required: false,
                encourage: '도움말 단어, 음성, 예시문장, 예시입력'
            }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    SENTENCE_ORDER: {
        id: 'SENTENCE_ORDER',
        name: '문장: 단어를 배열하여 문장 만들기', // 명칭 변경
        description: '나열된 단어들을 순서대로 선택하여 문장 완성',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'sentence_ko', label: '정답 한국어 문장', type: 'TEXT', required: true },
            { key: 'sentence_vi', label: '베트남어 문장', type: 'TEXT', required: true },
            {
                key: 'word_chunks',
                label: '보기 단어들 (오답 포함 가능)',
                type: 'LIST_TEXT',
                required: true,
                minCount: 4,
                maxCount: 6
            },
            FEEDBACK_AUDIO
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    DIALOGUE_COMPLETION: {
        id: 'DIALOGUE_COMPLETION',
        name: '문장: 문장 완성하기', // 명칭 변경
        description: '이미지와 문맥을 보고 빈칸 문장 입력',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'image', label: '상황 이미지', type: 'IMAGE', required: true },
            { key: 'context_ko', label: '제시 문장 (한국어)', type: 'TEXT', required: true },
            { key: 'context_audio', label: '제시 문장 음원', type: 'AUDIO', required: true },
            { key: 'blank_answer_ko', label: '빈칸 정답 (한국어)', type: 'TEXT', required: true },
            { key: 'blank_answer_audio', label: '정답 음원', type: 'AUDIO', required: true },
            FEEDBACK_AUDIO
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    DIALOGUE_INTRO: {
        id: 'DIALOGUE_INTRO',
        name: '대화: 대화문 학습 시작', // 명칭 변경
        description: '전체 대화문 미리보기 및 듣기 (2인 대화)',
        commonFields: [
            ...COMMON_TITLES,
            { key: 'speaker1_img', label: '화자1 썸네일', type: 'IMAGE', required: false }, // 선택으로 변경
            { key: 'speaker2_img', label: '화자2 썸네일', type: 'IMAGE', required: false }, // 선택으로 변경
        ],
        itemFields: [
            {
                key: 'speaker_role',
                label: '화자 선택',
                type: 'SELECT',
                options: [{ label: '화자 1', value: '1' }, { label: '화자 2', value: '2' }],
                required: true
            },
            { key: 'sentence_ko', label: '한국어 대화', type: 'TEXT', required: true },
            { key: 'sentence_vi', label: '베트남어 대화', type: 'TEXT', required: true },
            { key: 'audio_ko', label: '한국어 음성', type: 'AUDIO', required: true },
        ],
        constraints: { minItems: 2, hasPreview: true },
        version: 1.0
    },
    SHADOWING: {
        id: 'SHADOWING',
        name: '대화: 따라 말하기 (발음 평가)', // 명칭 변경
        description: '대화문을 읽고 말하기 (발음평가)',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'sentence_ko', label: '한국어 대화', type: 'TEXT', required: true },
            { key: 'audio_ko', label: '한국어 음성', type: 'AUDIO', required: true },
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    ROLEPLAY: {
        id: 'ROLEPLAY',
        name: '대화: 롤플레잉', // 명칭 변경
        description: '역할을 선택하여 대화 참여',
        commonFields: [
            ...COMMON_TITLES,
            { key: 'speaker1_img', label: '화자1 썸네일', type: 'IMAGE', required: false }, // 선택으로 변경
            { key: 'speaker2_img', label: '화자2 썸네일', type: 'IMAGE', required: false }, // 선택으로 변경
        ],
        itemFields: [
            {
                key: 'speaker_role',
                label: '화자 선택',
                type: 'SELECT',
                options: [{ label: '화자 1', value: '1' }, { label: '화자 2', value: '2' }],
                required: true
            },
            { key: 'sentence_ko', label: '한국어 대화', type: 'TEXT', required: true },
            { key: 'sentence_vi', label: '베트남어 대화', type: 'TEXT', required: true },
            { key: 'audio_ko', label: '한국어 음성', type: 'AUDIO', required: true },
        ],
        constraints: { minItems: 2 },
        version: 1.0
    },
    AI_MISSION: {
        id: 'AI_MISSION',
        name: 'AI 대화 미션',
        description: 'AI와 자유 대화 미션 수행',
        commonFields: [
            { key: 'mission_title_ko', label: '미션 타이틀 (한국어)', type: 'TEXT', required: true },
            { key: 'mission_title_vi', label: '미션 타이틀 (베트남어)', type: 'TEXT', required: true },
            { key: 'desc_ko', label: '미션 설명 (한국어)', type: 'TEXT_AREA', required: true },
            { key: 'desc_vi', label: '미션 설명 (베트남어)', type: 'TEXT_AREA', required: true },
            { key: 'ai_prompt', label: 'AI 프롬프트 (System Prompt)', type: 'TEXT_AREA', required: true, encourage: 'AI의 페르소나와 미션 목표를 상세히 지시하세요.' },
        ],
        itemFields: [],
        constraints: { minItems: 0, maxItems: 0 },
        version: 1.0
    },
    SCRAMBLE_CHAR: {
        id: 'SCRAMBLE_CHAR',
        name: '스펠링 스크램블: 글자',
        description: '제시되는 글자를 보고 순서에 맞게 글자 만들기',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'presented_char', label: '제시 글자', type: 'TEXT', required: true },
            {
                key: 'option_chars',
                label: '보기 글자들',
                type: 'LIST_TEXT',
                required: true,
                minCount: 2,
                maxCount: 10
            },
            {
                key: 'char_type',
                label: '글자 유형 선택',
                type: 'SELECT',
                options: [{ label: '초/중/종', value: 'IMF' }, { label: '자/모', value: 'CV' }],
                required: true
            }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    SCRAMBLE_WORD: {
        id: 'SCRAMBLE_WORD',
        name: '스펠링 스크램블: 단어',
        description: '제시되는 단어를 보고 순서에 맞게 단어 만들기',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'presented_word', label: '제시 단어', type: 'TEXT', required: true },
            {
                key: 'option_chars',
                label: '보기 글자들',
                type: 'LIST_TEXT',
                required: true,
                minCount: 2,
                maxCount: 10
            },
            { key: 'word_length', label: '단어 글자 수', type: 'NUMBER', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    FLIP_CARD: {
        id: 'FLIP_CARD',
        name: '단어 카드 뒤집기',
        description: '한국어 단어 카드를 선택하여 베트남어 단어와 오디오 확인',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'word_ko', label: '한국어 단어', type: 'TEXT', required: true },
            { key: 'word_vi', label: '베트남어 단어', type: 'TEXT', required: true },
            { key: 'audio_ko', label: '한국어 오디오', type: 'AUDIO', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    CATEGORY_CLASSIFY: {
        id: 'CATEGORY_CLASSIFY',
        name: '카테고리 분류',
        description: '제시되는 단어(글자)에 해당하는 보기 선택',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'presented_text', label: '제시 단어(글자)', type: 'TEXT', required: true },
            {
                key: 'options',
                label: '보기 글자 (한국어/베트남어)',
                type: 'LIST_TEXT',
                required: true,
                minCount: 2,
                maxCount: 6
            },
            {
                key: 'answers',
                label: '정답 보기들 (N개)',
                type: 'LIST_TEXT',
                required: true,
                encourage: '보기 중에서 정답에 해당하는 것들을 입력하세요.'
            }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    LISTEN_TYPE: {
        id: 'LISTEN_TYPE',
        name: '듣고 타이핑하기',
        description: '오디오를 듣고 오디오를 키보드로 입력',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'audio_ko', label: '오디오', type: 'AUDIO', required: true },
            { key: 'answer_text', label: '정답 글자', type: 'TEXT', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    VIDEO_PLAYER: {
        id: 'VIDEO_PLAYER',
        name: '동영상 플레이',
        description: '학습 관련 영상을 시청하는 액티비티',
        commonFields: [
            { key: 'video_ko', label: '한국어 영상', type: 'VIDEO', required: true },
            { key: 'subtitle_vi', label: '베트남어 자막 URL', type: 'TEXT', required: true, encourage: '자막 파일 URL 또는 텍스트 트랙 URL' }
        ],
        itemFields: [],
        constraints: { minItems: 0, maxItems: 0 },
        version: 1.0
    },
    LISTEN_WRITE: {
        id: 'LISTEN_WRITE',
        name: '소리 듣고 글자 쓰기',
        description: '오디오를 듣고 오디오에 맞는 글자를 쓰는 액티비티',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'audio_ko', label: '오디오', type: 'AUDIO', required: true },
            {
                key: 'sample_guide_id',
                label: '샘플 가이드 선택 (1-40)',
                type: 'SELECT',
                required: true,
                options: Array.from({ length: 40 }, (_, i) => ({ label: `Guide ${i + 1}`, value: String(i + 1) }))
            },
            { key: 'answer_text', label: '정답 글자', type: 'TEXT', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    MAKE_CHAR_CV_V: {
        id: 'MAKE_CHAR_CV_V',
        name: '소리 듣고 글자 만들기 (자음+모음) - 세로형',
        description: '오디오를 듣고 자음, 모음을 선택하여 글자 만들기 (세로형)',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'audio_ko', label: '오디오', type: 'AUDIO', required: true },
            { key: 'answer_text', label: '정답 글자', type: 'TEXT', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    MAKE_CHAR_CV_H: {
        id: 'MAKE_CHAR_CV_H',
        name: '소리 듣고 글자 만들기 (자음+모음) - 가로형',
        description: '오디오를 듣고 자음, 모음을 선택하여 글자 만들기 (가로형)',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'audio_ko', label: '오디오', type: 'AUDIO', required: true },
            { key: 'answer_text', label: '정답 글자', type: 'TEXT', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    MAKE_CHAR_IMF_1: {
        id: 'MAKE_CHAR_IMF_1',
        name: '소리 듣고 글자 만들기 (초+중+종) - Type 1',
        description: '오디오를 듣고 초성, 중성, 종성을 선택하여 글자 만들기 (Type 1)',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'audio_ko', label: '오디오', type: 'AUDIO', required: true },
            { key: 'answer_text', label: '정답 글자', type: 'TEXT', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    MAKE_CHAR_IMF_2: {
        id: 'MAKE_CHAR_IMF_2',
        name: '소리 듣고 글자 만들기 (초+중+종) - Type 2',
        description: '오디오를 듣고 초성, 중성, 종성을 선택하여 글자 만들기 (Type 2)',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'audio_ko', label: '오디오', type: 'AUDIO', required: true },
            { key: 'answer_text', label: '정답 글자', type: 'TEXT', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    IMAGE_SOUND_SELECT: {
        id: 'IMAGE_SOUND_SELECT',
        name: '이미지 보고 소리 선택',
        description: '제시되는 이미지에 맞는 오디오를 선택',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'image', label: '제시 이미지', type: 'IMAGE', required: true },
            { key: 'option_audio_1', label: '오디오 보기 1', type: 'AUDIO', required: true },
            { key: 'option_audio_2', label: '오디오 보기 2', type: 'AUDIO', required: true },
            { key: 'option_audio_3', label: '오디오 보기 3', type: 'AUDIO', required: true },
            { key: 'option_audio_4', label: '오디오 보기 4', type: 'AUDIO', required: true },
            { key: 'answer_index', label: '정답 번호 (1-4)', type: 'NUMBER', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    IMAGE_TEXT_SELECT: {
        id: 'IMAGE_TEXT_SELECT',
        name: '이미지 보고 글자 선택',
        description: '제시되는 이미지에 맞는 글자를 선택',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'image', label: '제시 이미지', type: 'IMAGE', required: true },
            {
                key: 'options',
                label: '글자 보기 (4개)',
                type: 'LIST_TEXT',
                required: true,
                minCount: 4,
                maxCount: 4
            },
            { key: 'answer_index', label: '정답 번호 (1-4)', type: 'NUMBER', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
    IMAGE_SOUND_TEXT_MATCH: {
        id: 'IMAGE_SOUND_TEXT_MATCH',
        name: '이미지+소리와 같은 글자 선택',
        description: '이미지+소리에 해당하는 글자를 선택',
        commonFields: [...COMMON_TITLES],
        itemFields: [
            { key: 'image', label: '제시 이미지', type: 'IMAGE', required: true },
            { key: 'audio', label: '제시 오디오', type: 'AUDIO', required: true },
            {
                key: 'options',
                label: '글자 보기 (4개)',
                type: 'LIST_TEXT',
                required: true,
                minCount: 4,
                maxCount: 4
            },
            { key: 'answer_index', label: '정답 번호 (1-4)', type: 'NUMBER', required: true }
        ],
        constraints: { minItems: 1 },
        version: 1.0
    },
};

