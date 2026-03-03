
import { FlatList, Pressable, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { Button, TextInput } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useEffect, useState } from 'react';
import { Button, Menu, Modal, Portal, TextInput } from 'react-native-paper';
import { api } from '../client/api.js'


const Item = ({ expense, index, menuVisible, onOpenMenu, onCloseMenu, onEdit, onDelete }) => (
    <Menu
        visible={menuVisible}
        onDismiss={onCloseMenu}
        anchor={(
            <Pressable style={style.item} onPress={() => onOpenMenu(index)}>
                <Text>{expense.title}</Text>
            </Pressable>
        )}
        contentStyle={{borderRadius:10}}
    >
        <Menu.Item
            onPress={() => {
                onCloseMenu()
                onEdit(expense, index)
            }}
            title='Edit'
        />
        <Menu.Item
            onPress={() => {
                onCloseMenu()
                onDelete(expense)
            }}
            title='Delete'
        />
    </Menu>
);

const Expenses = ({ expenses, onEdit, onDelete }) => {
    const [selectedIndex, setSelectedIndex] = useState(null)

    return (
        <SafeAreaView style={style.wrapper}>
            <FlatList
                data={expenses}
                renderItem={({ item, index }) => (
                    <Item
                        expense={item}
                        index={index}
                        menuVisible={selectedIndex === index}
                        onOpenMenu={setSelectedIndex}
                        onCloseMenu={() => setSelectedIndex(null)}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )}
                keyExtractor={(_, index) => index.toString()}
                style={{ width: '100%' }}
            />
        </SafeAreaView>
    )
}

