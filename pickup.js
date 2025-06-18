
    const firebaseConfig = {
      apiKey: "AIzaSyD3AwWfYWyIvckEYNhHGDlNUjPLDOuNJ_g",
      authDomain: "free-food-radar-f2aa6.firebaseapp.com",
      projectId: "free-food-radar-f2aa6",
      storageBucket: "free-food-radar-f2aa6.appspot.com",
      messagingSenderId: "655125526733",
      appId: "1:655125526733:web:ad9533b17df00417051184",
      measurementId: "G-CWDKZ5NDR4"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    function fetchFoodItems() {
      const now = new Date();
      const cutoff = new Date(now.getTime() - 12 * 60 * 60 * 1000);

      db.collection("donated_food")
        .where("createdAt", ">=", firebase.firestore.Timestamp.fromDate(cutoff))
        .get()
        .then(snapshot => {
          const list = document.getElementById("foodList");
          list.innerHTML = "";
          snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement("div");
            div.innerHTML = `
              <h3>${data.foodItem}</h3>
              <p><strong>Quantity:</strong> ${data.quantity}</p>
              <p><strong>Location:</strong> ${data.location}</p>
              <p><strong>Contact:</strong> ${data.contact}</p>
              <button onclick="fillPickupForm('${doc.id}')">Get Food</button>
            `;
            list.appendChild(div);
          });
        });
    }

    function fillPickupForm(id) {
      const pickupDetails = prompt("Enter your pickup time & identity proof");
      if (!pickupDetails) return;

      db.collection("donated_food").doc(id).delete().then(() => {
        alert("Pickup confirmed! Food removed from list.");
        fetchFoodItems();
      });
    }

    window.onload = fetchFoodItems;
