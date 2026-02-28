import styled from "styled-components";

export const LogoutButtonContainer = styled.form`
    width: 100%;
    padding: 0.5rem 1rem;    
`;

export const LogoutButton = styled.button`
    flex: 1 1 0;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 8px;
    transition: background-color 0.2s ease;
    background-color: #007bff;
    color: white;

    &:hover {
        background-color: #0056b3;
    }
    &:active {
        background-color: #004085;
    }
    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }
`;
