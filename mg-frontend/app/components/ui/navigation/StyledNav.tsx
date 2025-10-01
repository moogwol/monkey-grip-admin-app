import styled from "styled-components";

export const StyledNav = styled.nav`
  flex: 1;
  overflow: auto;
  padding-top: 1rem;
  order: 0.5;
  
  ul {
    padding: 0;
    margin: 0;
    list-style: none !important;
  }
  
  li {
    margin: 0.25rem 0;
    list-style: none !important;
  }
  
  p {
    padding: 0 0.5rem;
    margin: 0;
    color: #818181;
    font-style: italic;
  }
`;