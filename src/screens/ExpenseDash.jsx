
import {  StyleSheet, Text  } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { Button, TextInput } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useEffect, useState } from 'react';
import { api } from '../client/api.js'



import Expenses from '../components/Expenses.jsx';

const DeleteExpense = () => (
    <SafeAreaView style={style.wrapper}>
        <Text>dasdas</Text>
    </SafeAreaView>
)

const EditExpense = () => (
    <SafeAreaView style={style.wrapper}>
        <Text>dasdas</Text>
    </SafeAreaView>
)
const Tab = createBottomTabNavigator()
export default function ExpenseDash({ navigation }) {
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        const loadData = async () => {
            const res = await api.getExpenses()
            setExpenses(res.data)
            console.log(res.data);

        }
        loadData()

    }, [])

    return (

        <Tab.Navigator

            screenOptions={({ route }) => ({
                // eslint-disable-next-line react/no-unstable-nested-components
                tabBarIcon: ({ color, size }) => {
                    let iconName

                    if (route.name === 'editExpense') iconName = 'edit'
                    else if (route.name === 'expList') iconName = 'list'
                    else if (route.name === 'filterExpense') iconName = 'filter-list'
                    else iconName = 'help-outline'

                    return <MaterialIcons name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'darkgrey',
            })}
        >
            <Tab.Screen name='editExpense' component={EditExpense} />
            <Tab.Screen name='Expense List'>
                {(props) => <Expenses {...props} expenses={expenses} />}
            </Tab.Screen>
            <Tab.Screen name='filterExpense' component={DeleteExpense} />
        </Tab.Navigator>


    )
}

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
        // width:'100%',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'grey',
        padding: 10,
        alignItems: 'center'

    },
    item: {
        width: '90%',
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#7a7c80',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        alignSelf: 'stretch',
        // borderStyle: 'solid',
        // borderWidth: 2,
        // borderColor: 'red',
        borderRadius: 15

    },
})
