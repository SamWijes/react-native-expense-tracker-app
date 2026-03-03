import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropdownPopover from './DropdownPopover';

export default function ExpenseRow({ expense, onEdit, onDelete }) {
  const anchorRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState(null);

  const openMenu = () => {
    if (!anchorRef.current) {
      return;
    }

    anchorRef.current.measureInWindow((x, y, width, height) => {
      setAnchorLayout({ x, y, width, height });
      setMenuVisible(true);
    });
  };

  return (
    <>
      <View style={styles.item}>
        <Text style={styles.title}>{expense?.title ?? 'Untitled expense'}</Text>
        <TouchableOpacity
          ref={anchorRef}
          onPress={openMenu}
          style={styles.menuButton}
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          <Text style={styles.menuButtonText}>...</Text>
        </TouchableOpacity>
      </View>

      <DropdownPopover
        visible={menuVisible}
        anchorLayout={anchorLayout}
        onClose={() => setMenuVisible(false)}
        items={[
          {
            key: 'edit',
            label: 'Edit',
            onPress: () => onEdit?.(expense),
          },
          {
            key: 'delete',
            label: 'Delete',
            color: '#d92d20',
            onPress: () => onDelete?.(expense),
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7a7c80',
    padding: 12,
    marginVertical: 8,
    alignSelf: 'center',
    borderRadius: 15,
  },
  title: {
    flex: 1,
    color: '#fff',
  },
  menuButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
    marginTop: -2,
  },
});
