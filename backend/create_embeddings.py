from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores.faiss import FAISS
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Setting path for input data files
DATA_PATH = 'data/'

# Path for vectorstore to store text embeddings made from the data
DB_FAISS_PATH = 'vectorstore/db_faiss'

# Google Gemini API key setup
load_dotenv()
os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Create vector database
def create_vector_db():
    # Load the PDF documents
    loader = DirectoryLoader(DATA_PATH, glob='*.pdf', loader_cls=PyPDFLoader)
    documents = loader.load()
    
    print(f"Loaded {len(documents)} documents")
    
    # Split the text into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)
    
    print(f"Split into {len(texts)} chunks")
    
    # Using Google Generative AI embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    # Batch processing to avoid API limit issues
    all_embeddings = []
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i + batch_size]
        print(f"Processing batch {i // batch_size + 1}/{(len(texts) // batch_size) + 1}")
        try:
            batch_embeddings = embeddings.embed_documents([text.page_content for text in batch_texts])
            all_embeddings.extend(batch_embeddings)
        except Exception as e:
            print(f"Error processing batch {i // batch_size + 1}: {e}")
    
    if len(all_embeddings) != len(texts):
        print(f"Mismatch in number of embeddings ({len(all_embeddings)}) and text chunks ({len(texts)})")
    
    # Converting all the chunks into text embeddings (Converting text into vectors)
    # After text is converted into vectors, it can be used for many tasks like classifications etc.
    text_embeddings = list(zip([text.page_content for text in texts], all_embeddings))
    db = FAISS.from_embeddings(text_embeddings, embeddings)
    
    # Saving the embeddings in the vector store
    db.save_local(DB_FAISS_PATH)
    print("Successfully made and saved text embeddings!")

if __name__ == "__main__":
    create_vector_db()
