import pandas as pd
import os
csv_files = [
    "aguas_vermelhas.csv", "aimores.csv", "almenara.csv", "aracuai.csv", "araxa.csv", "bambui.csv", "barbacena.csv",
    "belo_horizonte_pampulha.csv", "belo_horizonte_cercadinho.csv", "buritis.csv", "caldas.csv", "campina_verde.csv",
    "capelinha.csv", "caratinga.csv", "chapada_gaucha.csv", "conceicao_das_alagoas.csv", "coronel_pacheco.csv",
    "curvelo.csv", "diamantina.csv", "divinopolis.csv", "dores_do_indaia.csv", "espinosa.csv", "florestal.csv",
    "formiga.csv", "governador_valadares.csv", "guanhaes.csv", "guarda-mor.csv", "ibirite_(rola_moca).csv", "itaobim.csv",
    "ituiutaba.csv", "januaria.csv", "joao_pinheiro.csv", "juiz_de_fora.csv", "machado.csv", "manhuacu.csv", "mantena.csv",
    "maria_da_fe.csv", "mocambinho.csv", "montalvania.csv", "monte_verde.csv", "montes_claros.csv", "muriae.csv",
    "nova_porteirinha_(janauba).csv", "oliveira.csv", "ouro_branco.csv", "paracatu.csv", "passa_quatro.csv", "passos.csv",
    "patos_de_minas.csv", "patrocinio.csv", "pirapora.csv", "pompeu.csv", "rio_pardo_de_minas.csv", "sacramento.csv",
    "salinas.csv", "sao_joao_del_rei.csv", "sao_romao.csv", "sao_sebastiao_do_paraiso.csv", "serra_dos_aimores.csv",
    "sete_lagoas.csv", "teofilo_otoni.csv", "timoteo.csv", "tres_marias.csv", "uberaba.csv", "uberlandia.csv", "unai.csv",
    "varginha.csv", "vicosa.csv"
]

# Liste der Städte in der Form einer Mapping-Anforderung
city_groups = [
    "Alfenas,Machado", "Guaxupé", "Itajubá", "Lavras", "Poços de Caldas", "Pouso Alegre", "São Lourenço", 
    "São Sebastião do Paraíso", "Três Corações", "Três Pontas", "Varginha", "Barbacena", "São João Del Rei", 
    "Belo Horizonte,Nova Lima,Santa Luzia", "Betim", "Contagem", "Curvelo", "Guanhães", "Itabira", "Ouro Preto", 
    "João Monlevade", "Sete Lagoas", "Vespasiano,Lagoa Santa", "Diamantina,Itamarandiba", 
    "Turmalina,Minas Novas,Capelinha", "Bom Despacho", "Formiga", "Itaúna", "Pará de Minas,Nova Serrana", 
    "Caratinga", "Coronel Fabriciano,Timóteo", "Governador Valadares", "Ipatinga", "Mantena", "Resplendor", 
    "Além Paraíba", "Carangola", "Leopoldina,Cataguases", "Muriaé", "Santos Dumont", "São João Nepomuceno,Bicas", 
    "Ubá", "Coração de Jesus", "Francisco Sá", "Janaúba,Monte Azul", "Januária", "Pirapora", "Patos de Minas", 
    "Unaí,Paracatu", "Manhuaçu", "Ponte Nova", "Viçosa", "Araçuaí", "Itaobim", "Nanuque", "Padre Paraíso", 
    "Pedra azul", "Araxá", "Frutal,Iturama", "Uberaba", "Ituiutaba", "Patrocínio,Monte Carmelo", "Uberlândia,Araguari", 
    "Manga", "João Pinheiro", "Congonhas", "Conselheiro Lafaiete", "São Gotardo", "Bocaiúva", "Montes Claros", 
    "Taiobeiras", "Divinópolis", "Lagoa da Prata,Santo Antônio do Monte", "Oliveira,Santo Antônio do Amparo", 
    "Campo Belo", "Lima Duarte", "Cássia", "Passos", "Piumhi", "Almenara,Jacinto", "Serro", "Itambacuri", 
    "Juiz de Fora", "Salinas", "Teófilo Otoni,Malacacheta", "São Francisco", "Brasília de Minas", 
    "Peçanha,São João Evangelista,Santa Maria do Suaçuí"
]
def treat(input_folder, year, name):
    ok = False    
    mapping = {}
    try:
        for group in city_groups:
            matching_files = []
            for city in group.split(","):
                for csv_file in csv_files:
                    # Überprüfen, ob der CSV-Dateiname die Stadt enthält
                    if city.lower()\
                        .replace(" ", "_")\
                        .replace('ç','c')\
                        .replace('á','a')\
                        .replace('é','e')\
                        .replace('í','i')\
                        .replace('ó','o')\
                        .replace('ú','u')\
                    in csv_file:
                        matching_files.append(csv_file)
            mapping[group] = matching_files


        ok = False
        for k, v in mapping.items():
            if name in v:
                mun = k
                ok = True
        if not ok:
            return 'not found', False
        
        df = pd.read_csv(os.path.join(input_folder, str(year), name), encoding='latin-1', skiprows=8, sep=';').fillna(',0')
        df.head(1)
        df = df[['Data', 'PRECIPITAÇÃO TOTAL, HORÁRIO (mm)']]
        df['Data'] = pd.to_datetime(df['Data'])
        df['PRECIPITAÇÃO TOTAL, HORÁRIO (mm)'] = df['PRECIPITAÇÃO TOTAL, HORÁRIO (mm)'].str.replace(',', '.').astype(float)
        df = df.groupby('Data').sum().rename(columns={'PRECIPITAÇÃO TOTAL, HORÁRIO (mm)': 'Precipitação'}).reset_index()
        start_date = pd.Timestamp(f'{year-1}-12-31')
        df['Semana'] = ((df['Data']-start_date).dt.days//7)+1
        df['Semana'] = df['Semana'].apply(lambda x: f'Semana {x:02d}')
        df.pop('Data')
        df = df.groupby('Semana').sum()
        df = df.T
        df['Município'] = mun
        df = df.reset_index()
        df = df.drop('index', axis=1)
        return df, True
    except ValueError as e:
        print(e)
        return 'not found', False