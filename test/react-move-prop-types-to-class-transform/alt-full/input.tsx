class SomeComponent extends React.Component<{
        foo: number;
    }, {
        bar: string;
    }> {
    render() {
        return null;
    }
}
SomeComponent['propTypes'] = { foo: PropTypes.string };
