import os
import zipfile
import sys
from filter_and_rename import rename_files
from agregate import treat
import pandas as pd
def unzip_files(folder_path='pluvi', unziped_folder_path='pluvi_unziped', prefix='INMET_SE_MG_', data_folder='../data'):
    dfs = []
    zips = os.listdir('pluvi')
    os.makedirs(unziped_folder_path, exist_ok=True)
    for zip_file in zips:
        if not zip_file.endswith('.zip'):
            continue
        year = zip_file.split('.')[0]
        os.makedirs(os.path.join(unziped_folder_path, year), exist_ok=True)
        with zipfile.ZipFile(os.path.join(folder_path, zip_file), 'r') as zip_ref:
            csvs = zip_ref.namelist()
            for csv in csvs:
                print(csv)
                if prefix in csv:
                    file_name = os.path.basename(csv)
                    destination_path = os.path.join(unziped_folder_path, year, file_name)
                    with open(destination_path, 'wb') as f:
                        f.write(zip_ref.read(csv))
                    new_name = rename_files(destination_path, file_name, year, unziped_folder_path)
                    df, response = treat(unziped_folder_path, year, new_name)
                    if response:
                        dfs.append(df)
        total = pd.concat(dfs)
        total.to_csv(os.path.join(data_folder,year,f'pluvio-municipios.csv'), index=False, encoding='latin-1')

if __name__ == '__main__':
    if len(sys.argv) < 3:
        folder_path = 'pluvi'
        unziped_folder_path = 'pluvi_unziped'
        unzip_files(folder_path, unziped_folder_path)
    else:
        folder_path = sys.argv[1]
        unziped_folder_path = sys.argv[2]
        unzip_files(folder_path, unziped_folder_path)