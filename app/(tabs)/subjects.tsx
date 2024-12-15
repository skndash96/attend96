import Icon from '@/components/Icon';
import AddSubjectModal from '@/components/subjects/AddSubjectModal';
import ReorderingSubject from '@/components/subjects/ReorderingSubject';
import SubjectComponent from '@/components/subjects/Subject';
import { getSubjects, orderSubjectsIdx, Subject } from '@/utils/subjects'
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist';

export default function Subjects() {
  const db = useSQLiteContext();
  const navigator = useNavigation();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [counter, setCounter] = useState(0);

  useLayoutEffect(() => {
    getSubjects(db)
      .then(s => setSubjects(s))
      .catch(e => console.log(e));
  }, [counter]);

  const handleLongPress = (id: number) => {
    if (selected.length == 0) {
      setSelected([id]);
    }
  };

  const handleClick = (id: number) => {
    if (selected.length > 0) {
      const idx = selected.indexOf(id);
      const newSelected = [...selected];
      if (idx !== -1) {
        newSelected.splice(idx, 1)
        setSelected(newSelected);
      } else {
        newSelected.push(id);
        setSelected(newSelected);
      }
    } else {
      // navigate to subject
    }
  };

  const handleClose = (added?: boolean) => {
    if (added) {
      getSubjects(db)
      .then(s => setSubjects(s))
      .catch(e => console.log(e));
    }

    setSelected([]);
    setEditing(null);
    setVisible(false);
  };

  useLayoutEffect(() => {
    const backPressHandler = () => {
      if (selected.length > 0) {
        setSelected([]);
        return true;
      }
      if (isReordering) {
        setIsReordering(false);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", backPressHandler);

    return () => BackHandler.removeEventListener("hardwareBackPress", backPressHandler);
  }, [selected]);

  useEffect(() => {
    if (selected.length > 0) {
      navigator.setOptions({
        headerTitle: () => null,
        headerLeft: () => (
          <Pressable android_ripple={{
            color: 'lightgray'
          }} onPress={() => setSelected([])}>
            <Icon name='arrow-back' size={20} />
          </Pressable>
        )
      });
    } else {
      navigator.setOptions({
        headerLeft: null,
        headerTitle: null
      });
    }
    navigator.setOptions({
      headerRight: () => (
        <View style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginRight: 5
        }}>
          {!isReordering && selected.length === 0 && (
            <Pressable android_ripple={{
              color: "lightgray"
            }} style={{
              padding: 10
            }} onPress={() => setVisible(true)}>
              <Icon name="add" color='royalblue' size={20} />
            </Pressable>
          )}
          {selected.length === 1 && (
            <Pressable android_ripple={{
              color: "lightgray"
            }} style={{
              padding: 10
            }} onPress={() => {
              const sub = subjects.find(s => s.id === selected[0]);
              if (!sub) return;

              setEditing(sub);
              setVisible(true);
            }}>
              <Icon name="pencil" color='royalblue' size={20} />
            </Pressable>
          )}
          {selected.length > 0 ? (
            <Pressable android_ripple={{
              color: "lightgray",
            }} style={{
              padding: 10
            }} onPress={() => {
              // delete subjects
            }}>
              <Text style={{ color: "red" }}>
                Delete
              </Text>
            </Pressable>
          ) : (
            <Pressable android_ripple={{
              color: "lightgray"
            }} style={{
              padding: 10
            }} onPress={() => setIsReordering(b => !b)}>
              {isReordering ? (
                <Text style={{
                  color: "royalblue"
                }}>Done</Text>
              ) : (
                <Icon name="grip-vertical" family='fa6' color='royalblue' size={20} />
              )}
            </Pressable>
          )}
        </View>
      )
    });
  }, [selected, isReordering]);

  const handleDragEnd = (data: Subject[]) => {
    orderSubjectsIdx(db, data)
      .then(() => {
        setCounter(c => c + 1);
      })
      .catch(e => console.log(e));
  };

  if (isReordering) {
    return (
      <View style={{
        flex: 1
      }}>
        <DraggableFlatList
          data={subjects}
          scrollEnabled={true}
          onDragEnd={({ data }) => handleDragEnd(data)}
          renderItem={({ item, isActive, drag }) => (
            <ReorderingSubject
              isActive={isActive}
              drag={drag}
              item={item}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  }

  return (
    <ScrollView style={{
      display: "flex",
      flexDirection: "column"
    }}>
      <AddSubjectModal
        editing={editing}
        visible={visible}
        onClose={handleClose}
      />

      {subjects.map(s => (
        <SubjectComponent
          isSelected={selected.includes(s.id)}
          handleClick={handleClick}
          handleLongPress={handleLongPress}
          key={s.id}
          data={s}
        />
      ))}
    </ScrollView>
  )
}
