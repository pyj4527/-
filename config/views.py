from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404


FRONTEND_DIR = settings.BASE_DIR / "frontend"


def frontend(request, path="index.html"):
    requested_path = (FRONTEND_DIR / path).resolve()

    if not requested_path.is_relative_to(FRONTEND_DIR.resolve()):
        raise Http404("File not found")

    if requested_path.is_dir():
        requested_path = requested_path / "index.html"

    if not requested_path.exists():
        raise Http404("File not found")

    return FileResponse(requested_path.open("rb"))
