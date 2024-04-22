'use client';

import { Header, HomeLayout } from '@/app/page';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import {
  AccountDto,
  addAccount,
  createProject,
  deleteAccount,
  deleteProject,
  getAccounts,
  ProjectAccountDto,
  ProjectDto,
  renameProject,
} from '@/lib/webly/api';

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
  const [accounts, setAccounts] = useState<ProjectAccountDto[]>([]);
  const [accountEmail, setAccountEmail] = useState('');
  const rename = async () => {
    if (params?.projectId == null) return;
    await renameProject(params.projectId, name);
  };
  const deleteHandle = async () => {
    if (params?.projectId == null) return;
    await deleteProject(params.projectId);
    router.push('/project');
  };
  const handleAddMember = async () => {
    if (!params) return;
    await addAccount(params.projectId, accountEmail);
    //TODO refresh
  };
  useEffect(() => {
    (async () => {
      if (!params) return;
      const accounts = await getAccounts(params.projectId);
      setAccounts(accounts);
    })();
  }, [params, setAccounts]);
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
      <input
        type="text"
        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        value={accountEmail}
        onChange={(e) => setAccountEmail(e.target.value)}
      />
      <button
        onClick={() => handleAddMember()}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md py-2 px-4 w-full"
      >
        Add Member
      </button>
      <Table projectId={params!.projectId} accounts={accounts} />
      <button
        onClick={() => deleteHandle()}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md py-2 px-4 w-full"
      >
        Delete Project
      </button>
    </>
  );
}

function Table({ projectId, accounts }: { projectId: string; accounts: ProjectAccountDto[] }) {
  const handleDeleteAccount = async (id: string) => {
    await deleteAccount(projectId, id);
    //TODO refresh
  };
  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Id
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Name
                    </th>

                    <th scope="col" className="relative py-3.5 px-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                {accounts.map((x) => (
                  <tbody
                    key={x.id}
                    className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
                  >
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <span>#{x.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {x.accountName}
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-x-6">
                          <a
                            href={`/project/${x.id}/setting`}
                            className="text-blue-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                            onClick={() => handleDeleteAccount(x.id.toString())}
                          >
                            Delete
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <a
          href="#"
          className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>

          <span>previous</span>
        </a>

        <div className="items-center hidden md:flex gap-x-3">
          <a
            href="#"
            className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60"
          >
            1
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            2
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            3
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            ...
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            12
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            13
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            14
          </a>
        </div>

        <a
          href="#"
          className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <span>Next</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
