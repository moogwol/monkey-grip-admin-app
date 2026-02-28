import styled from "styled-components";

export const SidebarButtonContainer = styled.form`
    width: 100%;    
    padding: 0.5rem 1rem;
`;

export const SidebarButton = styled.button`
position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    border: none;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        background-color: #007bffcc; // slightly lighter on hover
    }
    &:active {
        background-color: #c72c3b;
    }
`;