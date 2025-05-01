import os
from pathlib import Path
import shutil

DATASOURCE = Path(__file__).resolve().parent.parent.parent / 'DataSources'

# FolderUtils class
class FolderUtils:

    # create_folder method
    @staticmethod
    def create_folder(folder_name):
        try:
            folder_path = Path(f"{DATASOURCE}/{folder_name}")
            folder_path.mkdir(parents=True, exist_ok=True)
        except Exception as e:
            return str(e)
        return str(folder_path)
    
    # rename_folder method
    @staticmethod
    def rename_folder(old_folder_name, new_folder_name):
        try:
            old_folder_path = Path(f"{DATASOURCE}/{old_folder_name}")
            new_folder_path = Path(f"{DATASOURCE}/{new_folder_name}")
            old_folder_path.rename(new_folder_path)
        except Exception as e:
            return str(e)
        return str(new_folder_path)
    
    # delete_folder method
    @staticmethod
    def delete_folder(folder_path):
        try:
            if os.path.exists(folder_path):
                shutil.rmtree(folder_path)
        except Exception as e:
            return str(e)
        return None
        
            
    