import * as React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

interface AppState {
  code: string;
}

class App extends React.Component<{}, AppState> {
  state = { code: '// hello ' }
  editorDidMount = (editor: monaco.editor.ICodeEditor, m: typeof monaco) => {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange = (newValue: string, e: monaco.editor.IModelContentChangedEvent2) => {
    console.log('onChange', newValue, e);
  }
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}

render(
  <App />,
  document.getElementById('root')
);
