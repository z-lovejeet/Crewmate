import logging
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from google.cloud import firestore
from ..config.settings import get_settings

logger = logging.getLogger(__name__)

_db: Optional[firestore.Client] = None
_in_memory_store: Dict[str, Dict[str, Any]] = {}

def get_firestore_db() -> Optional[firestore.Client]:
    """Get or initialize Firestore client with graceful fallback."""
    global _db
    if _db is None:
        try:
            settings = get_settings()
            _db = firestore.Client(project=settings.GCP_PROJECT_ID)
            logger.info(f"Connected to Google Cloud Firestore (project={settings.GCP_PROJECT_ID})")
        except Exception as e:
            logger.warning(f"Firestore connection failed ({e}). Falling back to active in-memory state store.")
            _db = None
    return _db


# Universal CRUD operations — all sync Firestore I/O runs in a thread pool via asyncio.to_thread
async def save_document(collection: str, doc_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Save or update document in Firestore or fallback store."""
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    if "created_at" not in data:
        data["created_at"] = data["updated_at"]

    db = get_firestore_db()
    if db:
        try:
            def _write():
                doc_ref = db.collection(collection).document(doc_id)
                doc_ref.set(data, merge=True)
            await asyncio.to_thread(_write)
            return data
        except Exception as e:
            logger.error(f"Firestore write error on {collection}/{doc_id}: {e}")

    # In-memory fallback
    if collection not in _in_memory_store:
        _in_memory_store[collection] = {}
    if doc_id in _in_memory_store[collection]:
        _in_memory_store[collection][doc_id].update(data)
    else:
        _in_memory_store[collection][doc_id] = data
    return _in_memory_store[collection][doc_id]


async def get_document(collection: str, doc_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve document by ID."""
    db = get_firestore_db()
    if db:
        try:
            def _read():
                doc_ref = db.collection(collection).document(doc_id)
                doc = doc_ref.get()
                if doc.exists:
                    return doc.to_dict()
                return None
            return await asyncio.to_thread(_read)
        except Exception as e:
            logger.error(f"Firestore read error on {collection}/{doc_id}: {e}")

    # In-memory fallback
    return _in_memory_store.get(collection, {}).get(doc_id)


async def list_documents(collection: str, limit: int = 50, order_by: Optional[str] = "created_at", descending: bool = True) -> List[Dict[str, Any]]:
    """List documents in a collection."""
    db = get_firestore_db()
    if db:
        try:
            def _list():
                query = db.collection(collection)
                if order_by:
                    query = query.order_by(order_by, direction=firestore.Query.DESCENDING if descending else firestore.Query.ASCENDING)
                docs = query.limit(limit).stream()
                results = []
                for d in docs:
                    item = d.to_dict()
                    item["id"] = d.id
                    results.append(item)
                return results
            results = await asyncio.to_thread(_list)
            if results:
                return results
        except Exception as e:
            logger.error(f"Firestore list error on {collection}: {e}")

    # In-memory fallback
    items = list(_in_memory_store.get(collection, {}).values())
    if order_by:
        items.sort(key=lambda x: x.get(order_by, ""), reverse=descending)
    return items[:limit]


async def query_documents(collection: str, field: str, op: str, value: Any, limit: int = 50) -> List[Dict[str, Any]]:
    """Query documents with a filter condition."""
    db = get_firestore_db()
    if db:
        try:
            def _query():
                query = db.collection(collection).where(field, op, value).limit(limit)
                docs = query.stream()
                results = []
                for d in docs:
                    item = d.to_dict()
                    item["id"] = d.id
                    results.append(item)
                return results
            results = await asyncio.to_thread(_query)
            if results:
                return results
        except Exception as e:
            logger.error(f"Firestore query error on {collection} where {field} {op} {value}: {e}")

    # In-memory fallback
    items = list(_in_memory_store.get(collection, {}).values())
    filtered = []
    for item in items:
        val = item.get(field)
        if op == "==" and val == value:
            filtered.append(item)
        elif op == "!=" and val != value:
            filtered.append(item)
        elif op == "in" and isinstance(value, list) and val in value:
            filtered.append(item)
    return filtered[:limit]


async def delete_document(collection: str, doc_id: str) -> bool:
    """Delete a document."""
    db = get_firestore_db()
    if db:
        try:
            def _delete():
                db.collection(collection).document(doc_id).delete()
            await asyncio.to_thread(_delete)
            return True
        except Exception as e:
            logger.error(f"Firestore delete error on {collection}/{doc_id}: {e}")

    if collection in _in_memory_store and doc_id in _in_memory_store[collection]:
        del _in_memory_store[collection][doc_id]
        return True
    return False
