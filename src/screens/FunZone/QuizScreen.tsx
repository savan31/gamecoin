// src/screens/FunZone/QuizScreen.tsx

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
    FadeInDown,
    FadeOutUp,
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    selectQuizStats,
    updateQuizScore,
    saveFunZoneData,
} from '../../store/slices/funZoneSlice';
import { selectHapticsEnabled } from '../../store/slices/settingsSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';
import { QUIZ_QUESTIONS, QuizQuestion } from '../../constants/gameData';
import { shuffleArray } from '../../utils/random';

type GameState = 'idle' | 'playing' | 'finished';

const QUESTIONS_PER_GAME = 10;

export const QuizScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const quizStats = useAppSelector(selectQuizStats);
    const hapticsEnabled = useAppSelector(selectHapticsEnabled);

    const [gameState, setGameState] = useState<GameState>('idle');
    const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const progressWidth = useSharedValue(0);
    const feedbackScale = useSharedValue(0);

    const currentQuestion = useMemo(() => {
        return currentQuestions[currentIndex] || null;
    }, [currentQuestions, currentIndex]);

    const progressPercentage = useMemo(() => {
        if (currentQuestions.length === 0) return 0;
        return ((currentIndex + 1) / currentQuestions.length) * 100;
    }, [currentIndex, currentQuestions.length]);

    useEffect(() => {
        progressWidth.value = withTiming(progressPercentage, { duration: 300 });
    }, [progressPercentage, progressWidth]);

    const startGame = useCallback(() => {
        const shuffled = shuffleArray([...QUIZ_QUESTIONS]);
        const selected = shuffled.slice(0, QUESTIONS_PER_GAME);
        setCurrentQuestions(selected);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setGameState('playing');
    }, []);

    const handleSelectAnswer = useCallback(
        (answerIndex: number) => {
            if (selectedAnswer !== null || !currentQuestion) return;

            setSelectedAnswer(answerIndex);
            setShowResult(true);

            const isCorrect = answerIndex === currentQuestion.correctAnswer;

            if (isCorrect) {
                setScore((prev) => prev + 1);
                if (hapticsEnabled) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
            } else {
                if (hapticsEnabled) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                }
            }

            feedbackScale.value = withSequence(
                withSpring(1.1, { damping: 8 }),
                withSpring(1, { damping: 12 })
            );

            // Auto advance after delay
            setTimeout(() => {
                if (currentIndex < currentQuestions.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                } else {
                    // Game finished
                    dispatch(updateQuizScore(score + (isCorrect ? 1 : 0)));
                    dispatch(saveFunZoneData());
                    setGameState('finished');
                }
            }, 1500);
        },
        [
            selectedAnswer,
            currentQuestion,
            currentIndex,
            currentQuestions.length,
            hapticsEnabled,
            feedbackScale,
            dispatch,
            score,
        ]
    );

    const progressAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    const feedbackAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: feedbackScale.value }],
    }));

    const getAnswerStyle = useCallback(
        (index: number) => {
            if (!showResult) {
                return {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                };
            }

            if (index === currentQuestion?.correctAnswer) {
                return {
                    backgroundColor: `${theme.colors.success}20`,
                    borderColor: theme.colors.success,
                };
            }

            if (index === selectedAnswer && index !== currentQuestion?.correctAnswer) {
                return {
                    backgroundColor: `${theme.colors.error}20`,
                    borderColor: theme.colors.error,
                };
            }

            return {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                opacity: 0.5,
            };
        },
        [showResult, currentQuestion, selectedAnswer, theme]
    );

    const renderIdleState = () => (
        <Animated.View entering={FadeInDown.duration(400)}>
            <Card style={styles.statsCard}>
                <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
                    Your Quiz Stats
                </Text>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {quizStats.highScore}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            High Score
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {quizStats.totalGamesPlayed}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            Games Played
                        </Text>
                    </View>
                </View>
            </Card>

            <Card style={styles.infoCard}>
                <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                    How to Play
                </Text>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                    Answer {QUESTIONS_PER_GAME} trivia questions about gaming.
                    Test your knowledge and try to beat your high score!
                </Text>
                <Text style={[styles.infoNote, { color: theme.colors.textTertiary }]}>
                    Note: This is just for fun. No real rewards or prizes.
                </Text>
            </Card>

            <Button
                title="Start Quiz"
                onPress={startGame}
                variant="primary"
                size="large"
                style={styles.startButton}
            />
        </Animated.View>
    );

    const renderPlayingState = () => (
        <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutUp.duration(200)}
            style={styles.playingContainer}
        >
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            { backgroundColor: theme.colors.primary },
                            progressAnimatedStyle,
                        ]}
                    />
                </View>
                <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                    Question {currentIndex + 1} of {currentQuestions.length}
                </Text>
            </View>

            {/* Score */}
            <View style={styles.scoreContainer}>
                <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>
                    Score
                </Text>
                <Text style={[styles.scoreValue, { color: theme.colors.primary }]}>
                    {score}
                </Text>
            </View>

            {/* Question */}
            {currentQuestion && (
                <Card style={styles.questionCard}>
                    <Text style={[styles.questionCategory, { color: theme.colors.primary }]}>
                        {currentQuestion.category}
                    </Text>
                    <Text style={[styles.questionText, { color: theme.colors.text }]}>
                        {currentQuestion.question}
                    </Text>

                    <View style={styles.answersContainer}>
                        {currentQuestion.answers.map((answer, index) => (
                            <Animated.View
                                key={index}
                                style={index === selectedAnswer ? feedbackAnimatedStyle : undefined}
                            >
                                <Button
                                    title={answer}
                                    onPress={() => handleSelectAnswer(index)}
                                    variant="outline"
                                    disabled={selectedAnswer !== null}
                                    style={[styles.answerButton, getAnswerStyle(index)]}
                                    textStyle={[
                                        styles.answerText,
                                        showResult && index === currentQuestion.correctAnswer && {
                                            color: theme.colors.success,
                                        },
                                        showResult &&
                                        index === selectedAnswer &&
                                        index !== currentQuestion.correctAnswer && {
                                            color: theme.colors.error,
                                        },
                                    ]}
                                />
                            </Animated.View>
                        ))}
                    </View>
                </Card>
            )}
        </Animated.View>
    );

    const renderFinishedState = () => (
        <Animated.View entering={FadeInDown.duration(400)}>
            <Card style={styles.resultsCard}>
                <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>
                    Quiz Complete!
                </Text>

                <View style={styles.finalScoreContainer}>
                    <Text style={[styles.finalScoreLabel, { color: theme.colors.textSecondary }]}>
                        Your Score
                    </Text>
                    <Text style={[styles.finalScoreValue, { color: theme.colors.primary }]}>
                        {score} / {QUESTIONS_PER_GAME}
                    </Text>
                    <Text style={[styles.finalScorePercent, { color: theme.colors.textSecondary }]}>
                        {Math.round((score / QUESTIONS_PER_GAME) * 100)}%
                    </Text>
                </View>

                {score > quizStats.highScore - 1 && score === quizStats.highScore && (
                    <View style={styles.newHighScoreBadge}>
                        <Text style={styles.newHighScoreText}>New High Score!</Text>
                    </View>
                )}

                <Text style={[styles.resultsNote, { color: theme.colors.textTertiary }]}>
                    This was just for fun - no real rewards earned.
                </Text>
            </Card>

            <View style={styles.finishedActions}>
                <Button
                    title="Play Again"
                    onPress={startGame}
                    variant="primary"
                    style={styles.playAgainButton}
                />
                <Button
                    title="Back to Fun Zone"
                    onPress={() => setGameState('idle')}
                    variant="outline"
                    style={styles.backButton}
                />
            </View>
        </Animated.View>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <DisclaimerBanner
                text="Quiz is for entertainment only. No real prizes."
                variant="info"
                style={styles.disclaimer}
            />

            {gameState === 'idle' && renderIdleState()}
            {gameState === 'playing' && renderPlayingState()}
            {gameState === 'finished' && renderFinishedState()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    disclaimer: {
        marginBottom: 16,
    },
    statsCard: {
        padding: 20,
        marginBottom: 16,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 36,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    infoCard: {
        padding: 20,
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 12,
    },
    infoNote: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    startButton: {
        marginTop: 8,
    },
    playingContainer: {
        flex: 1,
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    scoreLabel: {
        fontSize: 14,
    },
    scoreValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    questionCard: {
        padding: 20,
    },
    questionCategory: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 26,
        marginBottom: 24,
    },
    answersContainer: {
        gap: 12,
    },
    answerButton: {
        justifyContent: 'flex-start',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderWidth: 2,
    },
    answerText: {
        fontSize: 15,
        textAlign: 'left',
    },
    resultsCard: {
        padding: 24,
        alignItems: 'center',
    },
    resultsTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 24,
    },
    finalScoreContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    finalScoreLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    finalScoreValue: {
        fontSize: 48,
        fontWeight: '800',
    },
    finalScorePercent: {
        fontSize: 16,
        marginTop: 4,
    },
    newHighScoreBadge: {
        backgroundColor: '#EAB308',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
    },
    newHighScoreText: {
        color: '#000000',
        fontWeight: '700',
        fontSize: 14,
    },
    resultsNote: {
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    finishedActions: {
        marginTop: 24,
        gap: 12,
    },
    playAgainButton: {},
    backButton: {},
});