const addUserToDatabase = async (name, email, age) => {
  try {
    const response = await fetch('https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, age }),  // Send data as JSON
    });

    const result = await response.json();
    console.log(result.message);  // "User added with ID: ..."
  } catch (error) {
    console.error("Error:", error);
  }
};
