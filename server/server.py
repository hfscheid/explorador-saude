import pandas as pd
import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs


class ReqHandler(SimpleHTTPRequestHandler):
    tables = {
        "dengue": "dengue-2024-municipios.csv",
        "chikungunya": "chikungunya-2024-municipios.csv",
        "zika": "dengue-2024-municipios.csv",
    }

    def do_GET(self):
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)

        table = query_params.get('table', ['dengue'])[0]
        response = self.read_table(table)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('latin-1'))

    def read_table(self, tablename: str) -> dict[str, str]:
        df = pd.read_csv(
            f"../data/{self.tables[tablename]}",
            encoding='latin-1'
        )
        df.drop(["CIR", "Em Branco"], axis=1)
        return df.to_dict(orient="records")


with HTTPServer(("localhost", 8080), ReqHandler) as server:
    print("Server running in http://localhost:8080")
    server.serve_forever()
