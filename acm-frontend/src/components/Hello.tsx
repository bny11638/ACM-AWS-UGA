import React from 'react';

export function Hello(props: {extraText: string, extra: number}) {
    const { extraText } = props;
    return (
    <div>
        Hello World!
        {extraText}
    </div>)

}