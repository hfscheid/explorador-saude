import os
import shutil

doencas = ['chiku', 'dengue', 'febre', 'zika']
path = "/mnt/c/Users/gusta/Downloads"
for doenca in doencas:
    data_dir = os.path.join(path, doenca)
    datas = os.listdir(data_dir)
    for d in datas:
        ano = d.split('.')[0].split('_')[-1]
        print(ano)
        os.makedirs(os.path.join('data', str(ano)), exist_ok=True)
        shutil.copy(os.path.join(data_dir, d), os.path.join('data', ano, d))
        