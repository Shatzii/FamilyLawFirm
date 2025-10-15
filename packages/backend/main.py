from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime, timedelta

from sqlalchemy import create_engine, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped, mapped_column, Session
from passlib.context import CryptContext
from jose import jwt, JWTError

app = FastAPI(
    title="BAM FamiLex AI API",
    description="Colorado Family Law Platform with AI Integration",
    version="1.0.0"
)

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# --- Database setup ---
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local.db")
engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_db():
    Base.metadata.create_all(bind=engine)

# --- Auth ---
JWT_SECRET = os.getenv("JWT_SECRET", "devsecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

class SignupRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

def get_current_user(db: Session = Depends(get_db), token: Optional[str] = None):
    # Minimal token parsing; expects JWT string
    if not token:
        return None
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub", 0))
        if not user_id:
            return None
        return db.get(User, user_id)
    except JWTError:
        return None

@app.get("/")
async def root():
    return {
        "message": "BAM FamiLex AI API",
        "version": "1.0.0",
        "status": "online",
        "integrations": {
            "matrix": "stubbed",
            "jitsi": "stubbed",
            "docuseal": "stubbed",
            "ai_services": "stubbed",
            "colorado_forms": "stubbed"
        }
    }

@app.on_event("startup")
def on_startup():
    create_db()

@app.post("/api/auth/signup", response_model=TokenResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(access_token=token)

@app.post("/api/auth/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(access_token=token)

class MeResponse(BaseModel):
    id: int
    email: str

@app.get("/api/auth/me", response_model=MeResponse)
def me(
    authorization: Optional[str] = Header(None),
    token_q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    token = token_q
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
    user = get_current_user(db=db, token=token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return MeResponse(id=user.id, email=user.email)

@app.get("/api/forms/colorado")
async def get_colorado_forms():
    return [
        {"id": "JDF 1111", "name": "Petition for Dissolution of Marriage"},
        {"id": "JDF 1113", "name": "Parenting Plan"},
        {"id": "JDF 1360", "name": "Child Support Worksheet"},
    ]

@app.post("/api/ai/analyze-document")
async def analyze_document(file: UploadFile = File(...)):
    # Stubbed response
    return {"file": file.filename, "analysis": {"summary": "stub"}, "confidence": 0.8}

# --- Calculators ---

class ChildSupportInput(BaseModel):
    parentAIncome: float
    parentBIncome: float
    childrenCount: int
    overnightsParentA: int
    overnightsParentB: int
    extraordinaryMedical: float | None = 0
    extraordinaryExpenses: float | None = 0
    educationalExpenses: float | None = 0
    otherChildSupport: float | None = 0

@app.post("/api/calculators/child-support")
def calc_child_support(payload: ChildSupportInput):
    # Minimal mirror of frontend logic
    child_count = max(1, min(payload.childrenCount, 6))
    # Baseline schedule approximation
    schedule = {1: 600, 2: 900, 3: 1200, 4: 1500, 5: 1700, 6: 1900}
    basic_obligation = schedule.get(child_count, 1900)
    combined = payload.parentAIncome + payload.parentBIncome
    parentA_share = (payload.parentAIncome / combined) if combined else 0.5
    parentB_share = 1 - parentA_share
    base_support = basic_obligation * (combined / 5000 if combined else 1)
    a_nights = payload.overnightsParentA
    adj = 0
    if 110 <= a_nights <= 127:
        adj = 0.10
    elif 128 <= a_nights <= 142:
        adj = 0.25
    elif 143 <= a_nights <= 182:
        adj = 0.50
    elif a_nights >= 183:
        adj = 0.75
    a_obl = base_support * parentA_share
    b_obl = base_support * parentB_share
    a_adj = a_obl * (1 - adj)
    b_adj = b_obl * (1 - adj)
    monthly = max(0, a_adj - b_adj) if payload.parentAIncome > payload.parentBIncome else max(0, b_adj - a_adj)
    total_adj = (payload.extraordinaryMedical or 0) + (payload.extraordinaryExpenses or 0) + (payload.educationalExpenses or 0)
    final_monthly = round(monthly + (total_adj * parentA_share))
    return {
        "monthlySupport": final_monthly,
        "annualSupport": final_monthly * 12,
        "parentAObligation": round(a_adj),
        "parentBObligation": round(b_adj),
        "breakdown": {
            "basicObligation": basic_obligation,
            "combinedIncome": combined,
            "parentAShare": round(parentA_share, 2),
            "parentBShare": round(parentB_share, 2),
            "parentingTimeAdjustment": adj,
            "totalAdjustments": total_adj,
        },
        "coloradoCompliant": True,
        "formJDF1360Data": {},
    }

class ParentingTimeInput(BaseModel):
    regularSchedule: dict
    summerSchedule: Optional[dict] = None
    schoolBreaks: Optional[dict] = None

@app.post("/api/calculators/parenting-time")
def calc_parenting_time(payload: ParentingTimeInput):
    rs = payload.regularSchedule
    school_year_weeks = 36
    regular_overnights_a = (rs.get("weekdaysParentA", 0) * school_year_weeks) + (rs.get("weekendsParentA", 0) * school_year_weeks) + rs.get("holidaysParentA", 0)
    summer_weeks = 12
    if payload.summerSchedule and "weeksParentA" in payload.summerSchedule:
        summer_overnights_a = payload.summerSchedule.get("weeksParentA", 0) * 7
    else:
        summer_overnights_a = (rs.get("weekdaysParentA", 0) + rs.get("weekendsParentA", 0)) * (summer_weeks / 7)
    break_overnights_a = 0
    sb = payload.schoolBreaks or {}
    if sb.get("springBreakParentA"):
        break_overnights_a += 7
    if sb.get("fallBreakParentA"):
        break_overnights_a += 4
    if sb.get("winterBreakAlternating"):
        break_overnights_a += 7
    total_a = round(regular_overnights_a + summer_overnights_a + break_overnights_a)
    total_b = 365 - total_a
    pct_a = round((total_a / 365) * 100)
    pct_b = 100 - pct_a
    adj = 0
    classification = "Standard Schedule"
    if 110 <= total_a <= 127:
        adj = 0.10
        classification = "Increased Parenting Time"
    elif 128 <= total_a <= 142:
        adj = 0.25
        classification = "Substantially Equal Parenting Time"
    elif 143 <= total_a <= 182:
        adj = 0.50
        classification = "Majority Parenting Time"
    elif total_a >= 183:
        adj = 0.75
        classification = "Primary Parenting Time"
    recs: List[str] = []
    if total_a < 92:
        recs.append("Consider supervised visitation or step-up plan")
    if 128 <= total_a <= 142:
        recs.append("May qualify for shared parenting time benefits")
    if total_a >= 183:
        recs.append("Consider modification of primary residence designation")
    return {
        "annualOvernights": {"parentA": total_a, "parentB": total_b},
        "percentages": {"parentA": pct_a, "parentB": pct_b},
        "childSupportAdjustment": adj,
        "coloradoClassification": classification,
        "recommendations": recs,
    }

class AssetDivisionInput(BaseModel):
    maritalAssets: float
    maritalDebts: float
    separatePropertyA: float
    separatePropertyB: float
    maintenanceFactor: float | None = 0

@app.post("/api/calculators/asset-division")
def calc_asset_division(payload: AssetDivisionInput):
    net = payload.maritalAssets - payload.maritalDebts
    base = net / 2
    maint_adj = (payload.maintenanceFactor or 0) * net
    recs: List[str] = []
    if net < 0:
        recs.append("Consider debt allocation strategy")
    if payload.separatePropertyA > payload.separatePropertyB * 2:
        recs.append("Significant separate property disparity may affect maintenance")
    return {
        "netMaritalEstate": net,
        "equitableDistribution": {"partyA": round(base), "partyB": round(base)},
        "withMaintenance": {"partyA": round(base - maint_adj), "partyB": round(base + maint_adj)},
        "recommendations": recs,
    }

# --- Cases ---

class CaseCreate(BaseModel):
    title: str

class CaseOut(BaseModel):
    id: int
    title: str
    created_by: Optional[int] = None
    created_at: datetime

@app.get("/api/cases", response_model=List[CaseOut])
def list_cases(db: Session = Depends(get_db)):
    rows = db.query(Case).order_by(Case.created_at.desc()).all()
    return [CaseOut(id=r.id, title=r.title, created_by=r.created_by, created_at=r.created_at) for r in rows]

@app.post("/api/cases", response_model=CaseOut)
def create_case(
    payload: CaseCreate,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None),
    token_q: Optional[str] = None,
):
    token = token_q
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
    user = get_current_user(db=db, token=token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    created_by = user.id
    row = Case(title=payload.title, created_by=created_by)
    db.add(row)
    db.commit()
    db.refresh(row)
    return CaseOut(id=row.id, title=row.title, created_by=row.created_by, created_at=row.created_at)

@app.get("/api/cases/{case_id}", response_model=CaseOut)
def get_case(case_id: int, db: Session = Depends(get_db)):
    row = db.get(Case, case_id)
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return CaseOut(id=row.id, title=row.title, created_by=row.created_by, created_at=row.created_at)
