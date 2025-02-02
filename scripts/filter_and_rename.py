import os
def rename_files(filepath, filename, year, unziped_folder_path):
    if "pampulha" in filename.lower():
        new_name = "belo_horizonte_pampulha.csv"
    elif "cercadinho" in filename.lower():
        new_name = "belo_horizonte_cercadinho.csv"
    else:
        new_name = filename.split('_')[4].lower()+'.csv'
    new_name = new_name.replace(' ', '_')
    os.rename(filepath, os.path.join(unziped_folder_path, year, new_name))
    return new_name
    
def rrename_files(filepath, filename, directory, prefix):
    new_name = filename[len(prefix)+5:]  # Präfix entfernen
    new_name = new_name.replace(" ", "_")
    new_name = new_name.replace("_01-01-2024_A_31-12-2024.CSV",
                                ".csv").lower()
    new_filepath = os.path.join(directory, new_name)
    os.rename(filepath, new_filepath)
    print(f"Umbenannt: {filepath} -> {new_filepath}")

def clean(directory, prefix):
    try:
        # Überprüfen, ob das Verzeichnis existiert
        if not os.path.exists(directory):
            print(f"Das Verzeichnis {directory} existiert nicht.")
            return

        # Dateien im Verzeichnis durchgehen
        for filename in os.listdir(directory):
            filepath = os.path.join(directory, filename)

            # Nur Dateien berücksichtigen und prüfen, ob sie mit dem Präfix beginnen
            if os.path.isfile(filepath):
                if filename.startswith(prefix):
                    rename_files(filepath, filename, directory, prefix)
                else:
                    os.remove(filepath)

        print("Vorgang abgeschlossen.")
    except Exception as e:
        print(f"Ein Fehler ist aufgetreten: {e}")


if __name__ == "__main__":
    directory = "data"  # Ersetzen Sie dies durch den tatsächlichen Verzeichnispfad
    prefix = "INMET_SE_MG_"
    clean(directory, prefix)
