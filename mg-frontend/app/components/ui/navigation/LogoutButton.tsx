import styled from "styled-components";

export const LogoutButtonContainer = styled.form`
    width: 100%;
    padding: 0.5rem 1rem;    
`;

export const LogoutButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;    // blue color for logout button
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.2s;
    cursor: pointer;
    font-weight: 500;

    &:hover {
        background-color: #007bffcc; // slightly lighter on hover
    }
    &:active {
        background-color: #c72c3b;
    }
`;
