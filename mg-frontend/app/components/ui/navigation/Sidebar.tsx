import styled from "styled-components";

export const Sidebar = styled.div`
  width: 22rem;
  min-width: 22rem;
  max-width: 22rem;
  background-color: #f7f7f7;
  border-right: solid 1px #e3e3e3;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  & > * {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;