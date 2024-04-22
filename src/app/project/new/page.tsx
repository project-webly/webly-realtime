'use client';

import { Header, HomeLayout } from '@/app/page';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createProject } from '@/lib/webly/api';

export default function NewProject() {
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
  const router = useRouter();
  const [name, setName] = useState('');
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await createProject(name);
    router.push(`/project`);
  };
  return (
    <form action="#" method="POST" onSubmit={(e) => onSubmit(e)}>
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
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
      >
        Create
      </button>
    </form>
  );
}
