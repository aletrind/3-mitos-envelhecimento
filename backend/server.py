from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Importa as rotas de leads
from routes.leads import router as leads_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(
    title="Vida Ativa 50+ API",
    description="API para captura de leads da landing page",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Rota básica de health check
@api_router.get("/")
async def root():
    """
    Health check endpoint
    """
    return {"message": "Vida Ativa 50+ API funcionando!", "status": "healthy"}

# Health check específico para database
@api_router.get("/health")
async def health_check():
    """
    Verifica se a API e o banco estão funcionando
    """
    try:
        # Testa conexão com MongoDB
        await db.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "message": "API e banco de dados funcionando normalmente"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

# Include the leads router
app.include_router(leads_router)

# Include the basic API router
app.include_router(api_router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """
    Evento executado na inicialização da aplicação
    """
    logger.info("🚀 Vida Ativa 50+ API iniciada")
    logger.info(f"📊 Conectado ao MongoDB: {mongo_url}")
    
    # Cria índices únicos para email
    try:
        await db.leads.create_index("email", unique=True)
        logger.info("✅ Índice único criado para email")
    except Exception as e:
        logger.warning(f"⚠️ Erro ao criar índice: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """
    Evento executado no encerramento da aplicação
    """
    logger.info("🔻 Encerrando Vida Ativa 50+ API")
    client.close()
    logger.info("✅ Conexão com MongoDB encerrada")