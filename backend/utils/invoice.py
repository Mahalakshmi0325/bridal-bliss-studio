from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from typing import Any


def build_invoice(booking: dict[str, Any], billing: dict[str, Any] | None) -> dict[str, Any]:
    now = datetime.now(timezone.utc)
    invoice_id = f"INV-{booking['id']}-{now.strftime('%Y%m%d%H%M%S')}"
    amount = None
    payment_status = None
    if billing:
        amount = str(Decimal(str(billing.get("amount", "0"))))
        payment_status = billing.get("payment_status")
    return {
        "invoice_id": invoice_id,
        "generated_at": now.isoformat(),
        "booking_id": booking["id"],
        "customer_user_id": booking["user_id"],
        "artist_id": booking["artist_id"],
        "date": booking["date"].isoformat() if hasattr(booking["date"], "isoformat") else str(booking["date"]),
        "location": booking.get("location"),
        "style": booking.get("style"),
        "status": booking.get("status"),
        "amount": amount,
        "payment_status": payment_status,
        "lines": [
            {
                "description": f"Bridal service booking ({booking.get('style') or 'N/A'})",
                "quantity": 1,
                "unit_price": amount,
                "total": amount,
            }
        ]
        if amount is not None
        else [],
    }
