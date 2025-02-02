const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Example of a server-side function that adds a user to Firestore securely
exports.addUser = functions.https.onRequest(async (req, res) => {
  try {
    const { name, email, age } = req.body;  // Get data from the request body

    // Use Firebase Admin SDK to add data to Firestore (this runs server-side)
    const docRef = await admin.firestore().collection('users').add({
      name: name,
      email: email,
      age: age,
    });

    res.status(200).send({ message: `User added with ID: ${docRef.id}` });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send({ error: "Failed to add user" });
  }
});
