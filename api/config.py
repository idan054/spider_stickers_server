import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    API_KEY = os.getenv('LIONWHEEL_API_KEY', 'c_key_3694a9a7-6993-4d4a-8016-cedf0759f9eb')
    LIONWHEEL_URL = os.getenv('LIONWHEEL_URL', 'https://members.lionwheel.com/api/v1/tasks/create')