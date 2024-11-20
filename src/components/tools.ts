import { api } from 'src/boot/axios'

export const getAsuntosPadres = async () => {
  const url = `${process.env.API}/api/v1/asuntos?page_size=1000&where={"padre":null}`;
  const resp = await api.get(url)
  return resp
}

export const getAsuntosHijos = async () => {
  const url = `${process.env.API}/api/v1/asuntos?page_size=1000&where={"padre": {"$ne": null}}`;
  const resp = await api.get(url)
  return resp
}
