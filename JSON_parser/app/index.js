import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import Reader from '../Reader/Reader';

const Home = () => {

    const CustomHeader = () => (
        <View style={{ height: 30, backgroundColor: 'white' }}>
        </View>
    );

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    header: () => <CustomHeader />, // Use the custom header component
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}>
                <View>
                    <Reader />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home;