import * as React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

interface AppState {
    input: string;
    output: string;
    windowSize: { width: number; height: number; };
}

class App extends React.Component<{}, AppState> {
    static toolbarHeight = 50;
    state = { input: '// hello ', output: '// hello', windowSize: { width: 0, height: 0 } }
    setWindowSize = () => {
        this.setState({
            windowSize: { width: window.innerWidth, height: innerHeight }
        });
    }
    componentWillMount() {
        this.setWindowSize()
        window.addEventListener('resize', this.setWindowSize);
    }
    editorDidMount = (editor: monaco.editor.ICodeEditor, m: typeof monaco) => {
        console.log('editorDidMount', editor);
        editor.focus();
    }
    onChange = (newValue: string, e: monaco.editor.IModelContentChangedEvent2) => {
        console.log('onChange', newValue, e);
    }
    render() {
        const { input, output, windowSize } = this.state;
        return (
            <div>
                <Toolbar height={App.toolbarHeight} />
                <div style={{ display: 'flex' }}>
                    <MonacoEditor
                        width={windowSize.width / 2}
                        height={windowSize.height - App.toolbarHeight}
                        language='javascript'
                        value={input}
                        options={{}}
                        onChange={this.onChange}
                        editorDidMount={this.editorDidMount}
                    />
                    <MonacoEditor
                        width={windowSize.width / 2}
                        height={windowSize.height - App.toolbarHeight}
                        language='typescript'
                        value={output}
                        options={{ readOnly: true }}
                    />
                </div>
            </div>
        );
    }
}

const Toolbar = ({height}: {height: number}) => (
    <div style={{height: `${height}px`}}>
        Convert React code to TypeScript
    </div>
)

render(
    <App />,
    document.getElementById('root')
);
