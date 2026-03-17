export type AdminRoleType = 'SUPER_ADMIN' | 'OPERATION_ADMIN' | 'GROUP_ADMIN' | 'TEACHER';

export type LoginMethod = 'GOOGLE' | 'FACEBOOK' | 'APPLE';
export type UserType = 'FREE' | 'PAID_INDIVIDUAL' | 'PAID_GROUP';
export type UserStatus = 'ACTIVE' | 'DORMANT' | 'WITHDRAWN';

export interface User {
  id: string;
  memberCode: string; // 회원코드(유니크)
  email: string;      // 회원 계정 (소셜 로그인용)
  loginMethod: LoginMethod; // 간편로그인 구분
  nickname: string;
  status: UserStatus;
  type: UserType;
  joinedAt: string;    // 가입일시
  lastLoginAt: string; // 최근 접속일시
  groupName?: string;  // 단체명
  withdrawnAt?: string; // 탈퇴일시
  dormantAt?: string;   // 휴면일시
  rewardLightning: number; // 보유 번개 수
  rewardFlame: number;     // 보유 불꽃 수
  expiringLightning?: number; // 소멸 예정 번개 (7일 이내 등)
  expiringFlame?: number;     // 소멸 예정 불꽃
  organizationId?: string | null; // 소속 단체 ID (Level 1)
  teacherId?: string | null;      // 담당 교사 ID (Level 2)
  rewardBalances?: Record<string, { amount: number; expiring: number; }>; // 동적 보상 잔액
  // 단체 유료 회원 전용 (인증 정보)
  authEmail?: string;  // 단체 인증 시 입력한 이메일
  authName?: string;   // 단체 인증 시 입력한 성명
  authGroupCode?: string; // 사용된 단체 코드
  // 학습 정보
  progressRate?: number;    // 학습 진도율 (0-100)
  currentLevel?: string;    // 현재 학습 레벨
  lastStudyDate?: string;   // 최근 학습일
  assignedProgramId?: string; // 현재 배정된 강좌 ID
  courseHistory?: CourseHistoryItem[]; // 강좌 변경 이력
}

export interface CourseHistoryItem {
  id: string;
  userId: string;
  previousProgramId?: string;
  newProgramId: string;
  changedAt: string;
  changedBy: string; // e.g., 'admin', 'teacher_1'
  reason?: string;
}

export interface RewardHistory {
  id: string;
  userId: string;
  category: RewardCategory; // 'LIGHTNING' | 'FLAME'
  name: string;             // 보상 종류 (활동 명)
  amount: number;           // 보상 금액 (포인트)
  acquiredAt: string;       // 획득 일시
  expiredAt: string;        // 만료 일시
}

export type RewardTransactionType = 'ACQUIRED' | 'USED' | 'EXPIRED';

export interface RewardTransaction {
  id: string;
  userId: string;
  type: RewardTransactionType;
  category: RewardCategory;
  amount: number;
  description: string;
  date: string;
}

export interface LearningHistoryItem {
  id: string;
  userId: string;
  date: string;
  programTitle: string;
  courseTitle: string;
  unitTitle: string;
  lessonTitle: string;
  moduleTitle?: string;
  activityTitle?: string;
  progressRate: number;
  studyTimeMinutes: number;
  reportId?: string; // 상세 리포트 정보가 있을 경우의 ID
}

export interface PronunciationScore {
  total: number;
  accuracy: number;
  fluency: number;
  completeness: number;
}

export interface CorrectedConversation {
  id: string;
  originalText: string;
  correctedText: string;
  explanation: string;
}

export interface TeacherFeedback {
  strengths: string;
  improvements: string;
}

export interface LearningReport {
  id: string;
  learningHistoryId: string;
  studyDate: string;
  courseTitle: string;
  lessonTitle: string;
  studyTimeMinutes: number;
  todayExpressions: string[];
  pronunciationScore: PronunciationScore;
  aiConversations: CorrectedConversation[];
  teacherFeedback: TeacherFeedback;
  quizResult: {
    correctCounts: number;
    totalCounts: number;
  };
  adminMemo?: string;
}

export interface Coupon {
  id: string;
  name: string;
  discountRate: number; // 할인율
  expiryDate: string;
  useCount: number;
}

export interface GiftCard {
  id: string;
  name: string;
  duration: number; // 적용기간
  unit: 'DAY' | 'MONTH' | 'YEAR'; // 연장 단위
  expiryDate: string;
}

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
}

export type InquiryStatus = 'PENDING' | 'ANSWERED';

