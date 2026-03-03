import React, { forwardRef, useMemo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

export const ExpenseActionsSheet = forwardRef(
  ({ onEdit, onDelete }, ref) => {
    const snapPoints = useMemo(() => ['25%'], []);

    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Expense Options</Text>

          <Pressable style={styles.action} onPress={onEdit}>
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>

          <Pressable style={[styles.action, styles.destructive]} onPress={onDelete}>
            <Text style={[styles.actionText, styles.destructiveText]}>Delete</Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  sheetContent: { padding: 16 },
  sheetTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  action: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionText: { fontSize: 16 },
  destructive: { marginTop: 6 },
  destructiveText: { color: 'red' },
});