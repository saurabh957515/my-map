import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-build-classic';

class CkTextEditor extends Component {
  render() {
    return (
      <CKEditor
        editor={ClassicEditor}
        data={this.props.data}
        onReady={editor => {
          editor.editing.view.change(writer => {
            writer.setStyle(
              this.props.style,
              editor.editing.view.document.getRoot()
            );
          });
        }}
        onChange={this.props.onChange}
      />
    );
  }
}

export default CkTextEditor;
