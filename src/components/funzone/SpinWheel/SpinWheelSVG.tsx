// src/components/funzone/SpinWheel/SpinWheelSVG.tsx

import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path, Text as SvgText, Circle } from 'react-native-svg';

interface WheelSegment {
    value: number;
    label: string;
    color: string;
}

interface SpinWheelSVGProps {
    segments: WheelSegment[];
    size: number;
}

export const SpinWheelSVG: React.FC<SpinWheelSVGProps> = ({ segments, size }) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    const segmentAngle = 360 / segments.length;

    const polarToCartesian = (
        cx: number,
        cy: number,
        r: number,
        angleInDegrees: number
    ) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(angleInRadians),
            y: cy + r * Math.sin(angleInRadians),
        };
    };

    const createArcPath = (startAngle: number, endAngle: number) => {
        const start = polarToCartesian(centerX, centerY, radius, endAngle);
        const end = polarToCartesian(centerX, centerY, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

        return [
            `M ${centerX} ${centerY}`,
            `L ${start.x} ${start.y}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
            'Z',
        ].join(' ');
    };

    const getLabelPosition = (index: number) => {
        const angle = index * segmentAngle + segmentAngle / 2;
        const labelRadius = radius * 0.65;
        return polarToCartesian(centerX, centerY, labelRadius, angle);
    };

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Outer ring */}
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={radius + 5}
                    fill="none"
                    stroke="#1F2937"
                    strokeWidth={10}
                />

                {/* Segments */}
                <G>
                    {segments.map((segment, index) => {
                        const startAngle = index * segmentAngle;
                        const endAngle = startAngle + segmentAngle;
                        const path = createArcPath(startAngle, endAngle);
                        const labelPos = getLabelPosition(index);
                        const rotation = index * segmentAngle + segmentAngle / 2;

                        return (
                            <G key={`segment-${index}`}>
                                <Path
                                    d={path}
                                    fill={segment.color}
                                    stroke="#1F2937"
                                    strokeWidth={2}
                                />
                                <SvgText
                                    x={labelPos.x}
                                    y={labelPos.y}
                                    fill="#FFFFFF"
                                    fontSize={16}
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    transform={`rotate(${rotation}, ${labelPos.x}, ${labelPos.y})`}
                                >
                                    {segment.label}
                                </SvgText>
                            </G>
                        );
                    })}
                </G>

                {/* Center circle */}
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={25}
                    fill="#1F2937"
                    stroke="#374151"
                    strokeWidth={3}
                />
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={15}
                    fill="#6366F1"
                />
            </Svg>
        </View>
    );
};