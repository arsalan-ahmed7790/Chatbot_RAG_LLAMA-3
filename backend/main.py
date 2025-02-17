from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
import google.generativeai as genai
from langchain_community.vectorstores.faiss import FAISS
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.messages import HumanMessage
from langchain.chains import create_history_aware_retriever
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Setting Google API Key
load_dotenv()
os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
groq_api_key=os.getenv('GROQ_API_KEY')

# Path of vectore database
DB_FAISS_PATH = 'vectorstore/db_faiss'


chat_history=[]

#Loading the model
def load_llm():
    llm=ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192", temperature=0.6)
    return llm



def history_aware_retriever(retriever , llm):
    
    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
    )
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )
    
    return history_aware_retriever

# Setting QA chain
def get_conversational_chain(history_aware_retriever, llm):


    
    qa_system_prompt = """You are an assistant of our UET University for question-answering tasks to help students and users for their questions and queries. \
    Use the following pieces of context to answer the question. \
    If you don't know the answer, just appologize that you don't know. \
    Keep the answer creative, concise and well formatted with a professional and friendly tone.\
    Always appreciate for reaching out and offer students more help in the end and call to action.
    give short answer and also change line when answer is in points. 
    alway give short one or two line answer to greating message.
    {context}"""
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )


    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    
    return rag_chain

# User input function
def user_input(user_question):
    
    # Set google embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
    
    # Loading saved vectors from local path
    db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
    retriever = db.as_retriever()
    
    llm = load_llm()
    
    history_retriever = history_aware_retriever(retriever, llm)
    # docs = db.similarity_search(user_question)
    
    rag_chain = get_conversational_chain(history_retriever, llm)
    
    response = rag_chain.invoke({"input": user_question, "chat_history": chat_history})
    chat_history.extend([HumanMessage(content=user_question), response["answer"]])
    print(chat_history)

    return response

#Pydantic object
class validation(BaseModel):
    prompt: str
    
#Fast API
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# API endpoint (POST Request)
@app.post("/llm_on_cpu")
async def final_result(item: validation):
        response = user_input(item.prompt)
        return response

# Dialogflow Webhook endpoint
@app.post("/dialogflow_webhook")
async def dialogflow_webhook(request: Request):
    body = await request.json()
    user_question = body["queryResult"]["queryText"]
    response = user_input(user_question)
    fulfillment_text = response['answer']
    return {
        "fulfillmentText": fulfillment_text,
        "source": "your_project_name"
    }
