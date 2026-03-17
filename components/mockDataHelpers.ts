
// Mock Data Helper for Reward Transactions
export const getMockRewardTransactions = (userId: string): import('../types').RewardTransaction[] => {
    return Array.from({ length: 30 }).map((_, i) => {
        const rand = Math.random();
        let type: import('../types').RewardTransactionType = 'ACQUIRED';
        if (rand > 0.6) type = 'USED';
        else if (rand > 0.9) type = 'EXPIRED';

        const category: 'LIGHTNING' | 'FLAME' = Math.random() > 0.5 ? 'LIGHTNING' : 'FLAME';
        let amount = Math.floor(Math.random() * 50) + 10;
        let description = '학습 완료 보상';
        if (type === 'USED') {
            const usedTypes = [
                '상점 아이템 구매',
                'AI 대화 시작 (주제: 교통수단)',
                'Activity 학습 완료',
                'AI 대화 프리토킹',
                '게임 리트라이 비용'
            ];
            description = usedTypes[Math.floor(Math.random() * usedTypes.length)];
            amount = Math.floor(Math.random() * 3) + 1; // 1~3 번개/불꽃 소모
        } else if (type === 'EXPIRED') {
            description = '유효기간 만료 소멸';
        }

        return {
            id: `rt-${i}`,
            userId,
            type,
            category,
            amount,
            description,
            date: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:00`
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock Data Helper for Learning History
export const getMockLearningHistory = (userId: string): import('../types').LearningHistoryItem[] => {
    return Array.from({ length: 14 }).map((_, i) => ({
        id: `lh-${i}`,
        userId,
        date: `2024-01-${String(15 - i).padStart(2, '0')}`,
        programTitle: '한국어 종합 교육 프로그램',
        courseTitle: '초급 1',
        unitTitle: '자기 소개',
        lessonTitle: '어느 나라 사람이에요?',
        moduleTitle: '핵심 표현 익히기',
        activityTitle: '말하기 연습',
        progressRate: Math.min(100, 10 + (i * 5)),
        studyTimeMinutes: 20 + Math.floor(Math.random() * 40),
        reportId: `rep-${i}`
    }));
};

// Mock Data Helper for Detailed Learning Report
export const getMockLearningReport = (reportId: string, historyItem: import('../types').LearningHistoryItem): import('../types').LearningReport => {
    return {
        id: reportId,
        learningHistoryId: historyItem.id,
        studyDate: historyItem.date,
        courseTitle: historyItem.courseTitle,
        lessonTitle: historyItem.lessonTitle,
        studyTimeMinutes: historyItem.studyTimeMinutes,
        todayExpressions: [
            '의사 소통 기능: 친구와 자기소개하기',
            '저는 타오예요.',
            '저는 베트남 사람이에요.',
            '저는 학생이에요.'
        ],
        pronunciationScore: {
            total: 73,
            accuracy: 73,
            fluency: 73,
            completeness: 73
        },
        aiConversations: [
            {
                id: 'c1',
                originalText: '안녕하세요. 저는 민지에요. 한국 사람에요.',
                correctedText: '안녕하세요. 저는 민지예요. 한국 사람이에요.',
                explanation: "'남'은 받침이 없는 말이어서 '예요'가 맞지만, '한국 사람에요'는 '사람이에요'가 맞습니다. 따라서 \"저는 남이에요. 한국 사람이에요.\"가 올바른 말입니다."
            },
            {
                id: 'c2',
                originalText: '안녕하세요. 저는 타오에요. 베트남 사람에요.',
                correctedText: '안녕하세요. 저는 타오예요. 베트남 사람이에요.',
                explanation: "이름 '타오'에는 받침이 없으므로 '예요'를 씁니다. '사람'은 받침이 있으므로 '이에요'를 씁니다."
            }
        ],
        teacherFeedback: {
            strengths: '기본적인 인사표현과 자기소개를 자신감있게 잘 표현했습니다.',
            improvements: "받침 유무에 따른 '이에요/예요' 사용을 조금 더 연습해보면 좋겠습니다."
        },
        quizResult: {
            correctCounts: 15,
            totalCounts: 20
        },
        adminMemo: '학생이 발음에 어려움을 느끼고 있음. 다음 수업에서 추가 피드백 필요.'
    };
};
