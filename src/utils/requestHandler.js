export default async function requestHandler(url, method = "GET", data = null) {
  const options = {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data && options.method !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;

      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error in requestHandler:", error.message);
    throw error;
  }
}
