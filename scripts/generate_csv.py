from tratamento_doencas_semanas import data_processing
import pandas as pd
import os
import sys
def get_dash_data(input_path, output_path, save_res=False):
    df = pd.read_csv(input_path, sep=';',  encoding="latin-1", skiprows=3)
    idx = df[df[df.columns[0]].str.contains('Total')].index[0]
    df=df.iloc[:idx+1]
    mn, res = data_processing(df)
    mn.to_csv(output_path, index=False, encoding='latin-1')
    if save_res:
        res.to_csv(output_path.replace('municipios', 'residencias'), index=False, encoding='latin-1')



if __name__ == '__main__':
    fodler_path = sys.argv[1] if len(sys.argv) > 1 else '../data'
    years = os.listdir(fodler_path)
    for year in years:
        files = os.listdir(fodler_path + '/' + year)
        for file in files:
            if 'csv' in file and '-' not in file:
                try:
                    print(file)
                    input_path = os.path.join(fodler_path, year, file)
                    doenca = file.split('_')[0]
                    if doenca == 'chiku':
                        doenca = 'chikungunya'
                    elif doenca == 'febre':
                        doenca = 'febreamarela'

                    output_path = os.path.join(
                        fodler_path,
                        year,
                        f'{doenca}-municipios.csv'
                    )
                    get_dash_data(input_path, output_path, save_res=False)
                    print(f'File {file} processed')
                except Exception as e:
                    print('Error processing file')
                    print(e)
                    continue
    

    