import React from 'react';

import {AppWrapper} from '../../utils/context';
import {fireEvent, render} from '@testing-library/react-native';
import TaskInput from './TaskInput';

let taskData = [{id: '1', title: 'test', isDone: false}];
const userData = {
  color: [
    {item: '#434343', isChecked: true},
    {item: '#203A43', isChecked: false},
    {item: '#8e9eab', isChecked: false},
  ],
  icon: [
    {item: '🐶', isChecked: true},
    {item: '🐱', isChecked: false},
    {item: '🐭', isChecked: false},
  ],
};

let sharedState = {
  taskData,
  setTaskData: jest.fn(),
  userData,
  setUserData: jest.fn(),
};

jest.mock('react-native-reanimated', () => {
  return {
    ...jest.requireActual('react-native-reanimated/mock'),
    ...jest.requireActual('react-native-reanimated/src/reanimated2/mock'),
    Layout: {
      duration: () => ({
        damping: () => ({
          springify: () => ({
            delay: () => {},
          }),
        }),
      }),
    },
  };
});

describe('Task card components', () => {
  it('should render title of task data and change text value when user changes it', async () => {
    const {getByPlaceholderText} = render(
      <AppWrapper testValue={sharedState}>
        <TaskInput />
      </AppWrapper>,
    );

    const textInput = getByPlaceholderText(/Add your task/i);
    fireEvent.changeText(textInput, 'do dishes');

    expect(textInput.props.value).toBe('do dishes');
  });
});
