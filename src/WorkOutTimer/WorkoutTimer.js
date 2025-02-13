import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const WorkOutTimer = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [getText, setGetText] = useState('');

    const handleText = (text) => {
        setGetText(text)
    };

    const getCategories = async () => {
        try {
            const storedList = await AsyncStorage.getItem("category");
            if (storedList) {
                const parsedList = JSON.parse(storedList);
                setCategoryList(parsedList);
            }
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const createTimer = async (text) => {
        const categoryID = Date.now();
        const categories = {
            id: categoryID,
            category: text
        };

        const lists = [...categoryList, categories];
        try {
            await AsyncStorage.setItem('category', JSON.stringify(lists));
            setCategoryList(lists);
            setGetText('');
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const renderCategoryList = ({ item }) => {
        return (
            <Text>{item.category}</Text>
        );
    };
    return (
        <View style={styles.timerContainer}>
            <TextInput
                placeholder="Add Timer name"
                onChangeText={(text) => handleText(text)}
                style={styles.placeholderContainer}
                placeholderTextColor={'black'}
                value={getText}
            />

            <FlatList data={categoryList} keyExtractor={item => item.id.toString()} renderItem={renderCategoryList} />
            <Pressable style={styles.buttonContainer} onPress={() => createTimer(getText)}>
                <Text style={styles.createTimerText}>Create Timer</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    timerContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 20,
        gap: 20
    },
    buttonContainer: {
        height: 50,
        width: '50%',
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "orange",
        borderRadius: 14
    },
    createTimerText: {
        color: 'white',
        fontSize: 16
    },
    placeholderContainer: {
        width: 250,
        backgroundColor: 'aliceblue',
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        color: "black"
    }
})
export default WorkOutTimer;