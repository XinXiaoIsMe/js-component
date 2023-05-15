export default async function useAwait(promise) {
  const res = []
  try {
    res[1] = await promise
  }
  catch (e) {
    res[0] = e
  }
  return res
}
