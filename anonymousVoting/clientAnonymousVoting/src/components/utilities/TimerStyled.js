import React from 'react';
import styled from 'styled-components';
import Digit from './Digit';

const TimerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: -10px;
`;

export function TimerStyled({ seconds, minutes, hours, days }) {
  return (
    <TimerContainer>
      {days !== undefined ? <Digit value={days} title="DAYS" addSeparator /> : null}
      <Digit value={hours} title="HOURS" addSeparator />
      <Digit value={minutes} title="MINUTES" addSeparator />
      <Digit value={seconds} title="SECONDS" />
    </TimerContainer>
  );
}