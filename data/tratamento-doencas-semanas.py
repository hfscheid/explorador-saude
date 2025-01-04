#!/usr/bin/env python
import pandas as pd
import re
import sys

filename = sys.argv[1]

df = pd.read_csv(filename, sep=";", encoding="latin-1")

for column in df.columns[1:]:
    df[column] = df[column].replace('-', '0')
    df[column] = pd.to_numeric(df[column], errors='coerce')

pattern = r'^\d+\s[A-Za-z]+(\/[A-Za-z]+)*'
df['Reg Saúde (CIR)/Municíp Res'] = \
        df['Reg Saúde (CIR)/Municíp Res'].replace('/', ',', regex=True)

for index, row in df.iterrows():
    if re.match(pattern, row['Reg Saúde (CIR)/Municíp Res']):
        last_number = \
                row['Reg Saúde (CIR)/Municíp Res'].split()[0].strip(' ')
        df.at[index, 'Reg Saúde (CIR)/Municíp Res'] = \
            row['Reg Saúde (CIR)/Municíp Res'].replace(
                    last_number+' ',
                    last_number+'M/'
            )
    else:
        df.at[index, 'Reg Saúde (CIR)/Municíp Res'] = \
            row['Reg Saúde (CIR)/Municíp Res'].replace(
                    '.....  ',
                    last_number+'/'
            )

pattern = r'^\d+M\/[A-Za-z]+(\/[A-Za-z]+)*'
municipios = df[df['Reg Saúde (CIR)/Municíp Res']
                .str
                .match(pattern)].copy()
municipios['Reg Saúde (CIR)/Municíp Res'] = \
        municipios['Reg Saúde (CIR)/Municíp Res']\
        .replace('M/', '/', regex=True)
residencias = df[~df['Reg Saúde (CIR)/Municíp Res']
                 .str
                 .match(pattern)]

municipios['CIR'] = municipios['Reg Saúde (CIR)/Municíp Res']\
        .apply(lambda x: x.split('/')[0])
municipios['Município'] = municipios['Reg Saúde (CIR)/Municíp Res']\
        .apply(lambda x: x.split('/')[-1])
municipios = municipios.drop('Reg Saúde (CIR)/Municíp Res', axis=1)
municipios = municipios.set_index('Município')


residencias['CIR'] = residencias['Reg Saúde (CIR)/Municíp Res']\
        .apply(lambda x: x.split('/')[0])
residencias['Residência'] = residencias['Reg Saúde (CIR)/Municíp Res']\
        .apply(lambda x: x.split('/')[-1])
residencias = residencias.drop('Reg Saúde (CIR)/Municíp Res', axis=1)
residencias = residencias.set_index('Residência')


municipios.to_csv(
        filename.removesuffix('.csv') +
        '-municipios.csv',
        encoding='latin-1'
)
residencias.to_csv(
        filename.removesuffix('.csv') +
        '-residencias.csv',
        encoding='latin-1'
)
