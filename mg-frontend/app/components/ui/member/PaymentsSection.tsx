import styled from 'styled-components'

export const PaymentsSection = styled.div`
    display: flex;
    flex-direction: column;
`

export const PaymentCardList = styled.div`
overflow-y: auto;
max-height: 150px;
padding-right: 0.5rem;
`

export const PaymentItemCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    height: 45px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 0.5rem;
    margin-bottom: 1px;
    transition: box-shadow 0.2s;
    &:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.10);
    }
`

