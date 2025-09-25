import styled from "styled-components";

export const SidebarTitle = styled.h1`
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 1rem 2rem;
  border-top: 1px solid #e3e3e3;
  order: 1;
  line-height: 1;

  a {
    color: #3992ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;