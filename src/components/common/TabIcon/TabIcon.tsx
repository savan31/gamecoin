// src/components/common/TabIcon/TabIcon.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '../Icon';

interface TabIconProps {
    name: string;
    size: number;
    color: string;
}

export const TabIcon: React.FC<TabIconProps> = ({ name, size, color }) => {
    return (
        <View style={styles.container}>
            <Icon name={name} size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});