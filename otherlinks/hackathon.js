// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCKZvLFJ0a5co-sVwpnaDiwQ4U6wr7G4_4",
    authDomain: "gdg-devfest-hackathon.firebaseapp.com",
    projectId: "gdg-devfest-hackathon",
    storageBucket: "gdg-devfest-hackathon.appspot.com",
    messagingSenderId: "952205387507",
    appId: "1:952205387507:web:6ec5fde238d7cbe432f986",
    measurementId: "G-Z2R2CYWZFZ"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Form submission handling
  const registrationForm = document.getElementById('registrationForm');
  
  registrationForm.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const pictureFile = registrationForm.picture.files[0];
  
    // Upload the picture to Firebase Storage
    const storageRef = firebase.storage().ref();
    const pictureRef = storageRef.child(`participant_pics/${Date.now()}_${pictureFile.name}`);
    pictureRef.put(pictureFile)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(pictureURL => {
  
        const formData = {
          fullName: registrationForm.fullName.value,
          email: registrationForm.email.value,
          phone: registrationForm.phone.value,
          skills: registrationForm.skills.value,
          foodAllergies: registrationForm.foodAllergies.value,
          emergencyContact: registrationForm.emergencyContact.value,
          tshirtSize: registrationForm.tshirtSize.value,
          accommodations: registrationForm.accommodations.value,
          portfolioLink: registrationForm.portfolioLink.value,
          goal: registrationForm.goal.value,
          pictureURL: pictureURL,
          // Add other fields as needed
        };
  
        // Save data to Firebase Firestore
        db.collection('registrations').add(formData)
          .then(() => {
            // After successfully saving data to Firestore, fetch data and update Google Sheets
            getFirestoreData();
          })
          .catch(error => {
            console.error('Error adding document to Firestore: ', error);
            alert('Registration failed. Please try again.');
          });
      })
      .catch(error => {
        console.error('Error uploading picture:', error);
        alert('Failed to upload picture. Please try again.');
      });
  });
  
  // Function to fetch data from Firebase Firestore and update Google Sheets
  function getFirestoreData() {
    // Get a reference to the "registrations" collection
    const registrationsRef = db.collection('registrations');
  
    // Fetch data from Firestore
    registrationsRef.get()
      .then(querySnapshot => {
        // Process the data
        const data = [];
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
  
        // Log or use the data as needed
        console.log(data);
  
        // After fetching data, make an HTTP request to Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbyViyOp-QS6mZSnlpnFhCrR30PWbdkhTrfRsCUQgLOF/dev', {
          method: 'GET',
        })
          .then(response => {
            console.log('Data submitted successfully!');
            alert('Registration successful!');
            registrationForm.reset();
          })
          .catch(error => {
            console.error('Error submitting data to Google Sheets:', error);
            alert('Registration failed. Please try again.');
          });
      })
      .catch(error => {
        console.error('Error fetching data from Firestore:', error);
      });
  }
  

