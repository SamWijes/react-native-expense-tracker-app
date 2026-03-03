import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export default function DropdownPopover({
  visible,
  anchorLayout,
  items,
  onClose,
  width = 190,
}) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);

  const menuHeight = useMemo(() => 16 + items.length * 48, [items.length]);

  const position = useMemo(() => {
    if (!anchorLayout) {
      return { left: 12, top: 12 };
    }

    const margin = 12;
    const gap = 8;
    const left = Math.min(
      Math.max(anchorLayout.x + anchorLayout.width - width, margin),
      screenWidth - width - margin
    );

    const below = anchorLayout.y + anchorLayout.height + gap;
    const top =
      below + menuHeight <= screenHeight - margin
        ? below
        : Math.max(margin, anchorLayout.y - menuHeight - gap);

    return { left, top };
  }, [anchorLayout, menuHeight, screenHeight, screenWidth, width]);

  const finishClose = useCallback(
    (afterCloseCallback) => {
      setMounted(false);
      onClose?.();
      afterCloseCallback?.();
    },
    [onClose]
  );

  const closeWithAnimation = useCallback(
    (afterCloseCallback) => {
      progress.value = withTiming(0, { duration: 120 }, (finished) => {
        if (finished) {
          runOnJS(finishClose)(afterCloseCallback);
        }
      });
    },
    [finishClose, progress]
  );

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = 0;
      progress.value = withSpring(1, {
        damping: 16,
        stiffness: 300,
        mass: 0.75,
      });
      return;
    }

    if (mounted) {
      closeWithAnimation();
    }
  }, [closeWithAnimation, mounted, progress, visible]);

  const menuStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [-8, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.93, 1]) },
    ],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }));

  const outsideTap = Gesture.Tap().onEnd(() => {
    runOnJS(closeWithAnimation)();
  });

  if (!mounted || !anchorLayout) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={() => closeWithAnimation()}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <GestureDetector gesture={outsideTap}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </GestureDetector>

        <Animated.View
          style={[
            styles.menu,
            { width, left: position.left, top: position.top },
            menuStyle,
          ]}
        >
          {items.map((item) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
              onPress={() => closeWithAnimation(item.onPress)}
            >
              <View style={styles.itemRow}>
                {item.icon ? <View style={styles.icon}>{item.icon}</View> : null}
                <Text style={[styles.itemText, item.color ? { color: item.color } : null]}>
                  {item.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 16, 24, 0.12)',
  },
  menu: {
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 12,
  },
  item: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  itemPressed: {
    backgroundColor: '#f3f5f8',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    marginRight: 10,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#1a1f28',
    fontWeight: '500',
  },
});
