from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError
import os
from models.lead import Lead, LeadCreate, LeadResponse, LeadStats

# Configuração do WhatsApp
WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/EL8S41oFaw54zG6rDmTuqn?mode=ac_t"

router = APIRouter(prefix="/api", tags=["leads"])

# Dependency para obter conexão com MongoDB
async def get_database():
    """
    Dependência para obter conexão com o MongoDB
    """
    from server import db
    return db

@router.post("/leads", response_model=LeadResponse)
async def create_lead(lead_data: LeadCreate, db=Depends(get_database)):
    """
    Cria um novo lead na base de dados
    
    Args:
        lead_data: Dados do formulário (email, phone, source)
        db: Conexão com MongoDB
        
    Returns:
        LeadResponse: Dados do lead criado + URL do WhatsApp
        
    Raises:
        HTTPException: Se email já existir ou houver erro de validação
    """
    try:
        # Cria objeto Lead com validação
        lead = Lead(**lead_data.dict())
        
        # Verifica se email já existe
        existing_lead = await db.leads.find_one({"email": lead.email})
        if existing_lead:
            raise HTTPException(
                status_code=400, 
                detail="E-mail já cadastrado! Verifique seu WhatsApp para entrar no grupo."
            )
        
        # Insere no MongoDB
        result = await db.leads.insert_one(lead.dict())
        
        # Retorna resposta com URL do WhatsApp
        return LeadResponse(
            id=lead.id,
            email=lead.email,
            phone=lead.phone,
            source=lead.source,
            created_at=lead.created_at,
            whatsapp_group_url=WHATSAPP_GROUP_URL,
            message="Cadastro realizado com sucesso! Você será redirecionado para o grupo do WhatsApp."
        )
        
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400, 
            detail="E-mail já cadastrado! Verifique seu WhatsApp para entrar no grupo."
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/leads", response_model=List[Lead])
async def get_leads(skip: int = 0, limit: int = 100, db=Depends(get_database)):
    """
    Lista todos os leads (para painel admin)
    
    Args:
        skip: Número de registros para pular (paginação)
        limit: Limite máximo de registros
        db: Conexão com MongoDB
        
    Returns:
        List[Lead]: Lista de leads
    """
    try:
        # Busca leads ordenados por data de criação (mais recentes primeiro)
        cursor = db.leads.find().sort("created_at", -1).skip(skip).limit(limit)
        leads = await cursor.to_list(length=limit)
        
        # Converte para modelo Pydantic
        return [Lead(**lead) for lead in leads]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar leads: {str(e)}")

@router.get("/leads/stats", response_model=LeadStats)
async def get_lead_stats(db=Depends(get_database)):
    """
    Retorna estatísticas dos leads
    
    Args:
        db: Conexão com MongoDB
        
    Returns:
        LeadStats: Estatísticas dos leads
    """
    try:
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timedelta(days=7)
        month_start = now - timedelta(days=30)
        
        # Contagem total
        total_leads = await db.leads.count_documents({})
        
        # Contagem hoje
        leads_today = await db.leads.count_documents({
            "created_at": {"$gte": today_start}
        })
        
        # Contagem última semana
        leads_this_week = await db.leads.count_documents({
            "created_at": {"$gte": week_start}
        })
        
        # Contagem último mês
        leads_this_month = await db.leads.count_documents({
            "created_at": {"$gte": month_start}
        })
        
        return LeadStats(
            total_leads=total_leads,
            leads_today=leads_today,
            leads_this_week=leads_this_week,
            leads_this_month=leads_this_month
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar estatísticas: {str(e)}")

@router.put("/leads/{lead_id}/whatsapp-joined")
async def mark_whatsapp_joined(lead_id: str, db=Depends(get_database)):
    """
    Marca que o lead entrou no grupo do WhatsApp
    
    Args:
        lead_id: ID do lead
        db: Conexão com MongoDB
        
    Returns:
        dict: Mensagem de sucesso
    """
    try:
        result = await db.leads.update_one(
            {"id": lead_id},
            {
                "$set": {
                    "whatsapp_joined": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Lead não encontrado")
            
        return {"message": "Lead marcado como membro do WhatsApp"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar lead: {str(e)}")

@router.put("/leads/{lead_id}/ebook-sent")
async def mark_ebook_sent(lead_id: str, db=Depends(get_database)):
    """
    Marca que o e-book foi enviado para o lead
    
    Args:
        lead_id: ID do lead
        db: Conexão com MongoDB
        
    Returns:
        dict: Mensagem de sucesso
    """
    try:
        result = await db.leads.update_one(
            {"id": lead_id},
            {
                "$set": {
                    "ebook_sent": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Lead não encontrado")
            
        return {"message": "E-book marcado como enviado"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar lead: {str(e)}")

@router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, db=Depends(get_database)):
    """
    Remove um lead da base de dados
    
    Args:
        lead_id: ID do lead
        db: Conexão com MongoDB
        
    Returns:
        dict: Mensagem de sucesso
    """
    try:
        result = await db.leads.delete_one({"id": lead_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Lead não encontrado")
            
        return {"message": "Lead removido com sucesso"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao remover lead: {str(e)}")