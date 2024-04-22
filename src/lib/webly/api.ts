const API_PATH = '/webly-api';

async function callJson(method: string, url: string, body: any, headers?: Record<string, string>) {
  return (await call(method, url, body, headers)).json();
}

async function callText(method: string, url: string, body: any, headers?: Record<string, string>) {
  return (await call(method, url, body, headers)).text();
}

async function call(
  method: string,
  url: string,
  body: any,
  headers?: Record<string, string>,
): Promise<Response> {
  const res = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });
  return res;
}

async function callRequestString(
  method: string,
  url: string,
  body: string,
  headers?: Record<string, string>,
): Promise<Response> {
  const res = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body,
  });
  return res;
}

type LoginDto = {
  token: string;
};

export function login(id: string, password: string): Promise<LoginDto> {
  return callJson('POST', API_PATH + '/api/v1/auth/login', { username: id, password: password });
}

export type AccountDto = {
  id: number;
  name: string;
  userId: string;
  userPassword: string;
  role: string;
};

export function register(id: string, password: string): Promise<AccountDto> {
  return callJson('POST', API_PATH + '/api/v1/admin/accounts/register', {
    role: 'ADMIN',
    userId: id,
    userName: id,
    userPassword: password,
    userEmail: id,
  });
}

function jwt() {
  return localStorage.getItem('jwt');
}

function jwtHeader() {
  return { Authorization: 'Bearer ' + jwt() };
}

export function me(): Promise<AccountDto> {
  return callJson('GET', API_PATH + '/api/v1/auth/me', null, jwtHeader());
}

export function createProject(name: string) {
  return callJson('POST', API_PATH + '/api/v1/projects', { name: name }, jwtHeader());
}

export type ProjectDto = {
  id: number;
  name: string;
};

export function getProjects(): Promise<ProjectDto[]> {
  return callJson('GET', API_PATH + '/api/v1/projects', null, jwtHeader());
}

export function getProjectById(id: string): Promise<ProjectDto> {
  return callJson('GET', API_PATH + `/api/v1/projects/${id}`, null, jwtHeader());
}

export function renameProject(id: string, name: string) {
  return callRequestString('POST', API_PATH + `/api/v1/projects/${id}/rename`, name, jwtHeader());
}

export function deleteProject(id: string) {
  return call('DELETE', API_PATH + `/api/v1/projects/${id}`, null, jwtHeader());
}

export type FolderDto = {
  id: number;
  name: string;
  parentId: number;
};

export function getFolders(projectId: string, parentId?: string): Promise<FolderDto[]> {
  return callJson(
    'GET',
    API_PATH + `/api/v1/projects/${projectId}/folders${parentId ? '?parentId=' + parentId : ''}`,
    null,
    jwtHeader(),
  );
}

type FolderDetailDto = {
  id: number;
  name: string;
  parentId: number;
  childFolders: FolderDto[];
  childLinks: LinkDto[];
};

export function getFoldersDetail(projectId: string, folderId: string): Promise<FolderDetailDto> {
  return callJson(
    'GET',
    API_PATH + `/api/v1/projects/${projectId}/folders/${folderId}`,
    null,
    jwtHeader(),
  );
}

export function addFolder(projectId: string, name: string, parentId?: string) {
  return callJson(
    'POST',
    API_PATH + `/api/v1/projects/${projectId}/folders`,
    { name: name, parentId: parentId },
    jwtHeader(),
  );
}

export function addLink(projectId: string, parentId: string, name: string) {
  return callJson(
    'POST',
    API_PATH + `/api/v1/projects/${projectId}/folders/${parentId}/links`,
    { name: name, url: '' },
    jwtHeader(),
  );
}

export type LinkDto = {
  id: number;
  name: string;
  url: string;
  folderId: number;
};

export type ProjectAccountDto = {
  id: number;
  accountName: string;
};

export function getAccounts(projectId: string): Promise<ProjectAccountDto[]> {
  return callJson('GET', API_PATH + `/api/v1/projects/${projectId}/accounts`, null, jwtHeader());
}

export function addAccount(projectId: string, email: string) {
  return callJson(
    'POST',
    API_PATH + `/api/v1/projects/${projectId}/accounts`,
    { email, isAdmin: true },
    jwtHeader(),
  );
}

export function deleteAccount(projectId: string, accountId: string) {
  return callJson(
    'DELETE',
    API_PATH + `/api/v1/projects/${projectId}/accounts/${accountId}`,
    null,
    jwtHeader(),
  );
}
