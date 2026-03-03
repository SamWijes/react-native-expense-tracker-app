
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, TextInput } from 'react-native-paper';
import { api, setToken } from '../client/api.js'
import { useState } from 'react';


export default function Login({ navigation }) {
    const [loginData, setLoginData] = useState({
        email: "samtest02@qwe.gk",
        password: "123"
    });
    // console.log(loginData);
    async function loginHandle() {
        try {
            const res = await api.login(loginData)
            await setToken(res.data.token);
            navigation.navigate('expenseDash')
        } catch (error) {
            console.log("Login error:", error);
        }
    }
    return (
        <SafeAreaView>
            <View style={style.formWrapper} >
                <Text style={style.loginText} >Expense Tracker {"\n Login"}</Text>
                <TextInput style={style.input} mode='outlined' textContentType='name'
                    placeholder='jhonDoe@gamil.com' label={"Email"} value={loginData.email}
                    onChangeText={(val) => setLoginData(prev => ({ ...prev, ['username']: val }))}

                />
                <TextInput style={style.input} mode='outlined' textContentType='password' label={"Password"}
                    secureTextEntry={true}  value={loginData.password}
                    onChangeText={(val) => setLoginData(prev => ({ ...prev, ['password']: val }))} />
                <Button mode='contained' buttonColor='black' style={style.btn}
                    onPress={loginHandle}
                >Login</Button>
                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                    <Text>Dont't Have an Account ? </Text>
                    <View style={{ borderBottomWidth: 1, borderStyle: 'dotted', alignSelf: 'baseline' }}>
                        <Text onPress={() => navigation.navigate('register')}>Register Now</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>

    )
}


const style = StyleSheet.create({
    formWrapper: {
        padding: 20,
    },

    loginText: {
        textAlign: 'center',
        marginVertical: 40,
        fontSize: 25,
        fontWeight: 'bold'
    },
    input: {
        fontSize: 15,
        marginBottom: 12,
        width: '80%',
        margin: 'auto'
    },
    btn: {
        width: '50%',
        marginHorizontal: 'auto',
        marginVertical: 35

    }
})