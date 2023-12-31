import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
    return useTypedSelector((state) => {
        const { data, order } = state.cells;
        const orderedCells = order.map(id => data[id]);

        //_React is renamed in case if user decides to import it again
        const showFunction = `
            import _React from 'react';
            import _ReactDOM from 'react-dom';
                var show = (value) => {
                    const root = document.querySelector('#root')
                    if (typeof value === 'object') {
                        if (value.$$typeof && value.props) {
                            _ReactDOM.render(value, root);
                        } else {
                            root.innerHTML = JSON.stringify(value);
                        }
                    } else {
                        root.innerHTML = value;
                    }
                };
        `
        //a fix to make sure that show() prints only in a cell that it was executed in
        const showFunctionNoop = 'var show = () => {}'

        const cumulativeCode = [];
        for (const c of orderedCells) {
            if (c.type === 'code') {
                if (c.id === cellId) {
                    cumulativeCode.push(showFunction);
                } else {
                    cumulativeCode.push(showFunctionNoop);
                }
                cumulativeCode.push(c.content);
            }
            if (c.id === cellId) {
                break;
            }
        }
        return cumulativeCode.join('\n');
    })
}