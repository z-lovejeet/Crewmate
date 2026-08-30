import io
from pypdf import PdfReader

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extracts text from a PDF file with fallback for plaintext streams."""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        if text.strip():
            return text
    except Exception:
        pass
    
    # Fallback to UTF-8 plaintext decode
    try:
        return pdf_bytes.decode("utf-8", errors="ignore")
    except Exception:
        return ""

