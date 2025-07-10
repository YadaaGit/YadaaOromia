### Note that all links written here are relative to this file
### Read this file and ./ReadME.md for a better understanding of the project

# Database structure:

Two databases, one for each language "AM_courses" (for amharic) & "OR_courses" (for Affan Oromo)

Each database has 5 collections to save courses, modules, sections, quizzes and images.

Hierarchical: courses → modules → sections → quizzes

Linkage: each data has an id which will be how it will be accessed for example, if a course.module_ids = ["x","y","z"]... then we go to modules and filter them by id and then those are the modules of that course. IDs help keep documents normalized, so you can join data in code



# Data model:

Data models are saved in ./server/models

- Courses → composed of Modules
- Modules → composed of Sections (composed of components)
- Each Course and Section may link to a Quiz (with questions).
- Images are stored separately in an images collection, each with a binary buffer.

Object fields (e.g., contents & questions in each sections) to store nested content — which makes your schema more adaptable.



# ESM import resolving
set in vite.config.js → resolve → alias

# Proxy for local backend usage 
set in vite.config.js → server → proxy → api

# File structure

Static data (used outside of the webpage, e.g fav_icon) → ./public
backend → ./server
Frontend → ./src


Static data
    - Logos
    - fav_icon 

Backend
    - Models → sets what to expect from each collection
    - Routes → sets the routes of the usable apis hosted by the backend 
    - Index.js → main express.js 
    - .env → stores the SRV and non-SRV database links

Frontend
    - Hooks → all js that has contact with a third party data or function provider
    - Utils → all services (utilities) that can be used repeatedly including once provided by third party providers (Baas → firebase)
    - Lang → json files of language used to store translations 
    - Components → all custom components that can be used in more than one page, helps to make each file neat and clear
    - Assets  → all static data 
    - Pages → pages inside the webpage
    - Styles → styles used in pages and components

# Other files
./.env → stores the api link for the backend
./firebase-config.js → configures connection with firebase 
./vercel.json → configures how vercel (which the frontend is hosted) treats the project
./vite.config.js → configures how vite (which is the framework used to create the frontend) treats the project


# The app
- The web app (frontend) will only host ./index.html  →  set in ./vercel.json 
- This index.html file has a root component (that is <!-- <div id="root"></div> -->) →  set in ./index.html
- All the pages and other components will be rendered into this root component → set in ./src/main.js
- The app that is passed to this root component is wrapped in 
    - A react router component
    - A language provider (custom built in ./src/LanguageContext.jsx)
         → both set in ./src/main.js



# Scripts 

Run the following in the terminal in the root file 
- "npm run dev": start project frontend (starts Vite+React)
- "npm run server": start project backend (starts Express.js)
- "npm run build": builds project
- "npm run preview": previews project
- "npm run": view all available scripts

    → set in ./package.json 