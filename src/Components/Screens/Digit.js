import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
  &: first-child {
    margin-left: 0;
  }
`;

const Title = styled.span`
  font-size: 8px;
  margin-bottom: 5px;
  margin-right: 7px;
`;

const DigitContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
`;

const SingleDigit = styled.span`
  // position: relative;
  display: flex;
  flex: 0 1 25%;
  font-size: 25px;
  // background-color: #404549;
  border-radius: 5px;
  padding: 0px 0px;
  color: #404549;
  &:first-child {
    margin-right: 2px;
  }
  // &:after {
  //   position: absolute;
  //   left: 0px;
  //   right: 0px;
  //   top: 50%;
  //   bottom: 50%;
  //   content: "";
  //   width: '100%';
  //   height: 2px;
  //   background-color: #232323;
  //   opacity: 0.4;
  // }
`;

export default function Digit({ value, title, addSeparator}) {
  const leftDigit = value >= 10 ? value.toString()[0] : '0';
  const rightDigit = value >= 10 ? value.toString()[1] : value.toString();
  return (
    <Container>
      <Title>{title}</Title>
      <DigitContainer>
        <SingleDigit>
          {leftDigit}
        </SingleDigit>
        <SingleDigit>
          {rightDigit}
        </SingleDigit>
        { addSeparator && 
        <span style={{marginLeft: "7px", marginTop: "7px"}}>
          :
        </span>
        }
      </DigitContainer>
    </Container>
  );
}