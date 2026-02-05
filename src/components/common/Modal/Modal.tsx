// src/components/common/Modal/Modal.tsx

import React, { ReactNode } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal as RNModal,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';
import { Icon } from '../Icon';
import { Button } from '../Button';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    showCloseButton?: boolean;
    primaryAction?: {
        title: string;
        onPress: () => void;
        loading?: boolean;
    };
    secondaryAction?: {
        title: string;
        onPress: () => void;
    };
}

export const Modal: React.FC<ModalProps> = ({
                                                visible,
                                                onClose,
                                                title,
                                                children,
                                                showCloseButton = true,
                                                primaryAction,
                                                secondaryAction,
                                            }) => {
    const { theme } = useTheme();

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <Pressable style={styles.overlay} onPress={onClose}>
                    <Animated.View
                        entering={SlideInDown.duration(300).springify()}
                        style={styles.contentWrapper}
                    >
                        <Pressable
                            style={[
                                styles.content,
                                { backgroundColor: theme.colors.surface },
                            ]}
                            onPress={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            {(title || showCloseButton) && (
                                <View style={styles.header}>
                                    {title && (
                                        <Text style={[styles.title, { color: theme.colors.text }]}>
                                            {title}
                                        </Text>
                                    )}
                                    {showCloseButton && (
                                        <Pressable onPress={onClose} style={styles.closeButton}>
                                            <Icon name="x" size={24} color={theme.colors.textSecondary} />
                                        </Pressable>
                                    )}
                                </View>
                            )}

                            {/* Body */}
                            <ScrollView
                                style={styles.body}
                                showsVerticalScrollIndicator={false}
                            >
                                {children}
                            </ScrollView>

                            {/* Footer */}
                            {(primaryAction || secondaryAction) && (
                                <View style={styles.footer}>
                                    {secondaryAction && (
                                        <Button
                                            title={secondaryAction.title}
                                            onPress={secondaryAction.onPress}
                                            variant="outline"
                                            style={styles.footerButton}
                                        />
                                    )}
                                    {primaryAction && (
                                        <Button
                                            title={primaryAction.title}
                                            onPress={primaryAction.onPress}
                                            loading={primaryAction.loading}
                                            style={styles.footerButton}
                                        />
                                    )}
                                </View>
                            )}
                        </Pressable>
                    </Animated.View>
                </Pressable>
            </KeyboardAvoidingView>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 400,
    },
    content: {
        borderRadius: 20,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
    },
    closeButton: {
        padding: 4,
        marginLeft: 12,
    },
    body: {
        paddingHorizontal: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        padding: 20,
        paddingTop: 16,
    },
    footerButton: {
        minWidth: 100,
    },
});