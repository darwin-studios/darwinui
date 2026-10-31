"""Print a fictional DarwinUI presentation. No network requests or execution."""
import json

presentation = {
    "version": "0.1",
    "agent": {"id": "guide", "name": "Trail Guide"},
    "operations": [],
    "steps": [{"id": "plan", "title": "Prepare itinerary", "status": "completed"}],
    "results": [{"type": "text", "text": "Example itinerary: a morning walk and an afternoon museum visit."}],
}
print(json.dumps(presentation, indent=2))
