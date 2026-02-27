import styled from "styled-components";

interface SidebarProps {
  open?: boolean;
}

export const Sidebar = styled.div<SidebarProps>`
  width: 22rem;
  min-width: 22rem;
  max-width: 22rem;
  background-color: #f7f7f7;
  border-right: solid 1px #e3e3e3;
  display: flex;
  display: ${props => (props.open ? 'flex' : 'none')} ;
  flex-direction: column;
  flex-shrink: 0;

  & > * {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  /* @media (max-width: 768px) {
    display: none;
  } */
`;

// export const SidebarButton = styled.button`
//    position: fixed;
//    top: 1rem;
//    left: 1rem;
//    z-index: 1001;
//    display: block; // or use a styled-component with media queries
// `;

