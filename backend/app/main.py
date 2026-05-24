from fastapi import FastAPI

# Importar routers
from app.routes.books import router as books_router
from app.routes.recommendations import router as recommendations_router
from app.routes.chat import router as chat_router

# Crear aplicación
app = FastAPI(
    title="Library Chatbot API",
    description="API para recomendación de libros escolares",
    version="1.0.0"
)

# Ruta principal
@app.get(
    "/",
    tags=["System"]
)
def root():

    return {
        "message": "Library Chatbot API activa"
    }

@app.get(
    "/health",
    tags=["System"]
)
def health_check():

    return {
        "status": "ok"
    }

# Conectar routers
app.include_router(books_router)
app.include_router(recommendations_router)
app.include_router(chat_router)