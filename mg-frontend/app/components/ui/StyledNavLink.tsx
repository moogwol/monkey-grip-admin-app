import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router";

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

// Use a div wrapper to completely bypass any link styling
const NavLinkWrapper = styled.div<StyledNavLinkProps>`
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
  cursor: pointer;
  
  ${props => props.$isActive && css`
    background: hsl(224, 98%, 58%);
    color: white;
    
    &:hover {
      background: hsl(224, 98%, 58%);
    }
  `}
  
  ${props => props.$isPending && css`
    animation: ${progress} 2s infinite ease-in-out;
    animation-delay: 200ms;
  `}
  
  &:hover {
    background: #e3e3e3;
  }
`;

const InvisibleLink = styled(Link)`
  text-decoration: none !important;
  color: inherit !important;
  display: contents;
  
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none !important;
    color: inherit !important;
  }
`;

export const StyledNavLink = ({ $isActive, $isPending, to, children, ...props }: StyledNavLinkProps & { to: string; children: React.ReactNode }) => {
  return (
    <InvisibleLink to={to} {...props}>
      <NavLinkWrapper $isActive={$isActive} $isPending={$isPending}>
        {children}
      </NavLinkWrapper>
    </InvisibleLink>
  );
};