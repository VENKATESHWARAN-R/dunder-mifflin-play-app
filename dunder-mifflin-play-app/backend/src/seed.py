import logging
from faker import Faker
from datetime import datetime
import random
from .database import SessionLocal, engine, Base
from .models import User, Subscription, UserSubscription, SubscriptionStatus

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")
fake = Faker()

NUM_USERS = 100
NUM_SUBSCRIPTION_PLANS = 5
MAX_SUBSCRIPTIONS_PER_USER = 3

PLANS = [
    {"name": "Basic SD", "price": 5.99, "description": "Standard Definition streaming, 1 screen"},
    {"name": "Standard HD", "price": 9.99, "description": "High Definition streaming, 2 screens"},
    {"name": "Premium 4K", "price": 15.99, "description": "Ultra HD/4K streaming, 4 screens"},
    {"name": "Family Plan", "price": 19.99, "description": "Family plan with multiple profiles"},
    {"name": "Annual Plan", "price": 99.99, "description": "Annual subscription with a discount"},
]

def seed():
    logger.info("Creating tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    # Seed plans
    for plan in PLANS[:NUM_SUBSCRIPTION_PLANS]:
        if not db.query(Subscription).filter_by(name=plan["name"]).first():
            db.add(Subscription(**plan))
    db.commit()
    plans = db.query(Subscription).all()
    # Seed users
    for _ in range(NUM_USERS):
        username = fake.unique.user_name()
        email = fake.unique.email()
        if not db.query(User).filter_by(email=email).first():
            db.add(User(username=username, email=email))
    db.commit()
    users = db.query(User).all()
    # Seed user subscriptions
    for user in users:
        for _ in range(random.randint(1, MAX_SUBSCRIPTIONS_PER_USER)):
            plan = random.choice(plans)
            if not db.query(UserSubscription).filter_by(user_id=user.id, subscription_id=plan.id).first():
                status = random.choice(list(SubscriptionStatus))
                db.add(UserSubscription(user_id=user.id, subscription_id=plan.id, status=status, start_date=datetime.utcnow()))
    db.commit()
    db.close()
    logger.info("Seeding complete.")

if __name__ == "__main__":
    seed()
