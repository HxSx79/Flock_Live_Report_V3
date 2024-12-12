from datetime import datetime
from typing import Dict, List

class ProductionTracker:
    def __init__(self):
        self.line1_data = {
            'part': {'number': '', 'name': ''},
            'production': {'quantity': 0, 'delta': 0, 'pph': 0},
            'scrap': {'total': 0, 'rate': 0}
        }
        self.line2_data = {
            'part': {'number': '', 'name': ''},
            'production': {'quantity': 0, 'delta': 0, 'pph': 0},
            'scrap': {'total': 0, 'rate': 0}
        }
        self.totals = {
            'quantity': 0,
            'delta': 0,
            'scrap': 0,
            'scrapRate': 0
        }
        self.production_details = []

    def update_line_data(self, line_number: int, detections: List[Dict]) -> None:
        # Update production data based on detections
        # This will be implemented when we add the detection logic
        pass

    def get_all_data(self) -> Dict:
        return {
            'line1_part': self.line1_data['part'],
            'line1_production': self.line1_data['production'],
            'line1_scrap': self.line1_data['scrap'],
            'line2_part': self.line2_data['part'],
            'line2_production': self.line2_data['production'],
            'line2_scrap': self.line2_data['scrap'],
            'total_quantity': self.totals['quantity'],
            'total_delta': self.totals['delta'],
            'total_scrap': self.totals['scrap'],
            'average_scrap_rate': self.totals['scrapRate']
        }