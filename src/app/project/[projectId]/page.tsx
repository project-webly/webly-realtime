'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Tree from 'rc-tree';
import { useEffect, useRef, useState } from 'react';
import { EventDataNode, Key } from 'rc-tree/es/interface';
import { addFolder, addLink, FolderDto, getFolders, getFoldersDetail } from '@/lib/webly/api';
import { editor } from 'monaco-editor';
import { Editor, Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { createYjsProvider } from '@y-sweet/client';
import { MonacoBinding } from 'y-monaco';

export default function Page() {
  const params = useParams<{ projectId: string }>();
  const [expandedKeys, setExpandedKeys] = useState([]); // 열려 있는 아이템의 키 목록
  const [treeData, setTreeData] = useState([]); // 트리 데이터
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [docId, setDocId] = useState<string>();
  useEffect(() => {
    (async () => {
      const folders = await getFolders(params.projectId);
      setTreeData(
        folders.map((x) => ({
          key: x.id.toString(),
          title: x.name,
          children: [{ key: 'fake_' + x.id }],
        })),
      );
    })();
  }, []);

  const addLinkHandle = async () => {
    const linkName = prompt('link name');
    if (!linkName) return;

    if (selectedKeys.length > 0) {
      const parentId = selectedKeys[0];
      await addLink(params.projectId, parentId, linkName);
    } else {
      alert('no folder selected');
    }
  };
  const handleSelect = async (
    selectedKeys: Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: EventDataNode<TreeDataType>;
      selectedNodes: TreeDataType[];
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
      node: EventDataNode<TreeDataType>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    },
  ) => {
    const key = info.node.key.toString();
    if (info.expanded) {
      const folder = await getFoldersDetail(params.projectId, key);
      const children = folder.childFolders
        .map((x) => ({
          key: x.id,
          title: x.name,
          children: [{ key: 'fake_' + x.id }],
        }))
        .concat(
          folder.childLinks.map((x) => ({
            key: x.id,
            title: x.name,
            children: [],
          })),
        );

      setTreeData(updateTreeData(treeData, key, children));
      setExpandedKeys([...expandedKeys, key]);
    } else {
      setExpandedKeys(expandedKeys.filter((x) => x !== info.node.key));
    }
  };

  const updateTreeData = (tree: any, key: string, children: any[]): any => {
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
    const folderName = prompt('folder name');
    if (!folderName) return;

    if (selectedKeys.length > 0) {
      const parentId = selectedKeys[0];
      await addFolder(params.projectId, folderName, parentId);
    } else {
      await addFolder(params.projectId, folderName);
    }
  };

  return (
    <div>
      <div>
        {params?.projectId}
        <div>
          <button onClick={() => createFolder()}>Add Folder</button>
          <button onClick={() => addLinkHandle()}>Add Link</button>
          <button>Delete</button>
          <button>Rename</button>
          <Tree
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={handleExpand}
            onSelect={handleSelect}
          />
        </div>
      </div>
      <div>{docId && <EditorPage docId={docId} />}</div>
    </div>
  );
}

function EditorPage({ docId }: { docId: string }) {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [clientToken, setClientToken] = useState();
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
  }, [clientToken]);
  async function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
  }
  return (
    <Editor theme="vs-dark" className="w-screen h-screen" onMount={handleEditorDidMount}></Editor>
  );
}
