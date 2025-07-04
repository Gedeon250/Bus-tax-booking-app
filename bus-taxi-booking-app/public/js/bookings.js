import { db, auth } from './firebase.js';
import { collection, addDoc, doc, updateDoc, increment, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Reserve a seat on a route
export async function reserveSeat(routeId) {
  if (!auth.currentUser) {
    alert('Please log in to reserve a seat.');
    window.location.href = 'login.html';
    return;
  }
  
  try {
    // Get route reference
    const routeRef = doc(db, "routes", routeId);
    
    // Create booking
    await addDoc(collection(db, "bookings"), {
      userId: auth.currentUser.uid,
      routeId: routeId,
      bookingDate: new Date(),
      status: 'reserved'
    });
    
    // Update available seats
    await updateDoc(routeRef, {
      availableSeats: increment(-1)
    });
    
    alert('Seat reserved successfully!');
  } catch (error) {
    console.error("Error reserving seat:", error);
    alert('Failed to reserve seat. Please try again.');
  }
}

// Display user's bookings
export async function displayUserBookings() {
  const bookingsContainer = document.getElementById('bookings-container');
  if (!bookingsContainer || !auth.currentUser) return;
  
  try {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", auth.currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    bookingsContainer.innerHTML = '';
    
    if (querySnapshot.empty) {
      bookingsContainer.innerHTML = '<p>You have no bookings yet.</p>';
      return;
    }
    
    querySnapshot.forEach(async (bookingDoc) => {
      const booking = bookingDoc.data();
      const routeDoc = await getDoc(doc(db, "routes", booking.routeId));
      const route = routeDoc.data();
      
      const bookingElement = document.createElement('div');
      bookingElement.className = 'booking-card';
      bookingElement.innerHTML = `
        <h4>${route.from} to ${route.to}</h4>
        <p>Departure: ${route.departureTime}</p>
        <p>Price: RWF ${route.price}</p>
        <p>Status: ${booking.status}</p>
      `;
      bookingsContainer.appendChild(bookingElement);
    });
  } catch (error) {
    console.error("Error getting bookings:", error);
    bookingsContainer.innerHTML = '<p>Error loading bookings. Please try again.</p>';
  }
}
