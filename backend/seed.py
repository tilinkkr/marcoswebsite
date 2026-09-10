from app.database import SessionLocal
from app.seed_data import seed_products

if __name__ == "__main__":
    with SessionLocal() as session:
        seed_products(session)
    print("Seeded MARCOS products; no users or payments were created.")
