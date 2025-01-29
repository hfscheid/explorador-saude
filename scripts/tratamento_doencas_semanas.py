#!/usr/bin/env python
import pandas as pd
import re
import sys



def data_processing_henrique(df):

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


        residencias.loc[:, 'CIR'] = residencias['Reg Saúde (CIR)/Municíp Res']\
                .apply(lambda x: x.split('/')[0])
        residencias.loc[:, 'Residência'] = residencias['Reg Saúde (CIR)/Municíp Res']\
                .apply(lambda x: x.split('/')[-1])
        residencias = residencias.drop('Reg Saúde (CIR)/Municíp Res', axis=1)
        residencias = residencias.set_index('Residência')

        return municipios, residencias
# Compare this snippet from server/server.py:

def data_processing(df):
        for column in df.columns[1:]:
                df[column] = df[column].apply(lambda x: x if x != '-' else 0)
                df[column] = df[column].astype(int)
        pattern = r'^\d+\s[A-Za-z]+(\/[A-Za-z]+)*'

        df.iloc[:, 0] = df.iloc[:, 0].replace('/', ',', regex=True)

        for index, row in df.iterrows():
                if re.match(pattern, row.iloc[0]):
                        last_number = row.iloc[0].split()[0].strip(' ')
                        df.at[index, df.columns[0]] = \
                        row.iloc[0].replace(
                                last_number+' ',
                                last_number+'M/'
                        )
                else:
                        df.at[index, df.columns[0]] = \
                        row.iloc[0].replace(
                                '.....  ',
                                last_number+'/'
                        )
        pattern = r'^\d+M\/[A-Za-z]+(\/[A-Za-z]+)*'
        municipios = df[df[df.columns[0]]
                        .str
                        .match(pattern)].copy()
        municipios[df.columns[0]] = \
                municipios[df.columns[0]]\
                .replace('M/', '/', regex=True)
        residencias = df[~df[df.columns[0]]
                        .str
                        .match(pattern)]
        municipios['CIR'] = municipios[df.columns[0]]\
                .apply(lambda x: x.split('/')[0])
        municipios['Município'] = municipios[df.columns[0]]\
                .apply(lambda x: x.split('/')[-1])
        municipios = municipios.drop(df.columns[0], axis=1)
        municipios = municipios.set_index('Município')

        residencias = residencias.copy()
        residencias.loc[:, 'CIR'] = residencias[df.columns[0]]\
                .apply(lambda x: x.split('/')[0])
        residencias.loc[:, 'Residência'] = residencias[df.columns[0]]\
                .apply(lambda x: x.split('/')[-1])
        residencias = residencias.drop(df.columns[0], axis=1)
        residencias = residencias.set_index('Residência')

        municipios =  municipios.reset_index()
        residencias = residencias.reset_index()

        return municipios, residencias

if __name__ == '__main__':
        filename = sys.argv[1]
        df = pd.read_csv(filename, sep=";", encoding="latin-1")
        municipios, residencias = data_processing(df)
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