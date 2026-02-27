import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
`;

export const LoginBox = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

export const LoginTitle = styled.h1`
  text-align: center;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
`;

export const LoginSubtitle = styled.p`
  text-align: center;
  color: #666;
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
`;

export const LoginFormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-of-type {
    margin-bottom: 2rem;
  }
`;

export const LoginLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
`;

export const LoginInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const LoginSubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const LoginErrorAlert = styled.div<{ $show: boolean }>`
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  display: ${props => props.$show ? 'block' : 'none'};
  font-size: 0.95rem;
`;