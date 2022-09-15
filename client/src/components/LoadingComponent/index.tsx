import React from 'react';
import { Card, CardBody } from 'reactstrap';
import CenterPiece from '../CenterPiece';

export interface ILoadingProps {
    dotType?: string;
    children? :any;
}

export const Loading: React.FunctionComponent<ILoadingProps> = props => {
    const { children, dotType } = props;

    return (
        <div className="text-center">
            <div className="stage">
                <div className={dotType} />
            </div>
            {children}
        </div>
    )
}

Loading.defaultProps = {
    dotType: 'dot-bricks'
}

export interface ILoadingComponentProps {
    card?: boolean;
    dotType?: string;
    children?: any;
}

const LoadingComponent: React.FunctionComponent<ILoadingComponentProps> = props => {
    const { card, children, dotType } = props;

    if (card)
    {
        return (
            <CenterPiece>
                <Card className="text-center">
                    <CardBody 
                        style={{
                            display: 'flex', 
                            flexDirection: 'column',
                            height: '100%', 
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Loading dotType={dotType} />
                        <div style={{margin: '20px 0'}}>{children}</div>
                    </CardBody>
                </Card>
            </CenterPiece>
        );
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className="stage">
                <div className={dotType} />
                
            </div>
            <div>{children}</div>
            
        </div>
    );
}

LoadingComponent.defaultProps = {
    card: true,
    dotType: 'dot-bricks'
}

export default LoadingComponent;