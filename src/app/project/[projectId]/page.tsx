'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Tree from 'rc-tree';
import React, { useEffect, useRef, useState } from 'react';
import { DataNode, EventDataNode, Key } from 'rc-tree/es/interface';
import {
  addFolder,
  addLink,
  deleteFolder,
  deleteLink,
  FolderDto,
  getFolders,
  getFoldersDetail,
} from '@/lib/webly/api';
import { editor } from 'monaco-editor';
import { Editor, Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { createYjsProvider } from '@y-sweet/client';
import { MonacoBinding } from 'y-monaco';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function folderIdToTreeKey(id: string | number): string {
  return 'folder_' + id.toString();
}

function fileIdToTreeKey(id: string | number): string {
  return 'file_' + id.toString();
}

function isFolder(treeKey: string) {
  return treeKey.startsWith('folder_');
}

function isFile(treeKey: string) {
  return treeKey.startsWith('file_');
}

function parseKey(treeKey: Key) {
  return {
    isFolder: isFolder(treeKey.toString()),
    isFile: isFile(treeKey.toString()),
    treeKey: treeKey.toString(),
    apiId: treeKey.toString().substring(treeKey.toString().split('_')[0].length + 1),
  };
}

export default function Page() {
  const params = useParams<{ projectId: string }>();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]); // 열려 있는 아이템의 키 목록
  const [treeData, setTreeData] = useState<DataNode[]>([]); // 트리 데이터
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [docId, setDocId] = useState<string>();
  const [content, setContent] = useState('');

  useEffect(() => {
    (async () => {
      if (params == null) return;

      const folders = await getFolders(params.projectId);
      setTreeData(
        folders.map((x) => ({
          key: folderIdToTreeKey(x.id),
          title: x.name,
          children: [{ key: 'fake_' + x.id }],
        })),
      );
    })();
  }, []);

  const addLinkHandle = async () => {
    if (params == null) return;

    const linkName = prompt('link name');
    if (!linkName) return;

    if (selectedKeys.length > 0) {
      const parentId = parseKey(selectedKeys[0] as string);
      await addLink(params.projectId, parentId.apiId, linkName);
    } else {
      alert('no folder selected');
    }
  };
  const handleSelect = async (
    selectedKeys: Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: EventDataNode<DataNode>;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    },
  ) => {
    setSelectedKeys(selectedKeys);
    if (selectedKeys.length === 1) {
      setDocId(selectedKeys[0].toString());
    }
  };
  const handleExpand = async (
    expandedKeys: Key[],
    info: {
      node: EventDataNode<DataNode>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    },
  ) => {
    const key = parseKey(info.node.key.toString());
    if (params == null) return;
    if (info.expanded) {
      const folder = await getFoldersDetail(params.projectId, key.apiId);
      const children = folder.childFolders
        .map((x) => ({
          key: folderIdToTreeKey(x.id),
          title: x.name,
          children: [{ key: 'fake_' + x.id }],
        }))
        .concat(
          folder.childLinks.map((x) => ({
            key: fileIdToTreeKey(x.id),
            title: x.name,
            children: [],
          })),
        );

      setTreeData(updateTreeData(treeData, key.treeKey, children));
      setExpandedKeys([...expandedKeys, key.treeKey]);
    } else {
      setExpandedKeys(expandedKeys.filter((x) => x !== info.node.key));
    }
  };

  const updateTreeData = (tree: DataNode[], key: string, children: any[]): any => {
    return tree.map((node) => {
      console.log({ my: node.key, key });
      if (node.key === key) {
        return { ...node, children };
      } else if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    });
  };

  const createFolder = async () => {
    if (params == null) return;
    const folderName = prompt('folder name');
    if (!folderName) return;

    if (selectedKeys.length > 0) {
      const parentKey = parseKey(selectedKeys[0] as string);
      await addFolder(params.projectId, folderName, parentKey.apiId);
    } else {
      await addFolder(params.projectId, folderName);
    }
  };

  const handleDelete = async () => {
    if (params == null) return;
    if (selectedKeys.length !== 0) {
      alert('선택된 항목이 없습니다');
      return;
    }

    const key = parseKey(selectedKeys[0] as string);
    if (key.isFolder) {
      await deleteFolder(params.projectId, key.apiId);
    } else {
      const folderId = treeData
        .flatMap((x) => [x, ...(x.children as DataNode[])])
        .find((x) => x.children?.filter((child) => child.key === key.treeKey));
      if (folderId) {
        await deleteLink(params.projectId, parseKey(folderId.key).apiId, key.apiId);
      }
    }
  };

  const handleRename = async () => {};

  return (
    <div>
      <div>
        {params?.projectId}
        <div>
          <button onClick={() => createFolder()}>Add Folder</button>
          <button onClick={() => addLinkHandle()}>Add Link</button>
          <button onClick={() => handleDelete()}>Delete</button>
          <button onClick={() => handleRename()}>Rename</button>
          <Tree
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={handleExpand}
            onSelect={handleSelect}
          />
        </div>
      </div>
      <div>
        {docId && (
          <div className="w-1/2">
            <EditorPage docId={docId} onValueChange={(c) => setContent(c)} />
          </div>
        )}
        <div className="w-1/2">
          <MarkdownViewer content={content} />
        </div>
      </div>
    </div>
  );
}

function EditorPage({
  docId,
  onValueChange,
}: {
  docId: string;
  onValueChange?: (arg: string) => void;
}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [clientToken, setClientToken] = useState<any>();
  const bindingRef = useRef<MonacoBinding | null>(null);

  useEffect(() => {
    (async () => {
      const url = new URL('http://localhost:3000/api/token');
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          jwt: 'jwt',
          docId: docId,
        }),
      });
      setClientToken(await res.json());
    })();
  }, [docId]);

  useEffect(() => {
    console.log('why?');
    bindingRef.current?.destroy();

    const editor = editorRef.current;
    if (!editor) return;

    const doc = new Y.Doc();
    const provider = createYjsProvider(doc, clientToken, { disableBc: true });
    const type = doc.getText('manaco');
    const binding = new MonacoBinding(
      type,
      editor.getModel()!,
      new Set([editor]),
      provider.awareness,
    );
    bindingRef.current = binding;
    console.log(provider.awareness);

    editor.getModel()?.onDidChangeContent((e) => {
      console.log(editor.getValue());
      onValueChange?.(editor.getValue());
    });
  }, [clientToken]);
  async function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
  }
  return (
    <Editor
      theme="vs-dark"
      className="w-screen h-screen"
      language="markdown"
      onMount={handleEditorDidMount}
    ></Editor>
  );
}

function MarkdownViewer({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
