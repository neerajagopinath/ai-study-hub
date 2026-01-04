export async function studyKitTool(input: { payload?: any }) {
  const res = await fetch("http://localhost:4000/api/tools/study-kit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input.payload ?? {})
  })

  return res.json()
}