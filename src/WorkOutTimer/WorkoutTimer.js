import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { categoryType } from "../data";

const WorkOutTimer = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [getText, setCategoryText] = useState('');
    const [timer, setTimer] = useState(null);
    const [isDropDown, setIsOpenDropDown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const getCategories = async () => {
        try {
            const storedList = await AsyncStorage.getItem("category");
            if (storedList) {
                const parsedList = JSON.parse(storedList);
                console.log('parsedList', parsedList);

                setCategoryList(parsedList);
            }
        } catch (error) {
            console.error("Error loading categories:", error);
        };
    };

    useEffect(() => {
        getCategories();
    }, []);

    const createTimer = async (text, timer) => {
        const categoryID = Date.now();
        const categories = {
            id: categoryID,
            category: text,
            categoryType: selectedCategory,
            time: timer
        };

        const lists = [...categoryList, categories];
        try {
            await AsyncStorage.setItem('category', JSON.stringify(lists));
            setCategoryList(lists);
            setCategoryText('');
            setTimer('');
            setSelectedCategory('');
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    // const clesrTimet = async () => {
    //     try {
    //         await AsyncStorage.clear()
    //     } catch (error) {

    //     }
    // }

    const renderCategoryList = ({ item }) => {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.categoryType}</Text>
                    </View>
                    <Text style={styles.timeText}>Time: {item.time}</Text>
                </View>
                <Text style={styles.categoryTypeText}>{item.category}</Text>
            </View>
        );
    };

    const selectCategory = (type) => {
        setSelectedCategory(type);
        setIsOpenDropDown(!isDropDown);
    }

    const renderCategoryTypes = ({ item }) => {
        const SELECT_TYPE = item.type;
        return (
            <Pressable style={styles.selectCategory} onPress={() => selectCategory(SELECT_TYPE)}>
                <Text style={styles.categoryTypes}>{SELECT_TYPE}</Text>
            </Pressable>
        )
    }

    const openDropDown = () => {
        setIsOpenDropDown(!isDropDown)
    }
    return (
        <>
            <View style={styles.timerContainer}>
                <View style={styles.fieldContainer}>
                    <TextInput
                        placeholder="Add Timer name"
                        onChangeText={(text) => setCategoryText(text)}
                        style={styles.placeholderContainer}
                        placeholderTextColor={'black'}
                        value={getText}
                    />
                    <TextInput
                        placeholder="Select Time(sec)"
                        onChangeText={(text) => setTimer(text)}
                        style={styles.selectTimeContainer}
                        placeholderTextColor={'black'}
                        value={timer}
                        keyboardType="numeric"
                    // numberOfLines={1}
                    />
                    <Pressable onPress={openDropDown} style={styles.selectType}>
                        <Text>{selectedCategory || 'Select Type'}</Text>
                        {
                            isDropDown &&
                            <View style={{ position: "absolute", marginTop: 180, alignItems: 'center', backgroundColor: "white", width: '100%' }}>
                                <FlatList data={categoryType} renderItem={renderCategoryTypes} keyExtractor={item => item.id.toString()} contentContainerStyle={{ gap: 5 }} />
                            </View>
                        }
                    </Pressable>
                </View>
                <FlatList data={categoryList} keyExtractor={item => item.id.toString()} renderItem={renderCategoryList} />

                <Pressable style={styles.buttonContainer} onPress={() => createTimer(getText, timer)}>
                    <Text style={styles.createTimerText}>Create Timer</Text>
                </Pressable>
            </View>
        </>

    );
};

const styles = StyleSheet.create({
    timerContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    buttonContainer: {
        height: 50,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "orange",
        borderRadius: 14,
        marginHorizontal: 20
    },
    createTimerText: {
        color: 'white',
        fontSize: 16
    },
    placeholderContainer: {
        width: '100%',
        // backgroundColor: 'aliceblue',
        borderWidth: 0.5,
        borderColor: "gray",
        borderRadius: 10,
        color: "black",
        height: 60,
        paddingHorizontal: 14
    },
    selectTimeContainer: {
        width: '100%',
        // backgroundColor: 'aliceblue',
        borderWidth: 0.5,
        borderColor: "gray",
        borderRadius: 10,
        color: "black",
        height: 60,
        paddingHorizontal: 14
    },
    fieldContainer: {
        // flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        width: '100%',
        paddingHorizontal: 20,
        height: 300,
        // backgroundColor:'red'
    },
    categoryTypes: {
        height: 30,
        width: 80,
        textAlign: 'center'
    },
    selectCategory: {
    },
    selectType: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: "gray",
        borderRadius: 10,
        color: "black",
        height: 60,
        justifyContent: 'center',
        paddingHorizontal: 14
    },
    categoryList: {

    },
    container: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        // width: '100%'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryBadge: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    categoryText: {
        color: '#333333',
        fontWeight: 'bold',
        fontSize: 14,
    },
    timeText: {
        color: '#666666',
        fontSize: 14,
    },
    categoryTypeText: {
        color: '#333333',
        fontSize: 16,
        marginTop: 4,
    },

})
export default WorkOutTimer;