export interface Inquiry {
  id: string;
  title: string;
  userId: string;
  userEmail: string;    // 등록 계정
  userNickname: string; // 닉네임
  content: string;      // 문의 내용
  answer?: string;      // 답변 내용
  status: InquiryStatus;
  createdAt: string;    // 등록 일시
  answeredAt?: string;  // 변경 일시 (답변 완료 시)
}

export type GroupStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
export type GroupType = 'COMPANY' | 'SCHOOL' | 'PUBLIC' | 'OTHER';

export interface Group {
  id: string;
  name: string;           // 단체명
  type: GroupType;       // 단체 구분
  businessNumber?: string; // 사업자등록번호 (Optional)
  representative: string; // 대표자명
  adminEmail: string;     // 관리자 이메일 (Main Contact)
  memberCount: number;    // 소속 회원 수
  maxMembers: number;     // 최대 허용 회원 수
  contractStart: string;  // 계약 시작일
  contractEnd: string;    // 계약 종료일
  status: GroupStatus;    // 상태
  createdAt: string;      // 등록일
  assignedProgramIds?: string[]; // 단체 배정 강좌 목록 (1:N)
  defaultProgramId?: string;     // 기본 배정 강좌 (Default)
  groupCodes?: GroupCode[];      // 발행된 단체 코드 목록
  authPreRegs?: GroupAuthPreReg[]; // 사전 등록된 인증 대상자 정보
}

export type GroupCodeStatus = 'ACTIVE' | 'EXPIRED' | 'INACTIVE';

export interface GroupCode {
  id: string;
  groupId: string;
  code: string;           // 유니크 단체 코드
  assignedProgramId?: string; // 배정 강좌 (예: 기본 한국어 학습)
  assignedLevels: string[]; // 이용 가능 단계 (입문, 초급1, 초급2 등)
  startDate: string;      // 유효 기간 시작
  endDate: string;        // 유효 기간 종료
  status: GroupCodeStatus;
  createdAt: string;
}

export interface GroupAuthPreReg {
  id: string;
  groupId: string;
  groupCode: string; // 사전 매칭될 단체 코드 (옵션일 수 있으나 기획상 포함)
  email: string;     // 사전 등록 이메일
  name: string;      // 사전 등록 성명
  isUsed: boolean;   // 인증 완료 여부
  usedAt?: string;   // 인증 일시
  userId?: string;   // 인증한 회원 ID
}

export interface Teacher {
  id: string;
  organizationId: string; // 소속 단체 ID
  name: string;
  email: string;
  assignedStudentCount: number;
}

export type RewardCategory = string;

export interface RewardItem {
  id: string;
  code: string;        // API 연동용 코드
  category: RewardCategory;
  name: string;        // 보상 내용 (활동 명)
  description?: string; // 상세 설명
  points: number;      // 포상 포인트
  validDays: number;   // 유효 기간 (일)
  isConsumable: boolean; // 소비 여부 (재화로 사용 가능 여부)
  icon: string;        // 보상 아이콘
  updatedAt: string;   // 최근 수정일
}

// Learning Management Types
export interface Program {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy?: string; // e.g., 'admin_01'
  lastModifiedAt?: string;
  isDefault?: boolean; // 기본 강좌 여부
}

