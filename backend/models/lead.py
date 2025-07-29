from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional
from datetime import datetime
import uuid
import re

class Lead(BaseModel):
    """
    Modelo para representar um lead capturado na landing page
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    phone: str
    source: str = Field(default="landing_page")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    whatsapp_joined: bool = Field(default=False)
    ebook_sent: bool = Field(default=False)
    
    @validator('phone')
    def validate_phone(cls, v):
        """
        Valida formato do telefone brasileiro
        Aceita formatos: (11) 99999-9999, 11999999999, +5511999999999
        """
        # Remove espaços e caracteres especiais
        phone_clean = re.sub(r'[^\d+]', '', v)
        
        # Verifica se tem pelo menos 10 dígitos (formato mínimo brasileiro)
        if len(phone_clean) < 10:
            raise ValueError('Telefone deve ter pelo menos 10 dígitos')
        
        # Verifica se não tem mais de 13 dígitos (com código do país)
        if len(phone_clean) > 13:
            raise ValueError('Telefone inválido')
            
        return phone_clean

class LeadCreate(BaseModel):
    """
    Modelo para criação de lead (dados do formulário)
    """
    email: EmailStr
    phone: str
    source: Optional[str] = "landing_page"

class LeadResponse(BaseModel):
    """
    Modelo para resposta da API após criação do lead
    """
    id: str
    email: str
    phone: str
    source: str
    created_at: datetime
    whatsapp_group_url: str
    message: str

class LeadStats(BaseModel):
    """
    Modelo para estatísticas dos leads
    """
    total_leads: int
    leads_today: int
    leads_this_week: int
    leads_this_month: int