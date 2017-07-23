import * as React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';
import * as ts from 'typescript';

import { allTransforms } from 'react-js-to-ts'

const defaultInput = `
import * as React from 'react';

export default class MyComponent extends React.Component {
    render() {
        return <div />;
    }
}
`;

interface AppState {
    input: string;
    output: string;
    windowSize: { width: number; height: number; };
}

class App extends React.Component<{}, AppState> {
    static toolbarHeight = 50;
    state = { input: defaultInput, output: '', windowSize: { width: 0, height: 0 } }
    compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.ES2015,
    }
    host: ts.CompilerHost = {
        getSourceFile: (fileName: string, languageVersion: ts.ScriptTarget) => {
            console.log('getSourceFile', fileName)
            return ts.createSourceFile(fileName, this.state.input, languageVersion);
        },
        writeFile: (fileName: string, data: string, writeByteOrderMark: boolean, ) => undefined,
        getDirectories: () => ['/'],
        getCanonicalFileName: () => 'main.tsx',
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => '\n',
        getCurrentDirectory: () => '/',
        getDefaultLibFileName: () => 'lib.ts',
        fileExists: (fileName: string) => {
            console.log('fileExist', fileName)
            return fileName === 'main.tsx';
        },
        readFile: (fileName: string) => {
            console.log('readFile', fileName)
            return this.state.input
        },
    }
    getText = (start: number, end: number) => {
        console.log('getText')
        return this.state.input.substring(start, end);
    }
    getLength = () => this.state.input.length;
    setWindowSize = () => {
        this.setState({
            windowSize: { width: window.innerWidth, height: innerHeight }
        });
    }
    componentWillMount() {
        this.setWindowSize();
        this.setState({ output: this.compile(this.state.input) });
        window.addEventListener('resize', this.setWindowSize);
    }
    editorDidMount = (editor: monaco.editor.ICodeEditor, m: typeof monaco) => {
        editor.focus();
    }
    onChange = (newValue: string, e: monaco.editor.IModelContentChangedEvent2) => {
        this.setState({ input: newValue });
        try {
            const output = this.compile(this.state.input);
            this.setState({ output })
        } catch (error) {
            console.error(error);
        }
    }
    compile = (input: string) => {
        const sourceFile = ts.createSourceFile('main.tsx', this.state.input, this.compilerOptions.target);
        const program = ts.createProgram(['main.tsx'], this.compilerOptions, this.host);
        program.emit();
        const typeChecker = program.getTypeChecker();
        const result = ts.transform([sourceFile], allTransforms.map(f => f(typeChecker)));
        const printer = ts.createPrinter();
        return printer.printNode(ts.EmitHint.SourceFile, result.transformed[0], sourceFile);
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

const Toolbar = ({ height }: { height: number }) => (
    <div style={{ height: `${height}px` }}>
        Convert React code to TypeScript
    </div>
)

render(
    <App />,
    document.getElementById('root')
);
