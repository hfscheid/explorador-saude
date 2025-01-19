import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

import pandas as pd


class ReqHandler(BaseHTTPRequestHandler):
    tables = {
        "dengue": "dengue-2024-municipios.csv",
        "chikungunya": "chikungunya-2024-municipios.csv",
        "zika": "dengue-2024-municipios.csv",
    }

    def add_cors_headers(self):
        """Add CORS headers to the response."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header(
            "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"
        )
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def getSeries(self, query_params: dict[str, str]):
        tables = query_params.get('table', ['dengue'])
        mun = query_params.get('mun', ['Divinópolis'])[0]
        time_init = query_params.get('tinit', ['0'])[0]
        time_end = query_params.get('tend', ['53'])[0]
        series = {'labels': [], 'datasets': []}
        for table in tables:
            municipios, seriesdf = self.filter_table(table, time_init, time_end)
            series['labels'] = list(seriesdf.columns)
            index = municipios[municipios == mun].index[0]
            weeks = [int(x) for x in seriesdf.loc[index, :].values]
            series['datasets'].append({'label': table, 'values': weeks})
        print(series)
        self.send_response(200)
        self.add_cors_headers()
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(series).encode("latin-1"))

    def getMap(self, query_params: dict[str, str]):
        table = query_params.get("table", ["dengue"])[0]
        time_init = query_params.get("tinit", ["0"])[0]
        time_end = query_params.get("tend", ["53"])[0]
        municipios, table = self.filter_table(table, time_init, time_end)
        table["total"] = table.apply(sum, axis=1)
        table["municipio"] = municipios
        table = table.loc[:, ["municipio", "total"]].to_dict(orient="records")

        self.send_response(200)
        self.add_cors_headers()
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(table).encode("latin-1"))

    def filter_table(
        self, tablename: str, time_init: str, time_end: str
    ) -> dict[str, str]:
        init_column = "Semana " + (
            f"0{time_init}" if int(time_init) < 10 else f"{time_init}"
        )
        end_column = "Semana " + (
            f"0{time_end}" if int(time_end) < 10 else f"{time_end}"
        )
        df = pd.read_csv(f"../data/{self.tables[tablename]}", encoding="latin-1")
        municipios = df["Município"].copy()
        for column in df.columns:
            if "Semana" in column:
                if init_column > column or end_column < column:
                    df = df.drop([column], axis=1)
            else:
                df = df.drop([column], axis=1)
        return municipios, df

    def do_GET(self):
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)
        if parsed_url.path == "/map":
            self.getMap(query_params)
        elif parsed_url.path == "/series":
            self.getSeries(query_params)

    def do_PUT(self):
        content_len = int(self.headers.get("Content-Length"))

    def do_OPTIONS(self):
        """Handle preflight CORS requests."""
        self.send_response(204)
        self.add_cors_headers()
        self.end_headers()


with HTTPServer(("localhost", 8080), ReqHandler) as server:
    print("Server running in http://localhost:8080")
    server.serve_forever()
