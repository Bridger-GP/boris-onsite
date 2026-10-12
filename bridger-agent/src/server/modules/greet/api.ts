// Round-trips a greeting through the LangGraph agent server to check the two apps are wired up.
export const greetings = async () => {
  const response = await fetch("http://localhost:8000/agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: "Bridger" }),
  });
  return await response.json();
};
