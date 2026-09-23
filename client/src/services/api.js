const K =
  "mentor-ai-token";


/* =====================================================
   TOKEN
===================================================== */

export const token =
  () =>
    localStorage.getItem(K);


export const setToken =
  (t) =>
    localStorage.setItem(
      K,
      t
    );


export const clearToken =
  () =>
    localStorage.removeItem(K);


/* =====================================================
   NORMAL API REQUEST
===================================================== */

export async function api(
  path,
  options = {}
) {
  const headers = {
    "Content-Type":
      "application/json",

    ...(options.headers || {}),
  };

  const currentToken =
    token();

  if (currentToken) {
    headers.Authorization =
      `Bearer ${currentToken}`;
  }

  const response =
    await fetch(
      path,
      {
        ...options,
        headers,
      }
    );

  const data =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Request failed."
    );
  }

  return data;
}


/* =====================================================
   STREAMING CHAT
===================================================== */

export async function streamChat(
  message,
  onToken
) {
  const currentToken =
    token();

  const headers = {
    "Content-Type":
      "application/json",
  };

  if (currentToken) {
    headers.Authorization =
      `Bearer ${currentToken}`;
  }

  const response =
    await fetch(
      "/api/chat/stream",
      {
        method: "POST",

        headers,

        body:
          JSON.stringify({
            message,
          }),
      }
    );

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(
          () => ({})
        );

    throw new Error(
      data.message ||
        "Chat request failed."
    );
  }

  if (!response.body) {
    throw new Error(
      "Streaming is not supported by this browser."
    );
  }

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder();

  let fullText = "";

  while (true) {
    const {
      value,
      done,
    } = await reader.read();

    if (done) {
      break;
    }

    const text =
      decoder.decode(
        value,
        {
          stream: true,
        }
      );

    fullText += text;

    if (onToken) {
      onToken(text);
    }
  }

  return fullText;
}