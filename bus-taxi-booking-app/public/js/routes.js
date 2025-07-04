import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Display all routes
export async function displayRoutes() {
  const routesContainer = document.getElementById('routes-container');
  if (!routesContainer) return;
  
  try {
    const querySnapshot = await getDocs(collection(db, "routes"));
    routesContainer.innerHTML = '';
    
    querySnapshot.forEach((doc) => {
      const route = doc.data();
      const routeElement = document.createElement('div');
      routeElement.className = 'route-card';
      routeElement.innerHTML = `
        <h3>${route.from} to ${route.to}</h3>
        <p><strong>Departure:</strong> ${route.departureTime}</p>
        <p><strong>Price:</strong> RWF ${route.price}</p>
        <p><strong>Seats available:</strong> ${route.availableSeats}</p>
        <button class="btn reserve-btn" data-id="${doc.id}">Reserve Seat</button>
      `;
      routesContainer.appendChild(routeElement);
    });
    
    // Add event listeners to reserve buttons
    document.querySelectorAll('.reserve-btn').forEach(button => {
      button.addEventListener('click', () => reserveSeat(button.dataset.id));
    });
  } catch (error) {
    console.error("Error getting routes:", error);
    routesContainer.innerHTML = '<p>Error loading routes. Please try again.</p>';
  }
}

// Initialize routes display when page loads
document.addEventListener('DOMContentLoaded', displayRoutes);
