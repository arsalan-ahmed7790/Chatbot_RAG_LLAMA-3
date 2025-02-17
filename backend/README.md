# uet chatbot ..

The university admission chatbot is a useful tool designed to provide assistance and information by answering general student queries during university admissions using state-of-the-art language models and vector stores.

## Prerequisites

Before you can start using the ChatBot, make sure you have the following prerequisites installed on your system:

- Python 3.9 or higher
- Required Python packages (all packages are in requirement.txt)
  - langchain
  - faiss
  - PyPDF
  - google-generativeai

## Installation

2. Create a Python virtual environment:

   use: venv\Scripts\activate.bat

3. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

4. Create .env file for creating environment variables.
5. Add your Google API key variable in the file. You can get your API key from here https://makersuite.google.com/app/apikey
   ```bash
   GOOGLE_API_KEY="Insert your google API key here"
   gROQ_API_KEY="insert your llama 3 API key here"
   ```

## Run API on local server

1. Open cmd in the root folder and write this command to run the live server.
   ```bash
   uvicorn main:app --reload
   ```

## API endpoints

- /docs -> You will see the automatic interactive API documentation
- /llm_on_cpu -> POST Method