const FilterExpense = () => (
    <SafeAreaView style={style.wrapper}>
        <Text>dasdas</Text>
    </SafeAreaView>
)
const Tab = createBottomTabNavigator()
export default function ExpenseDash() {
    const [allExpenses, setAllExpenses] = useState([])
    const [expenses, setExpenses] = useState([])
    const [filterVisible, setFilterVisible] = useState(false)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [editVisible, setEditVisible] = useState(false)
    const [editingIndex, setEditingIndex] = useState(null)
    const [editTitle, setEditTitle] = useState('')
    const [editAmount, setEditAmount] = useState('')
    const [editDate, setEditDate] = useState(null)
    const [pickerVisible, setPickerVisible] = useState(false)
    const [pickerTarget, setPickerTarget] = useState(null)

    useEffect(() => {
        const loadData = async () => {
            const res = await api.getExpenses()
            setAllExpenses(res.data)
            setExpenses(res.data)
            console.log(res.data);
            
        }
        loadData()

    }, [])

    const getExpenseDate = (expense) => expense?.date || expense?.createdAt || expense?.expenseDate

    const toDateOnly = (value) => {
        const parsed = new Date(value)
        if (Number.isNaN(parsed.getTime())) return null
        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
    }

    const formatDate = (value) => {
        const parsed = toDateOnly(value)
        if (!parsed) return ''
        const year = parsed.getFullYear()
        const month = String(parsed.getMonth() + 1).padStart(2, '0')
        const day = String(parsed.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const openDatePicker = (target) => {
        setPickerTarget(target)
        setPickerVisible(true)
    }

    const getPickerValue = () => {
        if (pickerTarget === 'filterStart' && startDate) return startDate
        if (pickerTarget === 'filterEnd' && endDate) return endDate
        if (pickerTarget === 'editDate' && editDate) return editDate
        return new Date()
    }

    const onChangePickerDate = (_, selectedDate) => {
        setPickerVisible(false)
        if (!selectedDate) return
        const picked = toDateOnly(selectedDate)
        if (!picked) return

        if (pickerTarget === 'filterStart') setStartDate(picked)
        else if (pickerTarget === 'filterEnd') setEndDate(picked)
        else if (pickerTarget === 'editDate') setEditDate(picked)
    }

    const applyDateFilter = () => {
        const parsedStart = startDate ? toDateOnly(startDate) : null
        const parsedEnd = endDate ? toDateOnly(endDate) : null

        const filtered = allExpenses.filter((expense) => {
            const expenseDate = toDateOnly(getExpenseDate(expense))
            if (!expenseDate) return false
            if (parsedStart && expenseDate < parsedStart) return false
            if (parsedEnd && expenseDate > parsedEnd) return false
            return true
        })

        setExpenses(filtered)
        setFilterVisible(false)
    }

    const clearDateFilter = () => {
        setStartDate(null)
        setEndDate(null)
        setExpenses(allExpenses)
        setFilterVisible(false)
    }

    const onDeleteExpense = (expense) => {
        console.log('Delete expense:', expense)
    }

    const onEditExpense = (expense, index) => {
        setEditingIndex(index)
        setEditTitle(expense?.title ? String(expense.title) : '')
        setEditAmount(expense?.amount !== undefined && expense?.amount !== null ? String(expense.amount) : '')
        setEditDate(toDateOnly(getExpenseDate(expense)))
        setEditVisible(true)
    }

    const saveEditedExpense = () => {
        if (editingIndex === null) {
            setEditVisible(false)
            return
        }

        const current = expenses[editingIndex]
        if (!current) {
            setEditVisible(false)
            setEditingIndex(null)
            return
        }

        const updatedExpense = {
            ...current,
            title: editTitle,
            amount: editAmount,
            date: editDate ? formatDate(editDate) : current.date,
        }

        const nextExpenses = expenses.map((item, idx) => idx === editingIndex ? updatedExpense : item)
        setExpenses(nextExpenses)

        const allMatchIndex = allExpenses.findIndex((item) =>
            (item?.id !== undefined && current?.id !== undefined && item.id === current.id)
            || (item?._id && current?._id && item._id === current._id)
        )
        if (allMatchIndex >= 0) {
            setAllExpenses(allExpenses.map((item, idx) => idx === allMatchIndex ? updatedExpense : item))
        } else {
            setAllExpenses(nextExpenses)
        }

        setEditVisible(false)
        setEditingIndex(null)
    }

    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    // eslint-disable-next-line react/no-unstable-nested-components
                    tabBarIcon: ({ color, size }) => {
                        let iconName

                        if (route.name === 'Expense List') iconName = 'list'
                        else if (route.name === 'filterExpense') iconName = 'filter-list'
                        else iconName = 'help-outline'

                        return <MaterialIcons name={iconName} size={size} color={color} />
                    },
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: 'darkgrey',
                })}
            >
                <Tab.Screen name='Expense List'>
                    {(props)=>(
                        <Expenses
                            {...props}
                            expenses={expenses}
                            onEdit={onEditExpense}
                            onDelete={onDeleteExpense}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen
                    name='filterExpense'
                    component={FilterExpense}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault()
                            setFilterVisible(true)
                        },
                    }}
                />
            </Tab.Navigator>

            <Portal>
                <Modal
                    visible={filterVisible}
                    onDismiss={() => setFilterVisible(false)}
                    contentContainerStyle={style.filterSheet}
                >
                    <Text style={style.filterTitle}>Filter Expenses</Text>
                    <Pressable style={style.dateField} onPress={() => openDatePicker('filterStart')}>
                        <Text style={style.dateLabel}>Start Date</Text>
                        <Text style={style.dateValue}>{startDate ? formatDate(startDate) : 'Select start date'}</Text>
                    </Pressable>
                    <Pressable style={style.dateField} onPress={() => openDatePicker('filterEnd')}>
                        <Text style={style.dateLabel}>End Date</Text>
                        <Text style={style.dateValue}>{endDate ? formatDate(endDate) : 'Select end date'}</Text>
                    </Pressable>
                    <Button mode='contained' onPress={applyDateFilter} style={style.filterButton}>
                        Apply
                    </Button>
                    <Button mode='outlined' onPress={clearDateFilter} style={style.filterButton}>
                        Clear
                    </Button>
                </Modal>
            </Portal>

            <Portal>
                <Modal
                    visible={editVisible}
                    onDismiss={() => setEditVisible(false)}
                    contentContainerStyle={style.filterSheet}
                >
                    <Text style={style.filterTitle}>Edit Expense</Text>
                    <TextInput
                        label='Title'
                        value={editTitle}
                        onChangeText={setEditTitle}
                        mode='outlined'
                        style={style.filterInput}
                    />
                    <TextInput
                        label='Amount'
                        value={editAmount}
                        onChangeText={setEditAmount}
                        mode='outlined'
                        keyboardType='numeric'
                        style={style.filterInput}
                    />
                    <Pressable style={style.dateField} onPress={() => openDatePicker('editDate')}>
                        <Text style={style.dateLabel}>Expense Date</Text>
                        <Text style={style.dateValue}>{editDate ? formatDate(editDate) : 'Select expense date'}</Text>
                    </Pressable>
                    <Button mode='contained' onPress={saveEditedExpense} style={style.filterButton}>
                        Save
                    </Button>
                    <Button mode='outlined' onPress={() => setEditVisible(false)} style={style.filterButton}>
                        Cancel
                    </Button>
                </Modal>
            </Portal>
            {pickerVisible && (
                <DateTimePicker
                    value={getPickerValue()}
                    mode='date'
                    onChange={onChangePickerDate}
                />
            )}
        </>
    )
}

const style = StyleSheet.create({
    wrapper: {
        flex:1,
        // width:'100%',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'grey',
        padding: 10,
        alignItems:'center'
        
    },
    item: {
        width:'90%',
        backgroundColor: '#7a7c80',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        alignSelf:'stretch',
        // borderStyle: 'solid',
        // borderWidth: 2,
        // borderColor: 'red',
        borderRadius:15
        
    },
    filterSheet: {
        backgroundColor: 'white',
        marginTop: 'auto',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    filterInput: {
        marginBottom: 12,
    },
    filterButton: {
        marginTop: 6,
    },
    dateField: {
        borderWidth: 1,
        borderColor: '#b8b8b8',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 16,
        color: '#1d1d1d',
    },
})
