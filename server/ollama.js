const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "llama3.2:3b";


/* =====================================================
   NORMAL OLLAMA REQUEST
===================================================== */

export async function askOllama(prompt) {
  const response = await fetch(
    `${OLLAMA_URL}/api/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,

        stream: false,

        keep_alive: "10m",

        options: {
          temperature: 0.3,
          num_predict: 80,
          top_k: 20,
          top_p: 0.8,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Ollama error ${response.status}: ${errorText}`
    );
  }

  const data =
    await response.json();

  return data.response || "";
}


/* =====================================================
   STREAMING OLLAMA REQUEST
===================================================== */

export async function streamOllama(
  prompt,
  onToken
) {
  const response = await fetch(
    `${OLLAMA_URL}/api/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,

        stream: true,

        keep_alive: "10m",

        options: {
          temperature: 0.3,

          // Keep Mentor AI answers short.
          num_predict: 80,

          top_k: 20,

          top_p: 0.8,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Ollama error ${response.status}: ${errorText}`
    );
  }

  if (!response.body) {
    throw new Error(
      "Ollama did not return a stream."
    );
  }

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder();

  let buffer = "";

  while (true) {
    const {
      value,
      done,
    } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(
      value,
      {
        stream: true,
      }
    );

    const lines =
      buffer.split("\n");

    buffer =
      lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }

      try {
        const data =
          JSON.parse(line);

        if (data.response) {
          onToken(
            data.response
          );
        }

        if (data.done) {
          return;
        }
      } catch (error) {
        console.error(
          "Ollama stream parse error:",
          error
        );
      }
    }
  }

  // Process anything left in buffer.
  if (buffer.trim()) {
    try {
      const data =
        JSON.parse(buffer);

      if (data.response) {
        onToken(
          data.response
        );
      }
    } catch {
      // Ignore incomplete final chunk.
    }
  }
}