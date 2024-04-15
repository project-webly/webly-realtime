'use client';

import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { editor } from 'monaco-editor';
import { Editor, Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { createYjsProvider } from '@y-sweet/client';
import { MonacoBinding } from 'y-monaco';

export default function Link() {
  const params = useSearchParams();
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  async function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    const url = new URL('http://localhost:3000/api/token');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        jwt: 'jwt',
        docId: params?.get('docId'),
      }),
    });
    const clientToken = await res.json();

    editorRef.current = editor;
    const doc = new Y.Doc();
    const provider = createYjsProvider(doc, clientToken, { disableBc: true });
    const type = doc.getText('manaco');
    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel()!,
      new Set([editorRef.current]),
      provider.awareness,
    );
    console.log(provider.awareness);
  }
  return (
    <Editor theme="vs-dark" className="w-screen h-screen" onMount={handleEditorDidMount}></Editor>
  );
}
