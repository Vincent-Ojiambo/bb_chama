Ladies Beyond Borders · Chama Management System
===========================================

Overview
--------
Ladies Beyond Borders is a client-side web application for managing chama-style savings groups. The interface includes membership management, transaction summaries, loans, investments, and welfare support modules. The project is built with plain HTML, CSS, and JavaScript.

Features
--------
- Responsive landing page with desktop and mobile navigation
- Member login/register workflow for simulated authentication
- Dynamic page rendering and route handling with `router.js`
- Mock data features for transactions, loans, investments, members, and events
- Modal dialogs and toast notifications for interaction feedback
- Mobile sidebar menu and responsive layout support

Project Structure
-----------------
- `index.html` - main application shell with header, mobile sidebar, modal, toast container, and footer
- `css/style.css` - visual styles, responsive layout, buttons, header, and footer design
- `js/router.js` - simple route registry and navigation logic
- `js/app.js` - main application logic, page rendering, event handling, and mock data

How to Use
----------
1. Open `index.html` in a browser.
2. Use the header nav or the mobile sidebar to switch sections.
3. Click `Login` or `Join Now` to simulate member interactions.
4. Explore the members section after authentication.

Customization
-------------
- Update page content and layout in `index.html`.
- Extend the page rendering logic in `js/app.js`.
- Modify colors, spacing, and responsive behavior in `css/style.css`.

Notes
-----
- This project does not include a backend server; all data is stored in browser memory and mock arrays.
- The application uses Font Awesome for icons and Google Fonts for typography.
