# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# File Structure (06/10/2025)

Webapp
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   └── images
│   │       ├── illstration_1.jpg
│   │       ├── illstration_2.jpg
│   │       ├── portrait.jpg
│   │       └── welcome.jpg
│   ├── components
│   │   ├── Tabbar.jsx
│   │   ├── basic_ui
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   └── input.jsx
│   │   └── sections
│   │       ├── Quiz.jsx
│   │       └── Section_viewer.jsx
│   ├── hooks
│   │   ├── get_course_data.js
│   │   ├── get_course_data_test.js
│   │   └── get_tg_data.js
│   ├── main.jsx
│   ├── pages
│   │   ├── Profile.jsx
│   │   ├── admin_pages
│   │   │   ├── Dashboard_admin.jsx
│   │   │   └── Data_center.jsx
│   │   ├── auth_pages
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   └── welcome_page.jsx
│   │   └── user_pages
│   │       ├── Course_modal.jsx
│   │       └── Dashboard.jsx
│   ├── style
│   │   ├── Dashboard_user.css
│   │   ├── general.css
│   │   ├── index.css
│   │   └── tabbar.css
│   └── utils
│       ├── auth_services.js
│       └── validate.js
├── server
|   ├── models
|   |   └── Course.js
|   ├── .env
|   ├── .gitignore
|   ├── index.js
|   ├── package-lock.json
|   └── package.json
└── vite.config.js