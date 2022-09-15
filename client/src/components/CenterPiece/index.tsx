import React from 'react';
import { Container } from 'reactstrap';

export interface ICenterPieceProps {
    children?: any
}

const CenterPiece: React.FunctionComponent<ICenterPieceProps> = props => {
    const { children } = props;

    return (
        <Container fluid className="p-0">
            <Container 
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    WebkitTransform: 'translate(-50%, -50%)'
                }}
                className="d-flex justify-content-center"
            >
                {children}
            </Container>
        </Container>
    );
}

export default CenterPiece;