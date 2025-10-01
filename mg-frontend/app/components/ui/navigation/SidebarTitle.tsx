import styled from "styled-components";

export const SidebarTitle = styled.h1`
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 1rem 2rem;
  border-top: 1px solid #e3e3e3;
  order: 1 !important;
  line-height: 1;

  &::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url("/mg_logo_vectorised.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 0.75rem;
    position: relative;
    top: 2px;
  }

  a {
    color: #3992ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;