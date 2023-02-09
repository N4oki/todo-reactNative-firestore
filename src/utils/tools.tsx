import {taskData} from './context';
import {useColorScheme} from 'react-native';

export const getSelectedItem = (
  data: {
    item: string;
    isChecked: boolean;
  }[],
): string => {
  const selectedColor = data.find(item => item.isChecked)?.item;
  if (selectedColor) {
    return selectedColor;
  }
  return data[0].item;
};

export const sortTaskArray = (array: taskData[]) => {
  const done = array.filter(item => item.isDone === true);
  const unDone = array.filter(item => item.isDone === false);

  const sortedArray = unDone.concat(done);
  return sortedArray;
};

export const getPercentage = (array: taskData[]): number => {
  const checkedTasks = array.filter(task => {
    if (task.isDone) return true;
    return false;
  }).length;

  const totalTasks = array.length;
  const percentage = checkedTasks / totalTasks;

  return percentage || 0;
};

export const getColorScheme = () => {
  const colorScheme = useColorScheme();

  let keyboardBg = colorScheme === 'dark' ? '#363636' : '#D0D4DA';
  let inputBg = colorScheme === 'dark' ? '#949696' : '#F1F5F9';
  let textColor = colorScheme === 'dark' ? '#E0E1E1' : '#000000';
  let navbarBg = colorScheme === 'dark' ? '#2B2B2B' : '#E2E2E2';
  return {
    colorScheme: colorScheme,
    colors: {keyboardBg, inputBg, textColor, navbarBg},
  };
};