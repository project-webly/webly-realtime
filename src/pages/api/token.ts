import type { NextApiRequest, NextApiResponse } from 'next'
import {ClientToken, DocumentManager} from '@y-sweet/sdk'

// POST
// 입력: jwt(header), docId(body: stirng)
// 사용자가 만약 인증된 사용자이면 토큰을 내려주는 API
// 사용자 jwt 토큰을 받음
// 사용자 jwt 토큰으로 API 서버에 권한이 있는지 확인함
// 권한이 있으면 doc token을 내려줌
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClientToken>,
) {
  const { jwt, docId } = req.body

  const CONNECTION_STRING = "ys://AAAgzx1U6FFwE0RDKJuAJIE2EEN2ZWnmFr0c_8B-aIeRMAg@127.0.0.1:8080"
  const manager = new DocumentManager(CONNECTION_STRING)
  const clientToken = await manager.getOrCreateDocAndToken(docId)

  res.status(200).send(clientToken)
}