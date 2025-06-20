import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from .database import engine, Base, SessionLocal
from .models import User, Subscription, UserSubscription, SubscriptionStatus
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
CORS(app)

@app.route("/health")
def health():
    return {"status": "ok"}

@app.route("/users")
def get_users():
    db = SessionLocal()
    users = db.query(User).all()
    db.close()
    return jsonify([{"id": u.id, "username": u.username, "email": u.email} for u in users])

@app.route("/subscriptions")
def get_subscriptions():
    db = SessionLocal()
    subs = db.query(Subscription).all()
    db.close()
    return jsonify([{"id": s.id, "name": s.name, "price": s.price, "description": s.description} for s in subs])

@app.route("/users/<int:user_id>/subscriptions", methods=["GET"])
def get_user_subscriptions(user_id):
    db = SessionLocal()
    try:
        user_subs = db.query(UserSubscription).filter(UserSubscription.user_id == user_id).all()
        result = []
        for us in user_subs:
            sub = db.query(Subscription).filter(Subscription.id == us.subscription_id).first()
            result.append({
                "subscription_id": us.subscription_id,
                "subscription_name": sub.name if sub else None,
                "status": us.status.value,
                "start_date": us.start_date.isoformat(),
                "end_date": us.end_date.isoformat() if us.end_date else None
            })
        return jsonify(result)
    finally:
        db.close()

@app.route("/users/<int:user_id>/subscriptions", methods=["POST"])
def add_user_subscription(user_id):
    db = SessionLocal()
    data = request.get_json()
    subscription_id = data.get("subscription_id")
    if not subscription_id:
        return jsonify({"error": "subscription_id is required"}), 400
    try:
        # Check user and subscription exist
        if not db.query(User).filter(User.id == user_id).first() or not db.query(Subscription).filter(Subscription.id == subscription_id).first():
            return jsonify({"error": "User or Subscription not found"}), 404
        # Prevent duplicate active subscriptions
        existing = db.query(UserSubscription).filter_by(user_id=user_id, subscription_id=subscription_id).first()
        if existing:
            return jsonify({"error": "User already has this subscription"}), 409
        user_sub = UserSubscription(user_id=user_id, subscription_id=subscription_id, status=SubscriptionStatus.ACTIVE)
        db.add(user_sub)
        db.commit()
        return jsonify({"message": "Subscription added successfully"})
    except IntegrityError:
        db.rollback()
        return jsonify({"error": "Integrity error"}), 400
    finally:
        db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    port = int(os.getenv("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
