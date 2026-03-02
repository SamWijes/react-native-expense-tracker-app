
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, TextInput } from 'react-native-paper';



export default function Login({ navigation }) {

    return (
        <SafeAreaView >
            <View style={style.formWrapper} >
                <Text style={style.loginText} >Expense Tracker {"\n Register"}</Text>
                <TextInput style={style.input} mode='outlined' textContentType='name'
                    placeholder='jhonDoe' label={"Name"}
                />
                <TextInput style={style.input} mode='outlined' textContentType='name'
                    placeholder='jhonDoe@gamil.com' label={"Email"}
                />
                <TextInput style={style.input} mode='outlined' textContentType='password' label={"Password"} secureTextEntry={true} />
                <Button mode='contained' buttonColor='black' style={style.btn}>Register</Button>
                <View style={{ flexDirection: 'row', marginTop: 20 ,justifyContent:'center'}}>
                    <Text style={style.regStat}>Already Have an Account ?
                       
                    </Text>
                    <View style={{ borderBottomWidth: 1, borderStyle: 'dotted',alignSelf:'baseline' }}>
                            <Text
                                onPress={() => navigation.navigate('login')}>Login Now</Text>
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
        fontWeight:'bold'
    },

    input: {
        fontSize: 15,
        marginBottom: 12,
        width:'80%',
        margin:'auto'
    },
    btn: {
        width: '50%',
        marginHorizontal: 'auto',
        marginVertical: 35

    },


    regStat: {
        textAlign: 'center',
        paddingBottom:10

    }




})