export interface Course {
  id: string;
  programId: string;
  title: string;
  description?: string;
  order: number;
  level?: number; // 학습 레벨
  createdAt: string;
  updatedAt: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export interface Unit {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  level?: number; // 학습 레벨
  createdAt: string;
  updatedAt: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  lessonIds?: string[]; // 연결된 Lesson ID 목록 (순서대로)
}

export interface Lesson {
  id: string;
  // unitId: string; // Removed: Lesson is now independent
  title: string;
  description?: string;
  // order: number; // Order is meaningful when attached to a Unit, not intrinsically? Or kept for default sort?
  // Let's keep 'order' if it's used for listing/sorting within the library, but usually order is defined by the parent (Unit).
  // However, within the new Content Management menu, getting a list might use creation date.
  level?: number; // 학습 레벨
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface ActivityCategory {
  id: string;
  title: string;          // 카테고리 명 (예: 학습소개, 단어 학습)
  code: string;           // 카테고리 코드
  description?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// export type ModuleType = 'LEARNING' | 'ISOLATED_ACTIVITY'; // Deprecated in favor of ModuleTypeDefinition

// LearningModule removed. Hierarchy is now Lesson -> Activity.

export type ActivityType = 'QUIZ' | 'SPEAKING' | 'WORD_MATCH' | 'VIDEO' | 'OTHER';

export interface Activity {
  id: string;
  lessonId: string; // Direct link to Lesson
  templateId?: string; // Selected Template ID
  type: ActivityType; // Kept for backward compatibility or categorization
  title: string;
  content: any; // Flexible content based on type
  order: number;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export type QuestionType = 'MULTIPLE_CHOICE' | 'OX' | 'SHORT_ANSWER';

export interface Question {
  id: string;
  activityId: string;
  type: QuestionType;
  text: string;           // 지문
  options?: string[];     // 보기 (객관식)
  answer: string;         // 정답
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type TemplateLevel = 'INTRO' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Template {
  id: string;
  name: string;        // 템플릿 명
  categoryId: string; // Refers to ActivityCategory
  description?: string;
  requiredFields: string[];
  createdAt: string;
  updatedAt: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

// Finance & Settlement Types
export type PaymentPlatform = 'GOOGLE' | 'APPLE' | 'WEB';
export type PaymentStatus = 'PAID' | 'REFUNDED' | 'CANCELLED' | 'PENDING';

export interface Settlement {
  id: string;
  userId: string;
  userNickname: string; // Display name
  planName: string;     // e.g., 'Basic Monthly', 'Premium Yearly'
  amount: number;
  currency: 'KRW' | 'VND' | 'USD';
  platform: PaymentPlatform;
  status: PaymentStatus;
  paymentDate: string;    // When user paid
  settlementDate: string; // Expected/Actual settlement date
  transactionId: string;  // External Transaction ID
}

export interface AdminAccount {
  id: string; // User ID
  name: string;
  group: string;
  useYn: 'Y' | 'N';
  registrant: string;
  registeredAt: string;
  modifier: string;
  modifiedAt: string;
  email?: string;
  contact?: string;
  emergencyContact?: string;
  password?: string;
  role: AdminRoleType;    // Role-based Access Control
  referenceId?: string;   // Organization ID or Teacher ID for scoping
  permissions?: string[]; // List of Menu IDs allowed
  passwordChanged: boolean; // 최초 로그인 후 비밀번호 변경 여부
  accountStatus: 'ACTIVE' | 'INACTIVE'; // 계정 활성/비활성 상태
}

// 클래스(Class) 운영을 위한 스터디 그룹
export interface StudyGroup {
  id: string;
  organizationId: string;
  name: string;
  teacherId: string; // 담당 교사 ID (AdminAccount.id)
  studentIds: string[]; // 소속 회원 ID 목록 (최대 30명)
  createdAt: string;
  description?: string;
}

// ==========================================
// Template Registry System Types
// ==========================================

export type FieldType =
  | 'TEXT'
  | 'TEXT_AREA'
  | 'NUMBER'
  | 'IMAGE'
  | 'AUDIO'
  | 'VIDEO'
  | 'BOOLEAN' // 체크박스 등
  | 'SELECT' // 단순 선택
  | 'LIST_TEXT' // 텍스트 리스트 (단순 보기 등)
  | 'LIST_PAIR' // 짝 리스트 (베-한 짝 등)
  | 'SET_WORD_EXAMPLE'; // 복합 세트 (단어+음성+예시문장... 특수 케이스)

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FieldDefinition {
  key: string;          // 데이터 키 값 (예: 'title_ko')
  label: string;        // 표시 라벨 (예: '타이틀(한국어)')
  type: FieldType;
  required?: boolean;
  encourage?: string; // 작성 가이드/힌트
  options?: FieldOption[]; // SELECT 타입일 경우
  maxLength?: number;
  // 리스트 제약
  minCount?: number;
  maxCount?: number;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  // 1. 공통 리소스 (액티비티 전체에 적용되는 리소스)
  commonFields: FieldDefinition[];
  // 2. 문항 리소스 (N개의 문항 각각에 필요한 리소스)
  itemFields: FieldDefinition[];
  // 3. 제약 조건 및 설정
  constraints: {
    minItems: number; // 0이면 문항 없는 단일 액티비티
    maxItems?: number;
    hasPreview?: boolean; // 미리보기 지원 여부 등
  };
  version: number;        // 템플릿 버전 (x.x)
  basedOn?: string;       // 복제 시 원본 템플릿 ID
}

export interface ActivityContent {
  templateId: string;
  common: Record<string, any>; // 공통 데이터 값
  items: Record<string, any>[]; // 문항 데이터 리스트
}
