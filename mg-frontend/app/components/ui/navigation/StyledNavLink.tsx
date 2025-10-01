import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router";

// Progress animation for pending states
const progress = keyframes`
  0% {
    background: #e3e3e3;
  }
  50% {
    background: hsla(224, 98%, 58%, 0.5);
  }
  100% {
    background: #e3e3e3;
  }
`;

interface StyledNavLinkProps {
  $isActive?: boolean;
  $isPending?: boolean;
}

// Use NavLink directly with styled-components
export const StyledNavLink = styled(NavLink)<StyledNavLinkProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  white-space: pre;
  padding: 0.5rem;
  border-radius: 8px;
  color: inherit;
  gap: 1rem;
  transition: background-color 100ms;
  text-decoration: none;
  
  &:hover {
    background: #e3e3e3;
  }
  
  &:visited,
  &:link {
    color: inherit;
    text-decoration: none;
  }
  
  ${props => props.$isActive && css`
    background: hsl(224, 98%, 58%);
    color: white !important;
    
    &:hover {
      background: hsl(224, 98%, 58%);
    }
    
    &:visited,
    &:link {
      color: white !important;
    }
  `}
  
  ${props => props.$isPending && css`
    animation: ${progress} 2s infinite ease-in-out;
    animation-delay: 200ms;
  `}
`;