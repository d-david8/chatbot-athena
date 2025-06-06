import random
import string

class PasswordUtils:
    @staticmethod
    def generate_random_password(length=12):
        characters = string.ascii_letters + string.digits
        password = ''.join(random.choice(characters) for i in range(length))
        return password