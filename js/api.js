// api.js - 서버/API 통신

export async function fetchData(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('API 오류');
  return res.json();
} 