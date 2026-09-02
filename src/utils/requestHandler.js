export default async function requestHandler(url, method = "GET", data = null) {
  const httpMethod = method.toUpperCase();

  const options = {
    method: httpMethod,
    headers: {},
  };

  // GET and HEAD requests use query parameters
  if (httpMethod === "GET" && data) {
    const queryParams = new URLSearchParams(data).toString();

    if (queryParams) {
      url += `?${queryParams}`;
    }
  } else if (data) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        console.error("Error response is not JSON:", await response.text());
      }

      throw new Error(errorMessage);
    }

    // 204 No Content has no response body
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error in requestHandler:", error.message);
    throw error;
  }
}
