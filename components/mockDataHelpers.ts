
// Mock Data Helper for Reward Transactions
export const getMockRewardTransactions = (userId: string): import('../types').RewardTransaction[] => {
    return Array.from({ length: 30 }).map((_, i) => {
        const rand = Math.random();
        let type: import('../types').RewardTransactionType = 'ACQUIRED';
        if (rand > 0.6) type = 'USED';
        else if (rand > 0.9) type = 'EXPIRED';

        const category: 'LIGHTNING' | 'FLAME' = Math.random() > 0.5 ? 'LIGHTNING' : 'FLAME';

        return {
            id: `rt-${i}`,
            userId,
            type,
            category,
            amount: Math.floor(Math.random() * 50) + 10,
            description: type === 'ACQUIRED' ? '학습 완료 보상' : (type === 'USED' ? '상점 아이템 구매' : '유효기간 만료 소멸'),
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
        studyTimeMinutes: 20 + Math.floor(Math.random() * 40)
    }));
};
