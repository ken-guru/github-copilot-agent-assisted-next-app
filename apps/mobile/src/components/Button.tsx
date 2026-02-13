import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  size = 'medium',
}) => {
  const { colors } = useTheme();

  const backgroundColor = {
    primary: colors.primary,
    danger: colors.danger,
    secondary: colors.card,
  }[variant];

  const textColor = variant === 'secondary' ? colors.text : '#ffffff';

  const sizeStyles = {
    small: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, minHeight: 36 },
    medium: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, minHeight: 44 },
    large: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl, minHeight: 52 },
  }[size];

  const textSize = {
    small: 14,
    medium: 16,
    large: 18,
  }[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles,
        {
          backgroundColor,
          opacity: disabled ? 0.5 : 1,
          borderColor: variant === 'secondary' ? colors.border : backgroundColor,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor, fontSize: textSize }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  text: {
    fontWeight: '600',
  },
});
