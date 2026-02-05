// src/constants/gameData.ts

export interface QuizQuestion {
    id: string;
    question: string;
    answers: string[];
    correctAnswer: number;
    category: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 'q1',
        question: 'What does "NPC" stand for in gaming?',
        answers: [
            'New Player Character',
            'Non-Player Character',
            'Network Player Connection',
            'Next Player Cycle',
        ],
        correctAnswer: 1,
        category: 'Gaming Terms',
    },
    {
        id: 'q2',
        question: 'What is the term for a game that can be played without an internet connection?',
        answers: ['Online game', 'Offline game', 'Solo game', 'Private game'],
        correctAnswer: 1,
        category: 'Gaming Terms',
    },
    {
        id: 'q3',
        question: 'What does "FPS" commonly stand for in gaming?',
        answers: [
            'Fast Player Speed',
            'First Person Shooter / Frames Per Second',
            'Full Player Score',
            'Free Play Session',
        ],
        correctAnswer: 1,
        category: 'Gaming Terms',
    },
    {
        id: 'q4',
        question: 'What is a "sandbox" game?',
        answers: [
            'A game set on a beach',
            'A game with no clear objectives and open exploration',
            'A game for children only',
            'A game with time limits',
        ],
        correctAnswer: 1,
        category: 'Game Genres',
    },
    {
        id: 'q5',
        question: 'What does "RPG" stand for?',
        answers: [
            'Rapid Play Game',
            'Role-Playing Game',
            'Random Player Generator',
            'Real Physics Game',
        ],
        correctAnswer: 1,
        category: 'Game Genres',
    },
    {
        id: 'q6',
        question: 'What is "grinding" in gaming?',
        answers: [
            'Making the game harder',
            'Repetitive tasks to gain experience or items',
            'Playing multiple games at once',
            'Quitting a game early',
        ],
        correctAnswer: 1,
        category: 'Gaming Terms',
    },
    {
        id: 'q7',
        question: 'What is a "beta test" in game development?',
        answers: [
            'The final version of a game',
            'Testing phase before official release',
            'A type of racing game',
            'A game difficulty setting',
        ],
        correctAnswer: 1,
        category: 'Game Development',
    },
    {
        id: 'q8',
        question: 'What does "DLC" stand for?',
        answers: [
            'Digital Loading Content',
            'Downloadable Content',
            'Direct Link Connection',
            'Developer Limited Content',
        ],
        correctAnswer: 1,
        category: 'Gaming Terms',
    },
    {
        id: 'q9',
        question: 'What is a "speedrun"?',
        answers: [
            'A race in a game',
            'Completing a game as fast as possible',
            'Running speed in a character',
            'Internet speed for gaming',
        ],
        correctAnswer: 1,
        category: 'Gaming Culture',
    },
    {
        id: 'q10',
        question: 'What is "PvP"?',
        answers: [
            'Pay versus Play',
            'Player versus Player',
            'Point versus Point',
            'Play very Politely',
        ],
        correctAnswer: 1,
        category: 'Gaming Terms',
    },
    {
        id: 'q11',
        question: 'What is an "indie game"?',
        answers: [
            'A game from India',
            'A game made by independent developers',
            'An indoor game',
            'A game about music',
        ],
        correctAnswer: 1,
        category: 'Game Industry',
    },
    {
        id: 'q12',
        question: 'What does "AFK" mean?',
        answers: [
            'Always Free to Kill',
            'Away From Keyboard',
            'Asking For Knowledge',
            'Another Fun Kill',
        ],
        correctAnswer: 1,
        category: 'Gaming Terms',
    },
    {
        id: 'q13',
        question: 'What is a "checkpoint" in games?',
        answers: [
            'A place to check your items',
            'A save point to respawn if you fail',
            'The end of a level',
            'A multiplayer meeting spot',
        ],
        correctAnswer: 1,
        category: 'Game Mechanics',
    },
    {
        id: 'q14',
        question: 'What is "loot" in gaming?',
        answers: [
            'Game music',
            'Items collected from enemies or chests',
            'A type of character',
            'Game settings',
        ],
        correctAnswer: 1,
        category: 'Gaming Terms',
    },
    {
        id: 'q15',
        question: 'What does "GG" mean in gaming chat?',
        answers: [
            'Get Going',
            'Good Game',
            'Great Graphics',
            'Game Glitch',
        ],
        correctAnswer: 1,
        category: 'Gaming Culture',
    },
    {
        id: 'q16',
        question: 'What is a "tutorial" in a game?',
        answers: [
            'The hardest level',
            'A teaching section that explains how to play',
            'A type of multiplayer mode',
            'End-game content',
        ],
        correctAnswer: 1,
        category: 'Game Mechanics',
    },
    {
        id: 'q17',
        question: 'What does "respawn" mean?',
        answers: [
            'Quitting the game',
            'Coming back to life after dying',
            'Saving the game',
            'Pausing the game',
        ],
        correctAnswer: 1,
        category: 'Gaming Terms',
    },
    {
        id: 'q18',
        question: 'What is "multiplayer"?',
        answers: [
            'Playing alone',
            'A mode where multiple people play together',
            'A single-player story',
            'A game difficulty',
        ],
        correctAnswer: 1,
        category: 'Game Modes',
    },
    {
        id: 'q19',
        question: 'What is a "boss" in games?',
        answers: [
            'The player character',
            'A powerful enemy often at the end of a level',
            'A helpful character',
            'The game developer',
        ],
        correctAnswer: 1,
        category: 'Game Mechanics',
    },
    {
        id: 'q20',
        question: 'What does "lag" mean in online gaming?',
        answers: [
            'Winning easily',
            'Delay caused by slow internet connection',
            'A type of weapon',
            'A game genre',
        ],
        correctAnswer: 1,
        category: 'Online Gaming',
    },
];

export const SPIN_WHEEL_VALUES = [
    { value: 50, label: '50', weight: 25 },
    { value: 75, label: '75', weight: 20 },
    { value: 100, label: '100', weight: 20 },
    { value: 125, label: '125', weight: 15 },
    { value: 150, label: '150', weight: 10 },
    { value: 200, label: '200', weight: 5 },
    { value: 250, label: '250', weight: 3 },
    { value: 500, label: '500', weight: 2 },
];

export const SCRATCH_CARD_RANGES = {
    min: 25,
    max: 500,
    commonMax: 150,
    rareMin: 250,
};

export const AVATAR_OPTIONS = [
    { id: 0, emoji: '🎮' },
    { id: 1, emoji: '🎯' },
    { id: 2, emoji: '🎲' },
    { id: 3, emoji: '🏆' },
    { id: 4, emoji: '⭐' },
    { id: 5, emoji: '🚀' },
    { id: 6, emoji: '💎' },
    { id: 7, emoji: '🎪' },
];