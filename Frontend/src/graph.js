
export async function callMsGraph(accessToken) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);
  
  const options = {
      method: "GET",
      headers: headers
  };

  const graphEndpoint = "https://graph.microsoft.com/v1.0/me";
  
  try {
      const response = await fetch(graphEndpoint, options);
      if (!response.ok) throw new Error('Response not ok');

      return await response.json();
  } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
  }
}

export async function getUserProfilePhoto(accessToken) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);
  
  const options = {
      method: "GET",
      headers: headers
  };

  const photoEndpoint = "https://graph.microsoft.com/v1.0/me/photo/$value";

  try {
      const response = await fetch(photoEndpoint, options);
      if (!response.ok) throw new Error('Response not ok');

      const imageBlob = await response.blob();
      return URL.createObjectURL(imageBlob);
  } catch (error) {
      console.error('Error fetching profile photo:', error);
      return null;
  }
}
