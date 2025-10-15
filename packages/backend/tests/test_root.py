from fastapi.testclient import TestClient
from packages.backend.main import app

client = TestClient(app)


def test_root_health():
    r = client.get("/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "online"
    assert data.get("message")
