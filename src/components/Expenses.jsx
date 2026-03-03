import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExpenseRow from './ExpenseRow';

export default function Expenses({ expenses = [] }) {
  const handleEdit = (expense) => {
    console.log('Edit', expense);
  };

  const handleDelete = (expense) => {
    console.log('Delete', expense);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <FlatList
        data={expenses}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <ExpenseRow
            expense={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 10,
  },
});
