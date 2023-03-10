import React, {useMemo, useState} from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {Dimensions, TouchableOpacity} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

import CheckBox from './CheckBox';
import TrashBin from './TrashBin';
import EditButton from './EditButton';
import {getColorScheme, getSelectedItem} from '../../utils/tools';
import {useAppContext, TaskData} from '../../utils/context';
import {updater} from '../../utils/firestoreUpdater';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const LIST_ITEM_HIGHT = 40;
const MARGIN = 10;
const THRESHOLD = -SCREEN_WIDTH * 0.1;

const TaskCard = ({task}: {task: TaskData}) => {
  let {userData} = useAppContext();
  const [isOver, setIsOver] = useState(false);

  const opacity =
    task.isDone === true ? useSharedValue(0.7) : useSharedValue(1);
  const translateX = useSharedValue(1);

  const itemHeight = useSharedValue(LIST_ITEM_HIGHT);
  const marginY = useSharedValue(10);

  const {textColor} = getColorScheme().colors;

  const AnimatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const rTaskContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginY.value,
      opacity: opacity.value,
      transform: [{translateX: translateX.value}],
    };
  });

  const check = async () => {
    if (!task.id) return;

    ReactNativeHapticFeedback.trigger('impactLight', options);
    opacity.value = withDelay(500, withTiming(task.isDone === false ? 0.7 : 1));

    updater({id: task.id, key: 'toggleIsDone', isDone: task.isDone});
  };

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .failOffsetY([-5, 5])
        .activeOffsetX([-5, 5])
        .onUpdate(event => {
          const isRightSwipe = event.translationX > -1;
          if (isRightSwipe) return;

          translateX.value = event.translationX;
          const shouldBeIsOver = translateX.value < THRESHOLD && !isOver;
          if (shouldBeIsOver) {
            runOnJS(setIsOver)(true);
          }
        })
        .onEnd(() => {
          const shouldBeDismissed = translateX.value < THRESHOLD;
          if (shouldBeDismissed && task.id) {
            translateX.value = withTiming(-SCREEN_WIDTH / 2, {duration: 500});
            itemHeight.value = withDelay(500, withTiming(0));
            opacity.value = withDelay(500, withTiming(0));
            marginY.value = withDelay(
              500,
              withTiming(0, undefined, isFinished => {
                if (isFinished) {
                  runOnJS(updater)({key: 'delete', id: task.id});
                }
              }),
            );
          } else {
            translateX.value = withSpring(0);
            runOnJS(setIsOver)(false);
          }
        }),
    [],
  );

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: LIST_ITEM_HIGHT,
            },
            rTaskContainerStyle,
          ]}>
          <TouchableOpacity onPress={() => check()} testID="pressableCheckBox">
            <CheckBox
              isChecked={task.isDone}
              boxFillColor={getSelectedItem(userData.color)}
              strokeColor="#f2fcfe"
              width={LIST_ITEM_HIGHT - MARGIN}
              height={LIST_ITEM_HIGHT - MARGIN}
              margin={1}
            />
          </TouchableOpacity>

          <Animated.Text
            style={[
              {
                fontSize: 25,
                width: SCREEN_WIDTH * 0.8,
                padding: 0,
                marginHorizontal: 5,
                color: textColor,
              },
              AnimatedOpacity,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {task.isEditMode ? 'Editing...' : task.title}
          </Animated.Text>
        </Animated.View>
      </GestureDetector>
      {isOver ? <TrashBin /> : <EditButton task={task} />}
    </>
  );
};

export default TaskCard;
