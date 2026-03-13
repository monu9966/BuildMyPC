BuildMyPC 💻

BuildMyPC is a full-stack web application that allows users to build custom PCs by selecting compatible components, manage builds, add them to cart, place orders, and track deliveries.

The platform provides a smooth PC configuration experience with compatibility checking, cart system, checkout, order tracking, and invoice generation.

Live Features
PC Builder
Select compatible PC components
Dynamic compatibility checking (CPU–Motherboard, RAM–Motherboard, GPU–PSU)
Real-time price calculation

Cart System
Add custom PC builds to cart
Quantity management
Remove items with smooth animation

Checkout System
Address input
Multiple payment methods
Cash on Delivery
UPI
Card Payment
Payment validation
Order confirmation spinner

Order Management
View all user orders
Order ID with copy feature
Order placed date
stimated delivery date
Delivery progress tracker:
Confirmed
Shipped
Out for Delivery
Delivered
Invoice System
Download order invoice as PDF

User System
User authentication (JWT)

Profile management
Avatar upload

Admin panel support

Tech Stack
Frontend
React.js
Vite
React Router
Context API
React Icons
Axios

Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Multer (file upload)
Other Tools
jsPDF (invoice generation)
AutoTable
CSS3

Project Structure
BuildMyPC
│
├── frontend
│   ├── components
│   ├── pages
│   ├── context
│   ├── services
│   ├── utils
│   └── assets
│
├── backend
│   ├── routes
│   ├── models
│   ├── middleware
│   └── config
│
└── README.md

Screenshots
You can add screenshots here later.

Example:

Home Page
PC Builder
Cart Page
Checkout Page
My Orders Page
Admin Panel
Installation
Clone Repository
git clone https://github.com/yourusername/buildmypc.git
Install Dependencies

Frontend
cd frontend
npm install

Backend
cd backend
npm install
Run Project

Backend
npm run dev

Frontend
npm run dev

Environment Variables
Create .env in backend:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
Future Improvements

Online payment gateway (Razorpay / Stripe)
Product images for components
Build sharing link
Build recommendation AI
Email order confirmation
Admin analytics dashboard

Author
Monu Kumar, Azhar sayyed
BSc Computer Science Student
Passionate about Full Stack Development and AI Systems

GitHub:
https://github.com/yourusername

License
This project is licensed under the MIT License.
