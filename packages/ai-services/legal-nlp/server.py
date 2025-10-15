from fastapi import FastAPI

app = FastAPI(title="Legal NLP Service")

@app.get("/")
async def root():
    return {"status": "online", "service": "legal-nlp"}
