const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');
const cors = require('cors');

const app = express();
app.use(cors({ origin: ['https://beyondpure.org', 'http://beyondpure.org'] })); // Restrict to your domain
app.use(express.json());

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCMoxOPIkZf-3eDRmsJS4xucsJCksf6jE4",
  authDomain: "beyond-wellness-reviews.firebaseapp.com",
  projectId: "beyond-wellness-reviews",
  storageBucket: "beyond-wellness-reviews.firebasestorage.app",
  messagingSenderId: "13998901283",
  appId: "1:13998901283:web:6d9a23973bb6ecfa0fc996",
  measurementId: "G-M3158Z96F3"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Endpoint to fetch reviews
app.get('/reviews', async (req, res) => {
  try {
    const productId = req.query.product_id;
    if (!productId) {
      return res.status(400).json({ error: 'product_id is required' });
    }

    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('product_id', '==', productId));
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ message: 'Reviews fetched successfully', reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});