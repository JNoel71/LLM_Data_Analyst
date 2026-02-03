# LLM_Data_Analyst

### Setup
* Navigate to the backend folder and start the FastAPI server using `uvicorn app:app --reload`
* Navigate to the frontend folder and call `npm install` followed by `npm run dev`
* The backend folder will require a sandbox.py file that includes the variable `API_KEY`, which links to Google Gemini.

### Overview

This is a prototype LLM-based React app that allows users to upload files and have Google Gemini interact with them. The app was built with a number of react libraries, Python (FastAPI), and Google Gemini's Python API.

<img width="1813" height="1221" alt="Screenshot 2026-02-03 181914" src="https://github.com/user-attachments/assets/dcd94e6c-289c-4a7c-816e-6f3e13357a02" />

#### Abilities
* The frontend and backend interact through Python's FastAPI module.
* The app only has the ability to interact with CSV files. It outputs its response in markdown, which is then formatted by the frontend.
* The app uses UUIDs to uniquely identify each chat; therefore, you can leave a chat and return to it through the notebook button on the right side of the screen. <img width="1808" height="1218" alt="Screenshot 2026-02-03 182038" src="https://github.com/user-attachments/assets/02fefd6f-33dc-40a8-8906-bf492e7a1ee0" />
