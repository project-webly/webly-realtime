'use client';

import { Header, HomeLayout } from '@/app/page';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createProject, deleteProject, renameProject } from '@/lib/webly/api';

export default function SettingProject() {
  return (
    <HomeLayout>
      <>
        <Header />
        <Form></Form>
      </>
    </HomeLayout>
  );
}

function Form() {
  const params = useParams<{ projectId: string }>();

  const router = useRouter();
  const [name, setName] = useState('');
  const rename = async () => {
    if (params?.projectId == null) return;
    await renameProject(params.projectId, name);
  };
  const deleteHandle = async () => {
    if (params?.projectId == null) return;
    await deleteProject(params.projectId);
    router.push('/project');
  };
  return (
    <>
      <div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-600">
            Project name
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          onClick={() => rename()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
        >
          Change name
        </button>
      </div>

      <p>Team Members</p>
      <button
        onClick={() => deleteHandle()}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md py-2 px-4 w-full"
      >
        Delete Project
      </button>
    </>
  );
}
